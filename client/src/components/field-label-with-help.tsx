import { Box, Tooltip, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

type FieldLabelWithHelpProps = {
  label: string;
  helpText?: string;
};

export function FieldLabelWithHelp({
  label,
  helpText,
}: FieldLabelWithHelpProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mb: 0.25 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 900 }}
      >
        {label}
      </Typography>
      {helpText ? (
        <Tooltip
          title={helpText}
          arrow
          placement="top"
          enterDelay={200}
          slotProps={{
            tooltip: {
              sx: {
                maxWidth: 320,
                fontSize: "0.8125rem",
                lineHeight: 1.45,
              },
            },
          }}
        >
          <Box
            component="span"
            role="img"
            aria-label={`Förklaring: ${label}`}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              color: "text.secondary",
              cursor: "default",
              lineHeight: 0,
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 16 }} />
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
}
