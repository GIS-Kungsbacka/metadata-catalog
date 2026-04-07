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
} from "@mui/x-data-grid";

import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { useMetadata } from "../../hooks/useMetadata";
import type { Metadata } from "../../types/metadata";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const COLUMN_VISIBILITY_STORAGE_KEY = "metadata-column-visibility";

const defaultColumnVisibility = {
  gid: true,
  namn: true,
  schema: true,
  sakerhetsKlass: true,
  status: true,
  handlaggare: true,
  arendeNummer: true,
  bestallareNamn: false,
  bestallareEpost: false,
  skapadTidPunkt: true,
  beskrivning: false,
  syfte: false,
  dataKallaTyp: false,
  datakalla: false,
  metod: false,
  projekt: false,
  geografiskBegransning: false,
  uppdateringsFrekvens: false,
  fullstandighet: false,
  skalniva: false,
  nyckelOrd: false,
  kategori: false,
  tidsperiod: false,
  tidsperiodStartdatum: false,
  tidsperiodSlutdatum: false,
  tidsUpplosning: false,
  skapelseDatum: false,
  anvandarBegransningLicens: false,
  anvandarBegransningLicensText: false,
  relateradeResurser: false,
  metaDataVersion: false,
  sakerhetsKlassDokument: false,
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

function MetadataToolbar({
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

function statusChipColor(s: string | undefined) {
  const v = (s ?? "").toLowerCase().trim();
  if (!v) return "default";
  if (v === "granskas" || v === "granskas ") return "warning";
  if (v === "klar" || v === "godkand" || v === "godkänd") return "success";
  return "default";
}

function renderStringArray(value: unknown) {
  if (!Array.isArray(value)) return value ? String(value) : "";
  return value.filter(Boolean).join(", ");
}

export default function MetadataGrid() {
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

  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState(
    () => {
      try {
        const saved = localStorage.getItem(COLUMN_VISIBILITY_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultColumnVisibility;
      } catch {
        return defaultColumnVisibility;
      }
    }
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(
        COLUMN_VISIBILITY_STORAGE_KEY,
        JSON.stringify(columnVisibilityModel)
      );
    } catch {}
  }, [columnVisibilityModel]);

  const [density, setDensity] = React.useState<GridDensity>("standard");

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
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    { field: "namn", headerName: "Namn", minWidth: 220, flex: 1.2 },
    { field: "schema", headerName: "Schema", minWidth: 180, flex: 1 },
    {
      field: "sakerhetsKlass",
      headerName: "Säkerhetsklass",
      minWidth: 160,
      flex: 0.9,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.7,
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
      minWidth: 160,
      flex: 0.8,
    },
    { field: "arendeNummer", headerName: "Ärendenummer", minWidth: 160 },
    { field: "bestallareNamn", headerName: "Beställare", minWidth: 170 },
    {
      field: "bestallareEpost",
      headerName: "Beställare e-post",
      minWidth: 220,
    },
    { field: "skapadTidPunkt", headerName: "Skapad", minWidth: 220 },
    {
      field: "beskrivning",
      headerName: "Beskrivning",
      minWidth: 260,
      flex: 1.2,
    },
    { field: "syfte", headerName: "Syfte", minWidth: 260, flex: 1.2 },
    { field: "dataKallaTyp", headerName: "Datakälla typ", minWidth: 190 },
    {
      field: "datakalla",
      headerName: "Datakälla",
      minWidth: 200,
      valueGetter: (_value, row) => renderStringArray(row.datakalla),
    },
    { field: "metod", headerName: "Metod", minWidth: 150 },
    { field: "projekt", headerName: "Projekt", minWidth: 120 },
    {
      field: "geografiskBegransning",
      headerName: "Geografisk begränsning",
      minWidth: 240,
      valueGetter: (_value, row) =>
        renderStringArray(row.geografiskBegransning),
    },
    {
      field: "uppdateringsFrekvens",
      headerName: "Uppdateringsfrekvens",
      minWidth: 220,
    },
    { field: "fullstandighet", headerName: "Fullständighet", minWidth: 180 },
    { field: "skalniva", headerName: "Skalnivå", minWidth: 120 },
    {
      field: "nyckelOrd",
      headerName: "Nyckelord",
      minWidth: 220,
      valueGetter: (_value, row) => renderStringArray(row.nyckelOrd),
    },
    { field: "kategori", headerName: "Kategori", minWidth: 170 },
    {
      field: "tidsperiod",
      headerName: "Tidsperiod",
      type: "boolean",
      minWidth: 120,
    },
    { field: "tidsperiodStartdatum", headerName: "Startdatum", minWidth: 140 },
    { field: "tidsperiodSlutdatum", headerName: "Slutdatum", minWidth: 140 },
    { field: "tidsUpplosning", headerName: "Tidsupplösning", minWidth: 160 },
    { field: "skapelseDatum", headerName: "Skapelsedatum", minWidth: 150 },
    {
      field: "anvandarBegransningLicens",
      headerName: "Licensbegränsning",
      type: "boolean",
      minWidth: 180,
    },
    {
      field: "anvandarBegransningLicensText",
      headerName: "Licenstext",
      minWidth: 220,
    },
    {
      field: "relateradeResurser",
      headerName: "Relaterade resurser",
      minWidth: 220,
      valueGetter: (_value, row) => renderStringArray(row.relateradeResurser),
    },
    { field: "metaDataVersion", headerName: "Version", minWidth: 120 },
    { field: "sakerhetsKlassDokument", headerName: "Dokument", minWidth: 200 },
  ];

  const filteredItems = selectedKategori
    ? items.filter(
        (i) => (i.kategori ?? "").toLowerCase() === selectedKategoriLower
      )
    : items;

  const rows = filteredItems.map((item) => ({ ...item, id: item.gid }));

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 1, md: 4 } }}>
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
          Sök, filtrera, visa/dölj kolumner och exportera metadata.
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
          height: { xs: 380, md: 520, lg: 650, xl: 700 },
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
          onRowClick={(params) =>
            navigate(`/metadata/${params.row.gid}`, {
              state: { backTo: `/metadata/list${location.search}` },
            })
          }
          pageSizeOptions={[10, 25, 50]}
          pagination
          density={density}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: "gid", sort: "asc" }] },
          }}
          showToolbar
          slots={{
            toolbar: (props) => (
              <MetadataToolbar
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
              display: "block",
              color: "divider",
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
