import * as React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { getInitials, useAuth } from "../hooks/useAuth";
import { SquareSpinnerComponent } from "../components/square-progress";

const DRAWER_OPEN_KEY = "app-drawer-open";
const DRAWER_WIDTH_OPEN = 260;
const DRAWER_WIDTH_CLOSED = 72;
const SITE_LOADING_MS_OPTIONS = [2000, 2500, 3000, 3500, 4000] as const;

function pickSiteLoadingMs(): number {
  const idx = Math.floor(Math.random() * SITE_LOADING_MS_OPTIONS.length);
  return SITE_LOADING_MS_OPTIONS[idx] ?? 3000;
}

function readDrawerOpen(): boolean {
  try {
    const raw = localStorage.getItem(DRAWER_OPEN_KEY);
    if (raw === null) return true;
    return raw === "true";
  } catch {
    return true;
  }
}

type RootLayoutProps = {
  mode: "light" | "dark";
  onToggleMode: () => void;
};

export function RootLayout({ mode, onToggleMode }: RootLayoutProps) {
  const { user } = useAuth();
  const [open, setOpen] = React.useState<boolean>(() => readDrawerOpen());
  const [isBootLoading, setIsBootLoading] = React.useState(true);
  const [siteLoadingMs] = React.useState<number>(() => pickSiteLoadingMs());

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsBootLoading(false);
    }, siteLoadingMs);
    return () => window.clearTimeout(timer);
  }, [siteLoadingMs]);

  const setOpenPersisted = React.useCallback((next: boolean) => {
    setOpen(next);
    try {
      localStorage.setItem(DRAWER_OPEN_KEY, String(next));
    } catch {}
  }, []);

  const drawerWidth = open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED;
  const username = user?.username ?? "";
  const initials = getInitials(username) || "U";

  if (isBootLoading) {
    return (
      <>
        <SquareSpinnerComponent />
        <Box
          sx={{
            position: "fixed",
            left: "50%",
            top: "60%",
            transform: "translate(-50%, 95px)",
            display: "grid",
            placeItems: "center",
            gap: 0.5,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Metadataportalen
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            Version 1.0
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            overflowX: "hidden",
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.shortest,
              }),
          },
        }}
      >
        {/* Logo + lock */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            px: open ? 1.5 : 0,
            py: 1.25,
            minHeight: 56,
          }}
        >
          <Box
            component={NavLink}
            to="/metadata"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: open ? "auto" : 0,
              overflow: "hidden",
            }}
          >
            {open ? (
              <Box
                component="img"
                src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/${
                  mode === "light" ? "kbaLogo.png" : "kbaLogo_vit.png"
                }`}
                alt="Logo"
                sx={{
                  width: 160,
                  height: 55,
                  objectFit: "contain",
                  ml: 4,
                }}
              />
            ) : null}
          </Box>

          <Tooltip title={open ? "Lås (minimera)" : "Lås (expandera)"}>
            <IconButton
              size="small"
              onClick={() => setOpenPersisted(!open)}
              aria-label={open ? "Collapse drawer" : "Expand drawer"}
              sx={{ ml: open ? 0 : 0 }}
            >
              {open ? (
                <LockOutlinedIcon fontSize="small" />
              ) : (
                <LockOpenOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        <List sx={{ pt: 1 }}>
          <ListItemButton
            component={NavLink}
            to="/metadata"
            sx={{
              mx: 1,
              borderRadius: 2,
              "&.active": {
                bgcolor: "action.selected",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 44 }}>
              <StorageOutlinedIcon />
            </ListItemIcon>
            {open ? <ListItemText primary="Metadatakatalog" /> : null}
          </ListItemButton>

          <ListItemButton
            component={NavLink}
            to="/managementplan"
            sx={{
              mx: 1,
              mt: 0.5,
              borderRadius: 2,
              "&.active": {
                bgcolor: "action.selected",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 44 }}>
              <DescriptionOutlinedIcon />
            </ListItemIcon>
            {open ? <ListItemText primary="Förvaltningsplan" /> : null}
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{ flex: 1, minWidth: 0, p: { xs: 1.5, md: 2.5 } }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            px: { xs: 1, md: 1.5 },
            py: 1,
            mb: 1,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip
              title={
                mode === "dark"
                  ? "Växla till ljust läge"
                  : "Växla till mörkt läge"
              }
            >
              <IconButton onClick={onToggleMode} color="primary">
                {mode === "dark" ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "primary.main",
                  fontSize: 14,
                }}
              >
                {initials}
              </Avatar>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, maxWidth: 220 }}
                noWrap
              >
                {username}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Outlet />
      </Box>
    </Box>
  );
}
