import jsPDF from "jspdf";
import type { Metadata } from "../types/metadata";
import type { ManagementPlan } from "../types/management-plan";

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

export const metadataSections: Array<{
  title: string;
  keys: (keyof Metadata)[];
}> = [
  {
    title: "Grundläggande identitet",
    keys: ["schemaNamn", "namn", "metaDataVersion"],
  },
  {
    title: "Beskrivning och syfte",
    keys: ["beskrivning", "syfte", "kategori", "nyckelOrd", "projekt"],
  },
  {
    title: "Ursprung och datakälla",
    keys: ["dataKallaTyp", "ursprung", "metod", "metodUrl"],
  },
  {
    title: "Geografisk och detaljnivå",
    keys: ["geografiskBegransning", "skalniva"],
  },
  {
    title: "Tidsinformation",
    keys: [
      "skapelseDatum",
      "tidsperiodStartdatum",
      "tidsperiodSlutdatum",
      "tidsUpplosning",
    ],
  },
  {
    title: "Kvalitet och uppdatering",
    keys: ["uppdateringsFrekvens", "fullstandighet"],
  },
  {
    title: "Åtkomst, licens och säkerhet",
    keys: [
      "anvandarBegransningLicens",
      "anvandarBegransningLicensText",
      "sakerhetsKlass",
    ],
  },
  {
    title: "Struktur och relationer",
    keys: ["kolumnBeskrivningUrl", "relateradeResurser"],
  },
  {
    title: "Status",
    keys: [
      "arendeNummerOpenE",
      "bestallareNamn",
      "bestallareEpost",
      "handlaggare",
      "status",
    ],
  },
];

export const managementPlanSections: Array<{
  title: string;
  keys: (keyof ManagementPlan)[];
}> = [
  {
    title: "Grundläggande identitet",
    keys: ["titel", "namn", "schemaNamn", "forvaltningsplanVersion"],
  },
  {
    title: "Ansvar och roller",
    keys: [
      "dataAgare",
      "dataForvaltare",
      "dataAdministrator",
      "dataKonsument",
      "handlaggare",
    ],
  },
  {
    title: "Publicering och åtkomst",
    keys: [
      "publicerad",
      "oppnaData",
      "atkomst",
      "integration",
      "redigeringsKalla",
    ],
  },
  {
    title: "Dokumentation och information",
    keys: ["dokumentSkUrl", "dokuementInfoUrl", "ovrigInformation"],
  },
  {
    title: "Livscykel och arkivering",
    keys: [
      "kritiskDatamangd",
      "arkivering",
      "arkiveringTidpunkt",
      "skapadTidPunkt",
      "skapadAv",
      "andradTidPunkt",
      "andradAv",
    ],
  },
  {
    title: "Status",
    keys: [
      "arendeNummberOpenE",
      "bestallareNamn",
      "bestallareEpost",
      "sakerhetsklass",
      "datakallaTyp",
      "status",
    ],
  },
];

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

function sanitizeFilenamePart(input: string): string {
  const cleaned = input.trim().replace(/[^a-z0-9\-_]+/gi, "_");
  return cleaned.replace(/^_+|_+$/g, "") || "export";
}

function todaySuffix(): string {
  return new Date().toISOString().split("T")[0] ?? "export";
}

function createPdfTextWriter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  const ensurePageSpace = () => {
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  const addText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.4) + 5;
    ensurePageSpace();
  };

  const addSpacer = (height = 5) => {
    yPosition += height;
    ensurePageSpace();
  };

  const startNewPage = () => {
    doc.addPage();
    yPosition = margin;
  };

  return { addText, addSpacer, startNewPage };
}

type PdfTextWriter = ReturnType<typeof createPdfTextWriter>;

