import * as React from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Typography,
  Tooltip,
  TextField,
  Menu,
  MenuItem,
  ListItemText,
  keyframes,
  Button,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  ExportCsv,
  ExportPrint,
  type GridDensity,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { useManagementPlan } from "../../hooks/useManagementPlan";
import type { ManagementPlan } from "../../types/management-plan";

const COLUMN_VISIBILITY_STORAGE_KEY = "managementplan-column-visibility";

type GridPreferenceEntry =
  | { key: "columnVisibilityModel"; value: Record<string, boolean> }
  | { key: "density"; value: GridDensity }
  | { key: "pageSize"; value: number };

type GridPreferenceStore = GridPreferenceEntry[];

function readGridPreferences(): {
  columnVisibilityModel: Record<string, boolean>;
  density: GridDensity;
  pageSize: number;
} {
  const fallback = {
    columnVisibilityModel: defaultColumnVisibility,
    density: "standard" as GridDensity,
    pageSize: 10,
  };

  try {
    const raw = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);

    // Back-compat: older versions stored just the visibility object.
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return {
        ...fallback,
        columnVisibilityModel: parsed as Record<string, boolean>,
      };
    }

    if (!Array.isArray(parsed)) return fallback;

    const store = parsed as GridPreferenceStore;
    const vis = store.find((e) => e.key === "columnVisibilityModel")
      ?.value as unknown;
    const density = store.find((e) => e.key === "density")?.value as unknown;
    const pageSize = store.find((e) => e.key === "pageSize")?.value as unknown;

    return {
      columnVisibilityModel:
        vis && typeof vis === "object" && !Array.isArray(vis)
          ? (vis as Record<string, boolean>)
          : fallback.columnVisibilityModel,
      density:
        density === "compact" ||
        density === "standard" ||
        density === "comfortable"
          ? (density as GridDensity)
          : fallback.density,
      pageSize: typeof pageSize === "number" ? pageSize : fallback.pageSize,
    };
  } catch {
    return fallback;
  }
}

