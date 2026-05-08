import * as React from "react";
import {
  Box,
  Container,
  Paper,
  Alert,
  Typography,
  Chip,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  Tooltip,
  TextField,
  keyframes,
  CircularProgress,
} from "@mui/material";

import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridFilterModel,
  type GridToolbarProps,
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

import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { useMetadata } from "../../hooks/useMetadata";
import { useManagementPlan } from "../../hooks/useManagementPlan";
import type { Metadata } from "../../types/metadata";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { statusChipColor } from "../../utils/status-chip";

const COLUMN_VISIBILITY_STORAGE_KEY = "metadata-column-visibility";

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

  const enforceHiddenColumns = (model: Record<string, boolean>) => ({
    ...model,
    gid: false,
  });

  try {
    const raw = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);

    // Back-compat: older versions stored just the visibility object.
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return {
        ...fallback,
        columnVisibilityModel: enforceHiddenColumns(
          parsed as Record<string, boolean>,
        ),
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
          ? enforceHiddenColumns(vis as Record<string, boolean>)
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
  } catch {
    // Ignore errors
  }
}

const defaultColumnVisibility = {
  gid: false,
  namn: true,
  forvaltningsplanTitel: true,
  schemaNamn: true,
  sakerhetsKlass: true,
  status: true,
  handlaggare: true,
  arendeNummerOpenE: true,
  bestallareNamn: false,
  bestallareEpost: false,
  beskrivning: false,
  ursprung: false,
  syfte: false,
  dataKallaTyp: false,
  metod: false,
  metodUrl: false,
  projekt: false,
  geografiskBegransning: false,
  uppdateringsFrekvens: false,
  fullstandighet: false,
  skalniva: false,
  nyckelOrd: false,
  kategori: true,
  tidsperiod: false,
  tidsperiodStartdatum: false,
  tidsperiodSlutdatum: false,
  tidsUpplosning: false,
  skapelseDatum: false,
  anvandarBegransningLicens: false,
  anvandarBegransningLicensText: false,
  relateradeResurser: false,
  metaDataVersion: false,
  kolumnBeskrivningUrl: false,
};

const ColumnsToolbarButton = React.forwardRef(function ColumnsToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>,
) {
  return (
    <Tooltip title="Kolumner">
      <ToolbarButton aria-label="Columns" {...props}>
        <ViewColumnOutlinedIcon fontSize="small" />
      </ToolbarButton>
    </Tooltip>
  );
});

type MetadataToolbarProps = GridToolbarProps & {
  density?: GridDensity;
  onDensityChange?: (d: GridDensity) => void;
};

