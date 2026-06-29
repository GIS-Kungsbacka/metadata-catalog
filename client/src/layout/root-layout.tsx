import * as React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
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
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

import { getInitials, useAuth } from "../hooks/useAuth";
import { useMetadata } from "../hooks/useMetadata";
import { useManagementPlan } from "../hooks/useManagementPlan";
import { SquareSpinnerComponent } from "../components/square-progress";
import { useClientConfig } from "../config/client-config";
import { publicAssetUrl } from "../utils/public-asset-url";
import {
  generateAllManagementPlanPDF,
  generateAllMetadataPDF,
} from "../utils/pdf-export";

const DRAWER_OPEN_KEY = "app-drawer-open";
const DRAWER_WIDTH_OPEN = 260;
const DRAWER_WIDTH_CLOSED = 72;
const SITE_LOADING_MS_OPTIONS = [1500, 2000, 2500, 3000, 3500] as const;

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
  const config = useClientConfig();
  const [open, setOpen] = React.useState<boolean>(() => readDrawerOpen());
  const [isBootLoading, setIsBootLoading] = React.useState(true);
  const [siteLoadingMs] = React.useState<number>(() => pickSiteLoadingMs());
  const [isPdfExporting, setIsPdfExporting] = React.useState(false);
  const [pdfMenuAnchor, setPdfMenuAnchor] = React.useState<null | HTMLElement>(
    null,
  );

  const metadataQuery = useMetadata();
  const managementPlanQuery = useManagementPlan();

  const metadataCount = metadataQuery.data?.length ?? 0;
  const managementPlanCount = managementPlanQuery.data?.length ?? 0;
  const isPdfDataLoading =
    metadataQuery.isLoading || managementPlanQuery.isLoading;
  const pdfMenuOpen = Boolean(pdfMenuAnchor);

  const handlePdfMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPdfMenuAnchor(event.currentTarget);
  };

  const handlePdfMenuClose = () => {
    setPdfMenuAnchor(null);
  };

  const handleDownloadPdf = React.useCallback(
    (kind: "metadata" | "managementplan") => {
      handlePdfMenuClose();

      const metadataItems = metadataQuery.data ?? [];
      const managementPlanItems = managementPlanQuery.data ?? [];
      const itemCount =
        kind === "metadata" ? metadataItems.length : managementPlanItems.length;
      if (itemCount === 0) return;

      setIsPdfExporting(true);
      window.setTimeout(() => {
        try {
          if (kind === "metadata") {
            generateAllMetadataPDF(metadataItems);
          } else {
            generateAllManagementPlanPDF(managementPlanItems);
          }
        } finally {
          setIsPdfExporting(false);
        }
      }, 0);
    },
    [metadataQuery.data, managementPlanQuery.data],
  );

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
    } catch {
      // Ignore errors
    }
  }, []);

  const drawerWidth = open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED;
  const username = user?.username ?? "";
  const initials = getInitials(username) || "";
  const drawerLogoSrc = React.useMemo(() => {
    const fallback = mode === "light" ? "kbaLogo.png" : "kbaLogo_vit.png";
    const fromConfig =
      mode === "light" ? config.drawerLogoLight : config.drawerLogoDark;
    return publicAssetUrl(fromConfig || fallback);
  }, [config.drawerLogoDark, config.drawerLogoLight, mode]);

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
                src={drawerLogoSrc}
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
                bgcolor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(138, 180, 255, 0.14)"
                    : "rgba(15, 98, 254, 0.10)",
                color: "primary.main",
                "& .MuiListItemIcon-root": { color: "primary.main" },
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
            to="/forvaltningsplan"
            sx={{
              mx: 1,
              mt: 0.5,
              borderRadius: 2,
              "&.active": {
                bgcolor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(138, 180, 255, 0.14)"
                    : "rgba(15, 98, 254, 0.10)",
                color: "primary.main",
                "& .MuiListItemIcon-root": { color: "primary.main" },
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
        <Paper
          variant="outlined"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            mb: 2,
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: (t) =>
              t.palette.mode === "dark"
                ? "rgba(23, 26, 32, 0.75)"
                : "rgba(255, 255, 255, 0.75)",
            backdropFilter: "saturate(140%) blur(10px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              px: { xs: 1.25, md: 2 },
              py: 1,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="Ladda ner som PDF">
                <span>
                  <IconButton
                    onClick={handlePdfMenuOpen}
                    color="primary"
                    disabled={isPdfExporting || isPdfDataLoading}
                    aria-label="Ladda ner som PDF"
                    aria-controls={pdfMenuOpen ? "pdf-export-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={pdfMenuOpen ? "true" : undefined}
                  >
                    {isPdfExporting || isPdfDataLoading ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      <PictureAsPdfOutlinedIcon />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
              <Menu
                id="pdf-export-menu"
                anchorEl={pdfMenuAnchor}
                open={pdfMenuOpen}
                onClose={handlePdfMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem
                  onClick={() => handleDownloadPdf("metadata")}
                  disabled={metadataCount === 0}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <StorageOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Metadatakatalog"
                    secondary={
                      metadataCount === 0
                        ? "Inga objekt"
                        : `${metadataCount} objekt`
                    }
                  />
                </MenuItem>
                <MenuItem
                  onClick={() => handleDownloadPdf("managementplan")}
                  disabled={managementPlanCount === 0}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <DescriptionOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Förvaltningsplan"
                    secondary={
                      managementPlanCount === 0
                        ? "Inga objekt"
                        : `${managementPlanCount} objekt`
                    }
                  />
                </MenuItem>
              </Menu>
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
              </Stack>
            </Stack>
          </Box>
        </Paper>

        <Outlet />
      </Box>
    </Box>
  );
}
