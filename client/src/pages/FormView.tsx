import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArrowBack, Download } from "@mui/icons-material";
import jsPDF from "jspdf";
import { useMetadataById } from "../hooks/useMetadata";
import { useManagementPlanById } from "../hooks/useManagementPlan";
import type { Metadata } from "../types/metadata";
import type { ManagementPlan } from "../types/management-plan";
import { statusChipColor } from "../utils/status-chip";

const metadataFieldLabels: Partial<Record<keyof Metadata, string>> = {
  gid: "GID",
  namn: "Namn",
  schemaNamn: "Schema",
  beskrivning: "Beskrivning",
  ursprung: "Ursprung",
  syfte: "Syfte",
  kategori: "Kategori",
  status: "Status",
  handlaggare: "Handläggare",
  arendeNummerOpenE: "Ärendenummer",
  bestallareNamn: "Beställare",
  bestallareEpost: "Beställare e-post",
  sakerhetsKlass: "Säkerhetsklass",
  dataKallaTyp: "Datakälla typ",
  metod: "Metod",
  metodUrl: "Metod URL",
  projekt: "Projekt",
  geografiskBegransning: "Geografisk begränsning",
  uppdateringsFrekvens: "Uppdateringsfrekvens",
  fullstandighet: "Fullständighet",
  skalniva: "Skalnivå",
  nyckelOrd: "Nyckelord",
  tidsperiod: "Tidsperiod",
  tidsperiodStartdatum: "Startdatum",
  tidsperiodSlutdatum: "Slutdatum",
  tidsUpplosning: "Tidsupplösning",
  skapelseDatum: "Skapelsedatum",
  anvandarBegransningLicens: "Licensbegränsning",
  anvandarBegransningLicensText: "Licenstext",
  relateradeResurser: "Relaterade resurser",
  kolumnBeskrivningUrl: "Kolumnbeskrivning URL",
  metaDataVersion: "Version",
};

const managementPlanFieldLabels: Partial<Record<keyof ManagementPlan, string>> =
  {
    gid: "GID",
    namn: "Namn",
    titel: "Titel",
    schemaNamn: "Schema",
    status: "Status",
    handlaggare: "Handläggare",
    arendeNummberOpenE: "Ärendenummer",
    bestallareNamn: "Beställare",
    bestallareEpost: "Beställare e-post",
    sakerhetsklass: "Säkerhetsklass",
    datakallaTyp: "Datakälla typ",
    dataAgare: "Dataägare",
    dataForvaltare: "Dataförvaltare",
    dataAdministrator: "Dataadministratör",
    dataKonsument: "Datakonsument",
    redigeringsKalla: "Redigeringskälla",
    publicerad: "Publicerad",
    oppnaData: "Öppna data",
    dokumentSkUrl: "Dokument SK URL",
    dokuementInfoUrl: "Dokument info URL",
    ovrigInformation: "Övrig information",
    kritiskDatamangd: "Kritisk datamängd",
    arkivering: "Arkivering",
    arkiveringTidpunkt: "Arkivering tidpunkt",
    atkomst: "Åtkomst",
    integration: "Integration",
    forvaltningsplanVersion: "Version",
    skapadTidPunkt: "Skapad",
    skapadAv: "Skapad av",
    andradTidPunkt: "Ändrad",
    andradAv: "Ändrad av",
  };

function formatDateOnly(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const v = value.trim();
    const m = v.match(/^(\d{4}-\d{2}-\d{2})/);
    if (m) return m[1];
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return undefined;
  }

  if (typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return undefined;
  }

  if (value instanceof Date) {
    if (!Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
    return undefined;
  }

  return undefined;
}

function formatValue(value: unknown, key?: string): string {
  if (value === null || value === undefined) return "-";

  if (key === "skapadTidPunkt" || key === "andradTidPunkt") {
    return formatDateOnly(value) ?? "-";
  }

  if (typeof value === "boolean") return value ? "Ja" : "Nej";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  return String(value);
}

