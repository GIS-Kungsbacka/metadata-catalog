import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ViewModuleOutlinedIcon from "@mui/icons-material/ViewModuleOutlined";
import TableRowsOutlinedIcon from "@mui/icons-material/TableRowsOutlined";
import { useNavigate } from "react-router-dom";

export type MetadataView = "catalog" | "all";

type MetadataViewSwitcherProps = {
  view: MetadataView;
};

export function MetadataViewSwitcher({ view }: MetadataViewSwitcherProps) {
  const navigate = useNavigate();

  return (
    <ToggleButtonGroup
      exclusive
      value={view}
      onChange={(_, next: MetadataView | null) => {
        if (!next || next === view) return;
        navigate(next === "catalog" ? "/metadata" : "/metadata/list");
      }}
      size="small"
      aria-label="Växla metadatavy"
      sx={{
        bgcolor: "background.paper",
        "& .MuiToggleButton-root": {
          textTransform: "none",
          px: 1.5,
          gap: 0.75,
        },
      }}
    >
      <ToggleButton value="catalog" aria-label="Ämnesområden">
        <ViewModuleOutlinedIcon fontSize="small" />
        Ämnesområden
      </ToggleButton>
      <ToggleButton value="all" aria-label="Alla datamängder">
        <TableRowsOutlinedIcon fontSize="small" />
        Alla datamängder
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
