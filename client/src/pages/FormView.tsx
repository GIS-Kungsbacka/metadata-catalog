import * as React from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  Download,
  Link,
  TableView,
  OpenInNew,
} from "@mui/icons-material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import {
  useMetadata,
  useMetadataColumnDescription,
  useMetadataTechDescription,
} from "../hooks/useMetadata";
import { useManagementPlan } from "../hooks/useManagementPlan";
import type { Metadata } from "../types/metadata";
import type { ManagementPlan } from "../types/management-plan";
import type { MetadataTechDescription } from "../types/metadata-techdescription";
import { statusChipColor } from "../utils/status-chip";
import { FieldLabelWithHelp } from "../components/field-label-with-help";
import {
  managementPlanFieldHelp,
  metadataFieldHelp,
  metadataTechDescriptionFieldHelp,
} from "../utils/field-help";
import {
  generateManagementPlanPDF,
  generateMetadataPDF,
  managementPlanSections,
  metadataSections,
  metadataTechDescriptionFieldLabels,
  metadataTechDescriptionSections,
} from "../utils/pdf-export";

const metadataFieldLabels: Partial<Record<keyof Metadata, string>> = {
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
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "-";
  return String(value);
}

function hasProp<K extends string>(
  value: unknown,
  key: K,
): value is Record<K, unknown> {
  return typeof value === "object" && value !== null && key in value;
}