function writeGridPreferences(prefs: {
  columnVisibilityModel: Record<string, boolean>;
  density: GridDensity;
  pageSize: number;
}) {
  const store: GridPreferenceStore = [
    { key: "columnVisibilityModel", value: prefs.columnVisibilityModel },
    { key: "density", value: prefs.density },
    { key: "pageSize", value: prefs.pageSize },
  ];

  try {
    localStorage.setItem(COLUMN_VISIBILITY_STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

function formatDateOnly(value: unknown): string {
  if (value === null || value === undefined) return "-";

  if (typeof value === "string") {
    const v = value.trim();
    const m = v.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : d.toISOString().slice(0, 10);
  }

  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? String(value)
      : d.toISOString().slice(0, 10);
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? String(value)
      : value.toISOString().slice(0, 10);
  }

  return String(value);
}

const defaultColumnVisibility = {
  gid: true,
  namn: true,
  titel: true,
  schemaNamn: true,
  sakerhetsklass: true,
  status: true,
  handlaggare: true,
  arendeNummberOpenE: true,
  skapadTidPunkt: true,
  bestallareNamn: false,
  bestallareEpost: false,
  datakallaTyp: false,
  dataAgare: false,
  dataForvaltare: false,
  dataAdministrator: false,
  dataKonsument: false,
  redigeringsKalla: false,
  publicerad: false,
  oppnaData: false,
  dokumentSkUrl: false,
  dokuementInfoUrl: false,
  ovrigInformation: false,
  kritiskDatamangd: false,
  arkivering: false,
  arkiveringTidpunkt: false,
  atkomst: false,
  integration: false,
  forvaltningsplanVersion: false,
  skapadAv: false,
  andradTidPunkt: false,
  andradAv: false,
};

const ColumnsToolbarButton = React.forwardRef(function ColumnsToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>,
  _ref
) {
  return (
    <Tooltip title="Kolumner">
      <ToolbarButton aria-label="Columns" {...props}>
        <ViewColumnOutlinedIcon fontSize="small" />
      </ToolbarButton>
    </Tooltip>
  );
});

function ManagementPlanToolbar({
  density,
  onDensityChange,
}: {
  density: GridDensity;
  onDensityChange: (d: GridDensity) => void;
}) {
  const [exportAnchor, setExportAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const exportOpen = Boolean(exportAnchor);

  const [densityAnchor, setDensityAnchor] = React.useState<null | HTMLElement>(
    null
  );
  const densityOpen = Boolean(densityAnchor);

  return (
    <Toolbar aria-label="Grid toolbar">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 0.5,
          px: 1.5,
          py: 1,
          minHeight: 52,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tooltip title="Täthet">
          <ToolbarButton
            aria-label="Density"
            onClick={(e) => setDensityAnchor(e.currentTarget)}
          >
            <DensityMediumOutlinedIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>

        <Menu
          anchorEl={densityAnchor}
          open={densityOpen}
          onClose={() => setDensityAnchor(null)}
        >
          {(["compact", "standard", "comfortable"] as GridDensity[]).map(
            (d) => (
              <MenuItem
                key={d}
                selected={density === d}
                onClick={() => {
                  onDensityChange(d);
                  setDensityAnchor(null);
                }}
              >
                <ListItemText
                  primary={
                    d === "compact"
                      ? "Kompakt"
                      : d === "standard"
                      ? "Standard"
                      : "Komfortabelt"
                  }
                />
              </MenuItem>
            )
          )}
        </Menu>

        <ColumnsPanelTrigger render={<ColumnsToolbarButton />} />

        <FilterPanelTrigger
          render={(props) => (
            <Tooltip title="Filtrera">
              <ToolbarButton aria-label="Filter" {...props}>
                <FilterAltOutlinedIcon fontSize="small" />
              </ToolbarButton>
            </Tooltip>
          )}
        />

        <Tooltip title="Exportera">
          <ToolbarButton
            style={{ marginTop: "3px" }}
            aria-label="Export"
            onClick={(e) => setExportAnchor(e.currentTarget)}
          >
            <DownloadOutlinedIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>

        <Menu
          anchorEl={exportAnchor}
          open={exportOpen}
          onClose={() => setExportAnchor(null)}
        >
          <MenuItem onClick={() => setExportAnchor(null)}>
            <ExportCsv
              options={{
                utf8WithBom: true,
                fileName: "Förvaltningsplan",
              }}
              render={(props) => (
                <Box
                  component="button"
                  type="button"
                  onClick={props.onClick}
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ListItemText primary="Exportera till CSV" />
                </Box>
              )}
            />
          </MenuItem>

          <MenuItem onClick={() => setExportAnchor(null)}>
            <ExportPrint
              render={(props) => (
                <Box
                  component="button"
                  type="button"
                  onClick={props.onClick}
                  style={{
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <ListItemText primary="Skriv ut" />
                </Box>
              )}
            />
          </MenuItem>
        </Menu>

        <QuickFilter defaultExpanded={false}>
          <Box
            sx={{
              ml: 1,
              display: "flex",
              alignItems: "center",
              width: 260,
            }}
          >
            <QuickFilterControl
              render={({ ref, ...props }) => (
                <TextField
                  {...props}
                  inputRef={ref}
                  aria-label="Search"
                  placeholder="Sök…"
                  size="small"
                  sx={{
                    width: 1,
                    "& .MuiInputBase-root": {
                      height: 34,
                      fontSize: 13,
                    },
                  }}
                />
              )}
            />
            <QuickFilterClear
              edge="end"
              size="small"
              aria-label="Clear search"
              material={{ sx: { marginRight: -0.75 } }}
            >
              <CancelIcon fontSize="small" />
            </QuickFilterClear>
          </Box>
        </QuickFilter>
      </Box>
    </Toolbar>
  );
}

export default function ManagementPlanGrid({
  mode,
}: {
  mode: "light" | "dark";
}) {
  const navigate = useNavigate();
  const {
    data: items = [],
    isLoading,
    isError,
    failureCount,
    isRefetchError,
  } = useManagementPlan();

  const columns: GridColDef<ManagementPlan>[] = [
    {
      field: "gid",
      headerName: "GID",
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    {
      field: "arendeNummberOpenE",
      headerName: "Ärendenummer OpenE",
      minWidth: 170,
      flex: 0.8,
    },
    // Most datasets have short "namn" values, so keep it compact.
    { field: "namn", headerName: "Namn", minWidth: 140, flex: 0.6 },
    { field: "titel", headerName: "Titel", minWidth: 140, flex: 0.6 },
    { field: "schemaNamn", headerName: "Schema", minWidth: 140, flex: 0.7 },
    {
      field: "sakerhetsklass",
      headerName: "Säkerhetsklass",
      minWidth: 140,
      flex: 0.5,
    },
    { field: "status", headerName: "Status", minWidth: 120, flex: 0.6 },
    {
      field: "handlaggare",
      headerName: "Handläggare",
      minWidth: 160,
      flex: 0.6,
    },
    {
      field: "skapadTidPunkt",
      headerName: "Skapad",
      minWidth: 120,
      flex: 0.6,
      valueFormatter: (value) => formatDateOnly(value),
    },
    {
      field: "bestallareNamn",
      headerName: "Beställare",
      minWidth: 160,
      flex: 0.8,
    },
    {
      field: "bestallareEpost",
      headerName: "Beställare e-post",
      minWidth: 160,
      flex: 0.9,
    },
    {
      field: "datakallaTyp",
      headerName: "Datakälla typ",
      minWidth: 160,
      flex: 0.6,
    },
    { field: "dataAgare", headerName: "Dataägare", minWidth: 160, flex: 0.6 },
    {
      field: "dataForvaltare",
      headerName: "Dataförvaltare",
      minWidth: 160,
      flex: 0.6,
    },
    {
      field: "dataAdministrator",
      headerName: "Dataadministratör",
      minWidth: 160,
      flex: 0.9,
      valueGetter: (_value, row) =>
        Array.isArray(row.dataAdministrator)
          ? row.dataAdministrator.filter(Boolean).join(", ")
          : "",
    },
    {
      field: "dataKonsument",
      headerName: "Datakonsument",
      minWidth: 160,
      flex: 0.9,
      valueGetter: (_value, row) =>
        Array.isArray(row.dataKonsument)
          ? row.dataKonsument.filter(Boolean).join(", ")
          : "",
    },
    {
      field: "redigeringsKalla",
      headerName: "Redigeringskälla",
      minWidth: 160,
      flex: 0.9,
      valueGetter: (_value, row) =>
        Array.isArray(row.redigeringsKalla)
          ? row.redigeringsKalla.filter(Boolean).join(", ")
          : "",
    },
    {
      field: "publicerad",
      headerName: "Publicerad",
      minWidth: 160,
      flex: 0.7,
      valueGetter: (_value, row) =>
        Array.isArray(row.publicerad)
          ? row.publicerad.filter(Boolean).join(", ")
          : "",
    },
    {
      field: "oppnaData",
      headerName: "Öppna data",
      type: "boolean",
      width: 120,
    },
    {
      field: "dokumentSkUrl",
      headerName: "Dokument SK URL",
      minWidth: 160,
      flex: 0.8,
    },
    {
      field: "dokuementInfoUrl",
      headerName: "Dokument info URL",
      minWidth: 160,
      flex: 0.8,
    },
    {
      field: "kritiskDatamangd",
      headerName: "Kritisk datamängd",
      type: "boolean",
      minWidth: 170,
      flex: 0.6,
    },
    { field: "arkivering", headerName: "Arkivering", minWidth: 150, flex: 0.6 },
    {
      field: "arkiveringTidpunkt",
      headerName: "Arkivering tidpunkt",
      minWidth: 170,
      flex: 0.6,
    },
    {
      field: "atkomst",
      headerName: "Åtkomst",
      minWidth: 140,
      flex: 0.6,
      valueGetter: (_value, row) =>
        Array.isArray(row.atkomst)
          ? row.atkomst.filter(Boolean).join(", ")
          : "",
    },
    {
      field: "integration",
      headerName: "Integration",
      minWidth: 160,
      flex: 0.9,
      valueGetter: (_value, row) =>
        Array.isArray(row.integration)
          ? row.integration.filter(Boolean).join(", ")
          : "",
    },
    { field: "forvaltningsplanVersion", headerName: "Version", width: 110 },
  ];

  const rows = items.map((item) => ({ ...item, id: item.gid }));

  const [gridPrefs, setGridPrefs] = React.useState(() => readGridPreferences());
  const { columnVisibilityModel, density, pageSize } = gridPrefs;

  const setColumnVisibilityModel = React.useCallback(
    (next: Record<string, boolean>) =>
      setGridPrefs((p) => ({ ...p, columnVisibilityModel: next })),
    []
  );

  const setDensity = React.useCallback(
    (next: GridDensity) => setGridPrefs((p) => ({ ...p, density: next })),
    []
  );

  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>(() => ({ page: 0, pageSize }));

  React.useEffect(() => {
    setPaginationModel((m) =>
      m.pageSize === pageSize ? m : { ...m, pageSize }
    );
  }, [pageSize]);

  React.useEffect(() => {
    writeGridPreferences(gridPrefs);
  }, [gridPrefs]);

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  const showApiDown = failureCount > 0 || isRefetchError || isError;
  const dots = keyframes`
    0% { content: ""; }
    33% { content: "."; }
    66% { content: ".."; }
    100% { content: "..."; }
  `;

  if (showApiDown) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          Kunde inte ladda förvaltningsplan. Försöker igen
          <Box
            component="span"
            sx={{
              "&::after": {
                content: '""',
                animation: `${dots} 1.5s steps(3, end) infinite`,
              },
            }}
          />
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 1, md: 4 }, mb: 6 }}>
      <Box
        mb={2}
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate("/")}
          sx={{ textTransform: "capitalize" }}
        >
          Tillbaka
        </Button>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, textAlign: "center" }}
        >
          Klicka på en rad för att se detaljer. Sök, filtrera, visa/dölj
          kolumner, exportera tabellen till CSV.
        </Typography>
        <Box sx={{ width: 110 }} />
      </Box>

      <Paper
        elevation={0}
        sx={{
          height: { xs: 300, md: 450, lg: 500, xl: 700 },
          width: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <DataGrid
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          localeText={GRID_DEFAULT_LOCALE_TEXT}
          rows={rows}
          columns={columns}
          checkboxSelection={false}
          disableRowSelectionOnClick
          onRowClick={(params) => navigate(`/managementplan/${params.row.gid}`)}
          pageSizeOptions={[10, 25, 50]}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={(m) => {
            setPaginationModel(m);
            setGridPrefs((p) =>
              p.pageSize === m.pageSize ? p : { ...p, pageSize: m.pageSize }
            );
          }}
          density={density}
          initialState={{
            sorting: { sortModel: [{ field: "gid", sort: "asc" }] },
          }}
          showToolbar
          slots={{
            toolbar: (props) => (
              <ManagementPlanToolbar
                {...props}
                density={density}
                onDensityChange={setDensity}
              />
            ),
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
            '& .MuiDataGrid-columnHeader[data-field="gid"] .MuiDataGrid-columnHeaderTitleContainer':
              { pl: 1 },
            "& .MuiDataGrid-columnSeparator": {
              color: mode === "light" ? "grey" : "white",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px dotted",
              borderColor: "divider",
            },
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within":
              {
                outline: "none",
              },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid",
              borderColor: "divider",
            },
          }}
        />
      </Paper>
    </Container>
  );
}