function appendMetadataContent(
  writer: PdfTextWriter,
  title: string,
  metadata: Metadata,
  options?: { subtitle?: string },
) {
  const { addText, addSpacer } = writer;

  addText(title || "Detaljer", 18, true);
  addSpacer(5);

  const chipsInfo: string[] = [];
  if (metadata.kategori)
    chipsInfo.push(`Kategori: ${String(metadata.kategori)}`);
  if (metadata.status) chipsInfo.push(`Status: ${String(metadata.status)}`);
  if (chipsInfo.length > 0) {
    addText(chipsInfo.join(" | "), 12);
    addSpacer(5);
  }

  if (options?.subtitle) {
    addText(options.subtitle, 12);
    addSpacer(3);
  }

  addSpacer(5);

  for (const section of metadataSections) {
    addText(section.title, 14, true);
    addSpacer(3);

    for (const key of section.keys) {
      const label = metadataFieldLabels[key] ?? String(key);
      const value = formatValue(metadata[key], String(key));
      addText(`${label}: ${value}`, 11);
    }

    addSpacer(5);
  }
}

function appendManagementPlanContent(
  writer: PdfTextWriter,
  title: string,
  plan: ManagementPlan,
) {
  const { addText, addSpacer } = writer;

  addText(title || "Detaljer", 18, true);
  addSpacer(5);

  const chipsInfo: string[] = [];
  if (plan.status) chipsInfo.push(`Status: ${String(plan.status)}`);
  if (chipsInfo.length > 0) {
    addText(chipsInfo.join(" | "), 12);
    addSpacer(5);
  }

  addSpacer(5);

  for (const section of managementPlanSections) {
    addText(section.title, 14, true);
    addSpacer(3);

    for (const key of section.keys) {
      const label = managementPlanFieldLabels[key] ?? String(key);
      const value = formatValue(plan[key], String(key));
      addText(`${label}: ${value}`, 11);
    }

    addSpacer(5);
  }
}

export function generateMetadataPDF(
  title: string,
  metadata: Metadata,
  options?: { subtitle?: string },
) {
  const doc = new jsPDF();
  const writer = createPdfTextWriter(doc);
  appendMetadataContent(writer, title, metadata, options);

  const keySuffix =
    `${(metadata.schemaNamn ?? "").trim()}_${(metadata.namn ?? "").trim()}`.trim() ||
    title ||
    "Detaljer";
  const filename = `${sanitizeFilenamePart(keySuffix)}_${todaySuffix()}.pdf`;
  doc.save(filename);
}

export function generateManagementPlanPDF(
  title: string,
  plan: ManagementPlan,
) {
  const doc = new jsPDF();
  const writer = createPdfTextWriter(doc);
  appendManagementPlanContent(writer, title, plan);

  const keySuffix =
    `${(plan.schemaNamn ?? "").trim()}_${(plan.namn ?? "").trim()}`.trim() ||
    title ||
    "Detaljer";
  const filename = `${sanitizeFilenamePart(keySuffix)}_${todaySuffix()}.pdf`;
  doc.save(filename);
}

export function generateAllMetadataPDF(items: Metadata[]) {
  if (items.length === 0) return;

  const doc = new jsPDF();
  const writer = createPdfTextWriter(doc);

  writer.addText("Metadatakatalog", 20, true);
  writer.addText(`${items.length} objekt · ${todaySuffix()}`, 11);
  writer.addSpacer(10);

  for (const metadata of items) {
    writer.startNewPage();
    const title = metadata.namn?.trim() || "Metadata";
    appendMetadataContent(writer, title, metadata);
  }

  doc.save(`Metadatakatalog_${todaySuffix()}.pdf`);
}

export function generateAllManagementPlanPDF(items: ManagementPlan[]) {
  if (items.length === 0) return;

  const doc = new jsPDF();
  const writer = createPdfTextWriter(doc);

  writer.addText("Förvaltningsplan", 20, true);
  writer.addText(`${items.length} objekt · ${todaySuffix()}`, 11);
  writer.addSpacer(10);

  for (const plan of items) {
    writer.startNewPage();
    const title = plan.titel?.trim() || plan.namn?.trim() || "Förvaltningsplan";
    appendManagementPlanContent(writer, title, plan);
  }

  doc.save(`Forvaltningsplan_${todaySuffix()}.pdf`);
}
