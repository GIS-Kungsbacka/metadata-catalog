import * as React from "react";
import { publicAssetUrl } from "../utils/public-asset-url";

export type ClientConfig = {
  faviconHref?: string;
  spinnerLogoLight?: string;
  spinnerLogoDark?: string;
  defaultCategoryImage?: string;
  categoryImages?: Record<string, string>;
};

let cached: Promise<ClientConfig> | null = null;

export function getClientConfig(): Promise<ClientConfig> {
  if (cached) return cached;

  const url = publicAssetUrl("config.json");
  cached = fetch(url, { cache: "no-cache" })
    .then(async (r) => {
      if (!r.ok) throw new Error(`Failed to load config: ${r.status}`);
      return (await r.json()) as ClientConfig;
    })
    .catch(() => ({} as ClientConfig));

  return cached;
}

export function useClientConfig() {
  const [config, setConfig] = React.useState<ClientConfig>({});

  React.useEffect(() => {
    let alive = true;
    getClientConfig().then((c) => {
      if (alive) setConfig(c ?? {});
    });
    return () => {
      alive = false;
    };
  }, []);

  return config;
}