function MetadataToolbar({
  density,
  onDensityChange,
  ...toolbarProps
}: MetadataToolbarProps) {
  const effectiveDensity = density ?? ("standard" as GridDensity);
  const effectiveOnDensityChange = onDensityChange ?? (() => {});

  const [exportAnchor, setExportAnchor] = React.useState<null | HTMLElement>(
    null,
  );
  const exportOpen = Boolean(exportAnchor);

  const [densityAnchor, setDensityAnchor] = React.useState<null | HTMLElement>(
    null,
  );
  const densityOpen = Boolean(densityAnchor);

  return (
    <Toolbar aria-label="Grid toolbar" {...toolbarProps}>
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
                selected={effectiveDensity === d}
                onClick={() => {
                  effectiveOnDensityChange(d);
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
            ),
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
                fileName: "Metadata",
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

function renderStringArray(value: unknown) {
  if (!Array.isArray(value)) return value ? String(value) : "";
  return value.filter(Boolean).join(", ");
}

export default function MetadataGrid({ mode }: { mode: "light" | "dark" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedKategori = (searchParams.get("kategori") ?? "").trim();
  const selectedKategoriLower = selectedKategori.toLowerCase();

  const {
    data: items = [],
    isLoading,
    isError,
    failureCount,
    isRefetchError,
  } = useMetadata();

  const { data: managementPlans = [] } = useManagementPlan();
  const planTitleByArende = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const p of managementPlans) {
      const arende = (p.arendeNummberOpenE ?? "").trim();
      if (!arende) continue;

      const title = (p.titel ?? p.namn ?? "").trim();
      if (!title) continue;

      // If multiple plans share the same ärendenummer, keep the first
      // non-empty title we see.
      if (!map.has(arende)) map.set(arende, title);
    }
    return map;
  }, [managementPlans]);

  const [gridPrefs, setGridPrefs] = React.useState(() => readGridPreferences());
  const { columnVisibilityModel, density, pageSize } = gridPrefs;

  const setColumnVisibilityModel = React.useCallback(
    (next: Record<string, boolean>) =>
      setGridPrefs((p) => ({ ...p, columnVisibilityModel: next })),
    [],
  );

  const setDensity = React.useCallback(
    (next: GridDensity) => setGridPrefs((p) => ({ ...p, density: next })),
    [],
  );

  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>(() => ({ page: 0, pageSize }));

  React.useEffect(() => {
    setPaginationModel((m) =>
      m.pageSize === pageSize ? m : { ...m, pageSize },
    );
  }, [pageSize]);

  React.useEffect(() => {
    writeGridPreferences(gridPrefs);
  }, [gridPrefs]);

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>(() => ({
    items: [],
    quickFilterValues: [],
    quickFilterExcludeHiddenColumns: false,
  }));

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
          Kunde inte ladda metadata. Försöker igen
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

  const columns: GridColDef<Metadata>[] = [
    {
      field: "gid",
      headerName: "GID",
      width: 80,
      hideable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    {
      field: "arendeNummerOpenE",
      headerName: "Ärendenummer OpenE",
      minWidth: 180,
      hideable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
      flex: 1,
    },
    // "namn" is often short in this dataset, so keep it compact.
    { field: "namn", headerName: "Namn", minWidth: 150, flex: 1 },
    {
      field: "forvaltningsplanTitel",
      headerName: "Titel",
      minWidth: 170,
      flex: 0.7,
      valueGetter: (_value, row) => {
        const arende = (row.arendeNummerOpenE ?? "").trim();
        return arende ? (planTitleByArende.get(arende) ?? "") : "";
      },
    },
    { field: "schemaNamn", headerName: "Schema", minWidth: 140, flex: 0.7 },
    {
      field: "sakerhetsKlass",
      headerName: "Säkerhetsklass",
      minWidth: 140,
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 110,
      flex: 0.4,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <Chip
            label={String(params.value)}
            size="small"
            color={statusChipColor(String(params.value))}
            variant="filled"
          />
        ) : (
          "-"
        ),
    },
    {
      field: "handlaggare",
      headerName: "Handläggare",
      minWidth: 170,
      flex: 0.6,
    },
    {
      field: "bestallareNamn",
      headerName: "Beställare",
      minWidth: 170,
      flex: 0.6,
    },
    {
      field: "bestallareEpost",
      headerName: "Beställare e-post",
      minWidth: 220,
      flex: 0.9,
    },
    {
      field: "beskrivning",
      headerName: "Beskrivning",
      minWidth: 320,
      flex: 1.6,
    },
    { field: "syfte", headerName: "Syfte", minWidth: 300, flex: 1.5 },
    {
      field: "dataKallaTyp",
      headerName: "Datakälla typ",
      minWidth: 160,
      flex: 0.6,
    },
    {
      field: "ursprung",
      headerName: "Ursprung",
      minWidth: 200,
      flex: 0.9,
      valueGetter: (_value, row) => renderStringArray(row.ursprung),
    },
    { field: "metod", headerName: "Metod", minWidth: 140, flex: 0.5 },
    { field: "metodUrl", headerName: "Metod URL", minWidth: 240, flex: 1.1 },
    { field: "projekt", headerName: "Projekt", width: 120 },
    {
      field: "geografiskBegransning",
      headerName: "Geografisk begränsning",
      minWidth: 240,
      flex: 1.2,
      valueGetter: (_value, row) =>
        renderStringArray(row.geografiskBegransning),
    },
    {
      field: "uppdateringsFrekvens",
      headerName: "Uppdateringsfrekvens",
      minWidth: 220,
      flex: 0.7,
    },
    {
      field: "fullstandighet",
      headerName: "Fullständighet",
      minWidth: 160,
      flex: 0.6,
    },
    { field: "skalniva", headerName: "Skalnivå", width: 120 },
    {
      field: "nyckelOrd",
      headerName: "Nyckelord",
      minWidth: 220,
      flex: 0.9,
      valueGetter: (_value, row) => renderStringArray(row.nyckelOrd),
    },
    { field: "kategori", headerName: "Kategori", minWidth: 140, flex: 0.5 },
    {
      field: "tidsperiod",
      headerName: "Tidsperiod",
      type: "boolean",
      width: 120,
    },
    { field: "tidsperiodStartdatum", headerName: "Startdatum", width: 130 },
    { field: "tidsperiodSlutdatum", headerName: "Slutdatum", width: 130 },
    {
      field: "tidsUpplosning",
      headerName: "Tidsupplösning",
      minWidth: 150,
      flex: 0.6,
    },
    { field: "skapelseDatum", headerName: "Skapelsedatum", width: 140 },
    {
      field: "anvandarBegransningLicens",
      headerName: "Licensbegränsning",
      type: "boolean",
      minWidth: 180,
      flex: 0.6,
    },
    {
      field: "anvandarBegransningLicensText",
      headerName: "Licenstext",
      minWidth: 220,
      flex: 1.1,
    },
    {
      field: "relateradeResurser",
      headerName: "Relaterade resurser",
      minWidth: 220,
      flex: 0.9,
      valueGetter: (_value, row) => renderStringArray(row.relateradeResurser),
    },
    { field: "metaDataVersion", headerName: "Version", width: 110 },
    {
      field: "kolumnBeskrivningUrl",
      headerName: "Kolumnbeskrivning URL",
      minWidth: 240,
      flex: 1.2,
    },
  ];

  const filteredItems = selectedKategori
    ? items.filter(
        (i) => (i.kategori ?? "").toLowerCase() === selectedKategoriLower,
      )
    : items;

  const rows = filteredItems.map((item) => ({ ...item, id: item.gid }));

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 1, md: 4 }, mb: 6 }}>
      <Box
        mb={2}
        sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate("/metadata")}
          sx={{ textTransform: "capitalize" }}
        >
          Tillbaka
        </Button>
        <Typography variant="body2" sx={{ fontWeight: 600, ml: "auto" }}>
          Klicka på en rad för att se fler detaljer. Du kan även söka, filtrera,
          visa/dölja kolumner och exportera tabellen till CSV.
        </Typography>
        {selectedKategori ? (
          <Chip
            label={`Ämnesområde: ${selectedKategori} (${rows.length})`}
            sx={{ ml: "auto" }}
            variant="outlined"
          />
        ) : null}
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
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          checkboxSelection={false}
          disableRowSelectionOnClick
          onRowClick={(params) =>
            navigate(
              params.row.schemaNamn && params.row.namn
                ? `/metadata/${encodeURIComponent(
                    `${String(params.row.schemaNamn).trim()}_${String(
                      params.row.namn,
                    ).trim()}`,
                  )}`
                : `/metadata`,
              {
                state: { backTo: `/metadata/list${location.search}` },
              },
            )
          }
          pageSizeOptions={[10, 25, 50]}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={(m) => {
            setPaginationModel(m);
            setGridPrefs((p) =>
              p.pageSize === m.pageSize ? p : { ...p, pageSize: m.pageSize },
            );
          }}
          density={density}
          initialState={{
            sorting: { sortModel: [{ field: "gid", sort: "asc" }] },
          }}
          showToolbar
          slots={{
            toolbar: MetadataToolbar,
          }}
          slotProps={{
            toolbar: {
              density,
              onDensityChange: setDensity,
            } as unknown as Partial<MetadataToolbarProps>,
          }}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 600 },
            '& .MuiDataGrid-columnHeader[data-field="arendeNummerOpenE"] .MuiDataGrid-columnHeaderTitleContainer':
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
              { outline: "none" },
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
