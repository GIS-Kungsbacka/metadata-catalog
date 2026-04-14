import { queryConfig } from "../lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./index.css";

import MetadataGrid from "./pages/metadata/data-grid";
import MetadataCatalog from "./pages/metadata/catalog";
import ManagementPlanGrid from "./pages/management-plan/data-grid";
import { RootLayout } from "./layout/root-layout";
import FormView from "./pages/FormView";

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

const COLOR_MODE_KEY = "app-color-mode";

function readInitialMode(): "light" | "dark" {
  try {
    const saved = localStorage.getItem(COLOR_MODE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return "light";
}

function App() {
  const [mode, setMode] = React.useState<"light" | "dark">(() =>
    readInitialMode()
  );

  const toggleMode = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem(COLOR_MODE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#0f62fe" : "#8ab4ff",
          },
          background: {
            default: mode === "light" ? "#f6f8fb" : "#0f1115",
            paper: mode === "light" ? "#ffffff" : "#171a20",
          },
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily:
            "Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
        },
      }),
    [mode]
  );

  const router = React.useMemo(
    () =>
      createBrowserRouter(
        [
          {
            path: "/",
            element: <RootLayout mode={mode} onToggleMode={toggleMode} />,
            children: [
              { index: true, element: <Navigate to="/metadata" replace /> },
              { path: "metadata", element: <MetadataCatalog /> },
              { path: "metadata/list", element: <MetadataGrid mode={mode} /> },
              { path: "metadata/:gid", element: <FormView kind="metadata" /> },
              {
                path: "managementplan",
                element: <ManagementPlanGrid mode={mode} />,
              },
              {
                path: "managementplan/:gid",
                element: <FormView kind="managementplan" />,
              },
            ],
          },
        ],
        {
          // Align router root with Vite base (e.g. /geodata-app/)
          basename: import.meta.env.BASE_URL,
        }
      ),
    [mode, toggleMode]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