function generatePDF(
  title: string,
  item: Record<string, unknown>,
  fieldLabels: Record<string, string>
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;

    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Title
  addText(title || "Detaljer", 18, true);
  yPosition += 5;

  // Add chips info if available
  const chipsInfo: string[] = [];
  if (typeof item.kategori === "string" && item.kategori.trim())
    chipsInfo.push(`Kategori: ${item.kategori}`);
  if (typeof item.status === "string" && item.status.trim())
    chipsInfo.push(`Status: ${item.status}`);
  if (chipsInfo.length > 0) {
    addText(chipsInfo.join(" | "), 12);
    yPosition += 5;
  }

  yPosition += 5;

  addText("Fält", 14, true);
  yPosition += 3;

  Object.keys(fieldLabels).forEach((key) => {
    const label = fieldLabels[key];
    if (!label) return;
    const value = formatValue(item[key], key);
    addText(`${label}: ${value}`, 11);
  });

  // Generate filename
  const filename = `${(title || "Detaljer").replace(/[^a-z0-9]/gi, "_")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  // Save the PDF
  doc.save(filename);
}

export default function FormView({
  kind,
}: {
  kind: "metadata" | "managementplan";
}) {
  const { gid } = useParams<{ gid: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const numericGid = Number(gid);
  const gidIsValid = Number.isFinite(numericGid) && numericGid > 0;

  const metadataQuery = useMetadataById(numericGid);
  const managementPlanQuery = useManagementPlanById(numericGid);

  const query = kind === "metadata" ? metadataQuery : managementPlanQuery;
  const item = query.data as Metadata | ManagementPlan | undefined;
  const isLoading = query.isLoading;
  const error = query.error;

  const fieldLabels =
    kind === "metadata" ? metadataFieldLabels : managementPlanFieldLabels;

  const backToFromState =
    typeof (location.state as any)?.backTo === "string"
      ? ((location.state as any).backTo as string)
      : undefined;

  const backTo =
    backToFromState ??
    (kind === "metadata" ? "/metadata/list" : "/managementplan");
  const heading = kind === "metadata" ? "Metadata" : "Förvaltningsplan";

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!gidIsValid) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Ogiltigt id.</Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(backTo)}
            sx={{ mt: 2 }}
          >
            Tillbaka
          </Button>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error instanceof Error
              ? error.message
              : "Kunde inte ladda detaljer. Försök igen senare."}
          </Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(backTo)}
            sx={{ mt: 2 }}
          >
            Tillbaka
          </Button>
        </Box>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">Objektet hittades inte.</Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(backTo)}
            sx={{ mt: 2 }}
          >
            Tillbaka
          </Button>
        </Box>
      </Container>
    );
  }

  const displayKeys = Object.keys(fieldLabels) as (keyof typeof fieldLabels)[];

  const renderField = (key: string) => {
    const label = fieldLabels[key as keyof typeof fieldLabels];
    if (!label) return null;

    const value = (item as unknown as Record<string, unknown>)[key];
    const display = formatValue(value, key);

    return (
      <Grid size={{ xs: 12, sm: 6 }} key={key}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {display || "-"}
        </Typography>
      </Grid>
    );
  };

  const title =
    kind === "metadata"
      ? (item as Metadata).namn || `Metadata ${numericGid}`
      : (item as ManagementPlan).titel ||
        (item as ManagementPlan).namn ||
        `Förvaltningsplan ${numericGid}`;

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(backTo)}
        sx={{ mb: 3, textTransform: "capitalize" }}
      >
        Tillbaka
      </Button>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={600}
            >
              {title}
            </Typography>
            <Tooltip title="Ladda ner som PDF">
              <IconButton
                onClick={() =>
                  generatePDF(
                    title,
                    item as unknown as Record<string, unknown>,
                    fieldLabels as Record<string, string>
                  )
                }
                color="primary"
                sx={{ ml: 2 }}
              >
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2 }}
            flexWrap="wrap"
            useFlexGap
          >
            {"kategori" in item && (item as any).kategori ? (
              <Chip
                label={(item as any).kategori}
                size="small"
                color="primary"
                variant="outlined"
              />
            ) : null}
            {"status" in item && (item as any).status ? (
              <Chip
                label={(item as any).status}
                size="small"
                color={statusChipColor((item as any).status)}
                variant="outlined"
              />
            ) : null}
            <Chip
              label={heading}
              size="small"
              variant="outlined"
              sx={{ ml: "auto" }}
            />
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Typography
            variant="body1"
            sx={{ mt: 2, mb: 2, fontSize: 17, fontWeight: 600 }}
          >
            Detaljer
          </Typography>

          <Grid container spacing={2}>
            {displayKeys.map((key) => renderField(String(key)))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
