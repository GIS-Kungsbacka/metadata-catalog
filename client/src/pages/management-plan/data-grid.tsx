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
import { useNavigate } from "react-router-dom";

import { GRID_DEFAULT_LOCALE_TEXT } from "../../../constants/sv";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DensityMediumOutlinedIcon from "@mui/icons-material/DensityMediumOutlined";
import CancelIcon from "@mui/icons-material/Cancel";

import { useManagementPlan } from "../../hooks/useManagementPlan";
import type { ManagementPlan } from "../../types/management-plan";

const COLUMN_VISIBILITY_STORAGE_KEY = "managementplan-column-visibility";

const defaultColumnVisibility = {
  gid: true,
  namn: true,
  titel: true,
  schema: true,
  sakerhetsklass: true,
  status: true,
  handlaggare: true,
  arendeNummer: true,
  skapadTidPunkt: true,
  bestallareNamn: false,
  bestallareEpost: false,
  datakallaTyp: false,
  dataAgare: false,
  dataForvaltare: false,
  dataAdministrator: false,
  dataKonsument: false,
  redigeringsKalla: false,
  publicering: false,
  oppnaData: false,
  arkivering: false,
  arkiveringTidpunkt: false,
  atkomst: false,
  forvaltningsplanVersion: false,
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

export default function ManagementPlanGrid() {
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
      width: 90,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ pl: 2 }}>{params.value}</Box>
      ),
    },
    { field: "namn", headerName: "Namn", minWidth: 220, flex: 1.2 },
    { field: "titel", headerName: "Titel", minWidth: 200, flex: 1 },
    { field: "schema", headerName: "Schema", minWidth: 160, flex: 0.8 },
    { field: "sakerhetsklass", headerName: "Säkerhetsklass", minWidth: 160 },
    { field: "status", headerName: "Status", minWidth: 140 },
    { field: "handlaggare", headerName: "Handläggare", minWidth: 160 },
    { field: "arendeNummer", headerName: "Ärendenummer", minWidth: 160 },
    { field: "skapadTidPunkt", headerName: "Skapad", minWidth: 220 },
    { field: "bestallareNamn", headerName: "Beställare", minWidth: 170 },
    {
      field: "bestallareEpost",
      headerName: "Beställare e-post",
      minWidth: 220,
    },
    { field: "datakallaTyp", headerName: "Datakälla typ", minWidth: 190 },
    { field: "dataAgare", headerName: "Dataägare", minWidth: 170 },
    { field: "dataForvaltare", headerName: "Dataförvaltare", minWidth: 170 },
    {
      field: "dataAdministrator",
      headerName: "Dataadministratör",
      minWidth: 220,
      valueGetter: (_value, row) =>
        Array.isArray(row.dataAdministrator)
          ? row.dataAdministrator.filter(Boolean).join(", ")
          : "",
    },
    {
      field: "dataKonsument",
      headerName: "Datakonsument",
      minWidth: 220,
      valueGetter: (_value, row) =>
        Array.isArray(row.dataKonsument)
          ? row.dataKonsument.filter(Boolean).join(", ")
          : "",
    },
    {
      field: "redigeringsKalla",
      headerName: "Redigeringskälla",
      minWidth: 220,
      valueGetter: (_value, row) =>
        Array.isArray(row.redigeringsKalla)
          ? row.redigeringsKalla.filter(Boolean).join(", ")
          : "",
    },
    { field: "publicering", headerName: "Publicering", minWidth: 170 },
    {
      field: "oppnaData",
      headerName: "Öppna data",
      type: "boolean",
      minWidth: 140,
    },
    { field: "arkivering", headerName: "Arkivering", minWidth: 170 },
    {
      field: "arkiveringTidpunkt",
      headerName: "Arkivering tidpunkt",
      minWidth: 200,
    },
    {
      field: "atkomst",
      headerName: "Åtkomst",
      minWidth: 220,
      valueGetter: (_value, row) =>
        Array.isArray(row.atkomst)
          ? row.atkomst.filter(Boolean).join(", ")
          : "",
    },
    { field: "forvaltningsplanVersion", headerName: "Version", minWidth: 120 },
  ];

  const rows = items.map((item) => ({ ...item, id: item.gid }));

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
    <Container maxWidth="xl" sx={{ mt: { xs: 1, md: 3 }, mb: 6 }}>
      <Box mb={2}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Förvaltningsplan
        </Typography>
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
          onRowClick={(params) => navigate(`/managementplan/${params.row.gid}`)}
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
