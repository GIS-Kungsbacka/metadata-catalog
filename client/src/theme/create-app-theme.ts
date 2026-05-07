import { alpha, createTheme, type ThemeOptions } from "@mui/material/styles";

export type AppColorMode = "light" | "dark";

function buildThemeOptions(mode: AppColorMode): ThemeOptions {
  const isLight = mode === "light";

  const primaryMain = isLight ? "#0f62fe" : "#8ab4ff";
  const paper = isLight ? "#ffffff" : "#171a20";
  const surface = isLight ? "#f6f8fb" : "#0f1115";

  return {
    palette: {
      mode,
      primary: { main: primaryMain },
      secondary: { main: isLight ? "#7c3aed" : "#c4b5fd" },
      background: { default: surface, paper },
      divider: isLight ? "rgba(17, 24, 39, 0.12)" : "rgba(255, 255, 255, 0.12)",
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: "Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
      h4: { fontWeight: 800, letterSpacing: -0.2 },
      h5: { fontWeight: 800, letterSpacing: -0.15 },
      h6: { fontWeight: 750, letterSpacing: -0.1 },
      subtitle1: { fontWeight: 650 },
      button: { textTransform: "none", fontWeight: 650 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          "::selection": {
            backgroundColor: alpha(primaryMain, isLight ? 0.18 : 0.28),
          },
        },
      },

      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            paddingLeft: 14,
            paddingRight: 14,
          },
        },
      },

      MuiTextField: {
        defaultProps: { size: "small" },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            backgroundColor: theme.palette.background.paper,
            transition: theme.transitions.create(
              ["box-shadow", "border-color", "background-color"],
              { duration: theme.transitions.duration.shorter },
            ),
            "&.Mui-focused": {
              boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.18)}`,
            },
          }),
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundImage: "none",
            backgroundColor: alpha(theme.palette.background.paper, 0.92),
            backdropFilter: "saturate(140%) blur(10px)",
          }),
        },
      },

      // MUI X (DataGrid). The key is not part of MUI core typings.
      ...({
        MuiDataGrid: {
          styleOverrides: {
            root: {
              border: 0,
              "--DataGrid-rowBorderColor": "transparent",
            },
            columnHeaders: {
              borderBottom: "1px solid var(--mui-palette-divider)",
            },
            columnHeaderTitle: { fontWeight: 650 },
            cell: {
              borderBottom: "1px dotted var(--mui-palette-divider)",
            },
            row: {
              cursor: "pointer",
            },
            footerContainer: {
              borderTop: "1px solid var(--mui-palette-divider)",
            },
          },
        },
      } as unknown as Record<string, unknown>),
    },
  };
}

export function createAppTheme(mode: AppColorMode) {
  return createTheme(buildThemeOptions(mode));
}
