import type { ChipProps } from "@mui/material/Chip";

function normalizeStatus(v: unknown): string {
  return String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function statusChipColor(
  status: unknown
): Exclude<ChipProps["color"], undefined> {
  const v = normalizeStatus(status);
  if (!v) return "default";

  if (v === "granskas") return "warning"; // orange-ish in MUI
  if (v === "godkand" || v === "godkänd") return "success"; // green
  if (v === "klar") return "success";

  return "default";
}