export default function FormView({
  kind,
}: {
  kind: "metadata" | "managementplan";
}) {
  const [linkCopied, setLinkCopied] = React.useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = React.useState(false);
  const { schemaNamnNamn } = useParams<{
    schemaNamnNamn?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const rawKey = (schemaNamnNamn ?? "").trim();
  const keyIsValid = Boolean(rawKey);
  const norm = React.useCallback(
    (value: string | null | undefined) => (value ?? "").trim().toLowerCase(),
    [],
  );

  const metadataListQuery = useMetadata({
    enabled: keyIsValid && kind === "metadata",
  });
  const metadataAllQuery = useMetadata({
    enabled: keyIsValid && kind === "managementplan",
  });
  const metadataColumnDescriptionsQuery = useMetadataColumnDescription({
    enabled: columnDialogOpen && kind === "metadata",
  });
  const metadataTechDescriptionsQuery = useMetadataTechDescription({
    enabled: keyIsValid,
  });
  const managementPlanListQuery = useManagementPlan({
    enabled: keyIsValid && kind === "managementplan",
  });
  const managementPlansQuery = useManagementPlan({
    enabled: kind === "metadata",
  });

  const makeCombinedKey = React.useCallback(
    (schema: unknown, name: unknown) =>
      `${String(schema ?? "").trim()}_${String(name ?? "").trim()}`.trim(),
    [],
  );

  const listItem =
    keyIsValid && kind === "metadata"
      ? (metadataListQuery.data ?? []).find(
          (m) => makeCombinedKey(m.schemaNamn, m.namn) === rawKey,
        )
      : keyIsValid && kind === "managementplan"
        ? (managementPlanListQuery.data ?? []).find(
            (p) => makeCombinedKey(p.schemaNamn, p.namn) === rawKey,
          )
        : undefined;

  const item = keyIsValid ? (listItem as unknown) : undefined;

  const isLoading = keyIsValid
    ? kind === "metadata"
      ? metadataListQuery.isLoading
      : managementPlanListQuery.isLoading
    : false;
  const error = keyIsValid
    ? kind === "metadata"
      ? metadataListQuery.error
      : managementPlanListQuery.error
    : undefined;

  const backToFromState =
    typeof (location.state as unknown as { backTo?: string })?.backTo ===
    "string"
      ? ((location.state as unknown as { backTo?: string }).backTo as string)
      : undefined;

  const baseBackTo =
    kind === "metadata" ? "/metadata/list" : "/forvaltningsplan";
  const backTo = backToFromState ?? baseBackTo;
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

  if (!keyIsValid) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Ogiltig länk.</Alert>
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

  const backToFinal =
    backToFromState ??
    (kind === "metadata"
      ? (() => {
          const kategori = ((item as Metadata).kategori ?? "").trim();
          return kategori
            ? `/metadata/list?kategori=${encodeURIComponent(kategori)}`
            : baseBackTo;
        })()
      : baseBackTo);

  const renderMetadataField = (key: keyof Metadata) => {
    const label = metadataFieldLabels[key];
    if (!label) return null;

    const value = (item as Metadata)?.[key];
    const display = formatValue(value, String(key));

    return (
      <Grid size={{ xs: 12, sm: 4 }} key={String(key)}>
        <FieldLabelWithHelp label={label} helpText={metadataFieldHelp[key]} />
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {display || "-"}
        </Typography>
      </Grid>
    );
  };

  const renderManagementPlanField = (key: keyof ManagementPlan) => {
    const label = managementPlanFieldLabels[key];
    if (!label) return null;

    const value = (item as ManagementPlan)?.[key];
    const display = formatValue(value, String(key));

    return (
      <Grid size={{ xs: 12, sm: 4 }} key={String(key)}>
        <FieldLabelWithHelp
          label={label}
          helpText={managementPlanFieldHelp[key]}
        />
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {display || "-"}
        </Typography>
      </Grid>
    );
  };

  const renderMetadataTechDescriptionField = (
    key: keyof MetadataTechDescription,
    techDescription: MetadataTechDescription | undefined,
  ) => {
    const label = metadataTechDescriptionFieldLabels[key];
    if (!label) return null;

    const value = techDescription?.[key];
    const display = formatValue(value, String(key));

    return (
      <Grid size={{ xs: 12, sm: 4 }} key={String(key)}>
        <FieldLabelWithHelp
          label={label}
          helpText={metadataTechDescriptionFieldHelp[key]}
        />
        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
          {display || "-"}
        </Typography>
      </Grid>
    );
  };

  const managementPlanHeaderByName = (() => {
    const map = new Map<string, string>();
    for (const p of managementPlansQuery.data ?? []) {
      const name = norm(p.namn);
      if (!name) continue;
      const t = (p.titel ?? p.namn ?? "").trim();
      if (!t) continue;
      if (!map.has(name)) map.set(name, t);
    }
    return map;
  })();

  const derivedManagementPlanTitle =
    kind === "metadata"
      ? (() => {
          const metadataName = norm((item as Metadata).namn);
          return metadataName
            ? managementPlanHeaderByName.get(metadataName)
            : undefined;
        })()
      : undefined;

  const otherTarget = (() => {
    if (!keyIsValid || !item) return undefined;

    if (kind === "metadata") {
      const metadataNameNorm = norm((item as Metadata).namn);
      if (!metadataNameNorm) return undefined;

      const metadataSchema = String((item as Metadata).schemaNamn ?? "").trim();
      const plans = managementPlansQuery.data ?? [];

      const preferred =
        metadataSchema.trim() !== ""
          ? plans.find(
              (p) =>
                norm(p.namn) === metadataNameNorm &&
                String(p.schemaNamn ?? "").trim() === metadataSchema,
            )
          : undefined;

      const fallback = plans.find((p) => norm(p.namn) === metadataNameNorm);
      const match = preferred ?? fallback;
      if (!match) return undefined;

      const combined = makeCombinedKey(match.schemaNamn, match.namn);
      return combined
        ? `/forvaltningsplan/${encodeURIComponent(combined)}`
        : undefined;
    }

    const planNameNorm = norm((item as ManagementPlan).namn);
    if (!planNameNorm) return undefined;

    const planSchema = String((item as ManagementPlan).schemaNamn ?? "").trim();
    const metadatas = metadataAllQuery.data ?? [];

    const preferred =
      planSchema.trim() !== ""
        ? metadatas.find(
            (m) =>
              norm(m.namn) === planNameNorm &&
              String(m.schemaNamn ?? "").trim() === planSchema,
          )
        : undefined;

    const fallback = metadatas.find((m) => norm(m.namn) === planNameNorm);
    const match = preferred ?? fallback;
    if (!match) return undefined;

    const combined = makeCombinedKey(match.schemaNamn, match.namn);
    return combined ? `/metadata/${encodeURIComponent(combined)}` : undefined;
  })();

  const otherTargetLabel =
    kind === "metadata" ? "Öppna förvaltningsplan" : "Öppna metadata";

  const title =
    kind === "metadata"
      ? derivedManagementPlanTitle || (item as Metadata).namn || "Metadata"
      : (item as ManagementPlan).titel ||
        (item as ManagementPlan).namn ||
        "Förvaltningsplan";

  const itemNamn =
    kind === "metadata"
      ? ((item as Metadata).namn ?? "").trim()
      : ((item as ManagementPlan).namn ?? "").trim();
  const itemSchemaNamn =
    kind === "metadata"
      ? ((item as Metadata).schemaNamn ?? "").trim()
      : ((item as ManagementPlan).schemaNamn ?? "").trim();
  const nameSchemaSubtitle =
    itemSchemaNamn && itemNamn
      ? `${itemSchemaNamn}:${itemNamn}`
      : itemSchemaNamn || itemNamn;

  const columnDescriptionsForCurrentMetadata =
    kind === "metadata"
      ? (() => {
          const schemaNamn = ((item as Metadata).schemaNamn ?? "").trim();
          const namn = ((item as Metadata).namn ?? "").trim();
          const all = metadataColumnDescriptionsQuery.data ?? [];
          return all.filter(
            (x) =>
              (x.tableSchema ?? "").trim() === schemaNamn &&
              (x.tableName ?? "").trim() === namn,
          );
        })()
      : [];

  const techDescriptionForCurrentItem =
    itemNamn && itemSchemaNamn
      ? (metadataTechDescriptionsQuery.data ?? []).find(
          (x) =>
            norm(x.schemaNamn) === norm(itemSchemaNamn) &&
            norm(x.namn) === norm(itemNamn),
        )
      : undefined;

  return (
    <Container maxWidth="md">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(backToFinal)}
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
            <Box sx={{ minWidth: 0, pr: 2 }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom={!nameSchemaSubtitle}
                fontWeight={600}
                sx={{ wordBreak: "break-word" }}
              >
                {title}
              </Typography>
              {nameSchemaSubtitle ? (
                <Typography
                  variant="h6"
                  component="h2"
                  color="text.secondary"
                  sx={{ wordBreak: "break-word", fontWeight: 400, mt: 0.5 }}
                >
                  {nameSchemaSubtitle}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {kind === "metadata" ? (
                <>
                  <Tooltip title="Visa attributtabell">
                    <IconButton
                      onClick={() => {
                        setColumnDialogOpen(true);
                      }}
                      color="primary"
                    >
                      <TableView />
                    </IconButton>
                  </Tooltip>

                  {otherTarget ? (
                    <Tooltip title={otherTargetLabel}>
                      <IconButton
                        onClick={() => {
                          navigate(otherTarget, {
                            state: { backTo: backToFinal },
                          });
                        }}
                        color="primary"
                        sx={{ ml: 1 }}
                      >
                        <OpenInNew />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </>
              ) : null}
              {kind === "managementplan" && otherTarget ? (
                <Tooltip title={otherTargetLabel}>
                  <IconButton
                    onClick={() => {
                      navigate(otherTarget, {
                        state: { backTo: backToFinal },
                      });
                    }}
                    color="primary"
                  >
                    <OpenInNew />
                  </IconButton>
                </Tooltip>
              ) : null}
              <Tooltip
                title={linkCopied ? "Länk kopierad" : "Kopiera länk"}
                disableInteractive
              >
                <IconButton
                  onClick={async () => {
                    const url = `${window.location.origin}/geodata/metadatakatalog${location.pathname}`;
                    try {
                      await navigator.clipboard.writeText(url);
                      setLinkCopied(true);
                      window.setTimeout(() => setLinkCopied(false), 3500);
                    } catch {
                      // ignore (clipboard might be blocked)
                    }
                  }}
                  color={linkCopied ? "primary" : "primary"}
                  sx={{ ml: 1 }}
                >
                  {linkCopied ? <CheckCircleOutlineOutlinedIcon /> : <Link />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Ladda ner som PDF">
                <IconButton
                  onClick={() => {
                    if (kind === "metadata") {
                      generateMetadataPDF(title, item as Metadata, {
                        subtitle: derivedManagementPlanTitle
                          ? `Förvaltningsplan: ${derivedManagementPlanTitle}`
                          : undefined,
                        techDescription: techDescriptionForCurrentItem,
                      });
                      return;
                    }

                    generateManagementPlanPDF(title, item as ManagementPlan, {
                      techDescription: techDescriptionForCurrentItem,
                    });
                  }}
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2 }}
            flexWrap="wrap"
            useFlexGap
          >
            {hasProp(item, "kategori") &&
            typeof item.kategori === "string" &&
            item.kategori.trim() ? (
              <Chip
                label={item.kategori}
                size="small"
                color="primary"
                variant="outlined"
              />
            ) : null}
            {hasProp(item, "status") &&
            typeof item.status === "string" &&
            item.status.trim() ? (
              <Chip
                label={item.status}
                size="small"
                color={statusChipColor((item as unknown as Metadata).status)}
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
          {kind === "metadata" ? (
            <Box sx={{ mt: 1 }}>
              {metadataSections.map((section) => (
                <Box key={section.title} sx={{ mt: 5 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
                  >
                    {section.title}
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Grid container spacing={2}>
                    {section.keys.map((key) => renderMetadataField(key))}
                  </Grid>
                </Box>
              ))}
              {techDescriptionForCurrentItem
                ? metadataTechDescriptionSections.map((section) => (
                    <Box key={section.title} sx={{ mt: 5 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
                      >
                        {section.title}
                      </Typography>
                      <Divider sx={{ mb: 1.5 }} />
                      <Grid container spacing={2}>
                        {section.keys.map((key) =>
                          renderMetadataTechDescriptionField(
                            key,
                            techDescriptionForCurrentItem,
                          ),
                        )}
                      </Grid>
                    </Box>
                  ))
                : null}
            </Box>
          ) : (
            <Box sx={{ mt: 1 }}>
              {managementPlanSections.map((section) => (
                <Box key={section.title} sx={{ mt: 5 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
                  >
                    {section.title}
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Grid container spacing={2}>
                    {section.keys.map((key) => renderManagementPlanField(key))}
                  </Grid>
                </Box>
              ))}
              {techDescriptionForCurrentItem
                ? metadataTechDescriptionSections.map((section) => (
                    <Box key={section.title} sx={{ mt: 5 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: 15, fontWeight: 800, mb: 1 }}
                      >
                        {section.title}
                      </Typography>
                      <Divider sx={{ mb: 1.5 }} />
                      <Grid container spacing={2}>
                        {section.keys.map((key) =>
                          renderMetadataTechDescriptionField(
                            key,
                            techDescriptionForCurrentItem,
                          ),
                        )}
                      </Grid>
                    </Box>
                  ))
                : null}
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={columnDialogOpen}
        onClose={() => setColumnDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Attributtabell</DialogTitle>
        <DialogContent dividers>
          {metadataColumnDescriptionsQuery.isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : metadataColumnDescriptionsQuery.error ? (
            <Alert severity="error">
              {metadataColumnDescriptionsQuery.error instanceof Error
                ? metadataColumnDescriptionsQuery.error.message
                : "Kunde inte ladda attributtabell."}
            </Alert>
          ) : columnDescriptionsForCurrentMetadata.length === 0 ? (
            <Alert severity="info">
              Inga attributt hittades för{" "}
              <strong>{(item as Metadata).schemaNamn}</strong> /{" "}
              <strong>{(item as Metadata).namn}</strong>.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Namn</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Titel</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Beskrivning</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {columnDescriptionsForCurrentMetadata.map((row) => (
                    <TableRow key={row.gid}>
                      <TableCell sx={{ fontFamily: "monospace" }}>
                        {row.columnName}
                      </TableCell>
                      <TableCell>{row.columnTitle}</TableCell>
                      <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                        {row.columnDescription}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnDialogOpen(false)}>Stäng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
