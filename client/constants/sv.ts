import type { GridLocaleText } from "../lib/gridLocaleTextApi";

export const GRID_DEFAULT_LOCALE_TEXT: GridLocaleText = {
  noRowsLabel: "Inga rader",
  noResultsOverlayLabel: "Inga resultat hittades.",
  noColumnsOverlayLabel: "Inga kolumner",
  noColumnsOverlayManageColumns: "Hantera kolumner",
  emptyPivotOverlayLabel:
    "Lägg till fält till rader, kolumner och värden för att skapa en pivottabell",

  toolbarDensity: "Täthet",
  toolbarDensityLabel: "Täthet",
  toolbarDensityCompact: "Kompakt",
  toolbarDensityStandard: "Standard",
  toolbarDensityComfortable: "Komfortabelt",

  toolbarUndo: "Ångra",
  toolbarRedo: "Gör om",

  toolbarColumns: "Kolumner",
  toolbarColumnsLabel: "Välj kolumner",

  toolbarFilters: "Filter",
  toolbarFiltersLabel: "Visa filter",
  toolbarFiltersTooltipHide: "Dölj filter",
  toolbarFiltersTooltipShow: "Visa filter",
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktiva filter` : `${count} aktivt filter`,

  toolbarQuickFilterPlaceholder: "Sök…",
  toolbarQuickFilterLabel: "Sök",
  toolbarQuickFilterDeleteIconLabel: "Rensa",

  toolbarExport: "Exportera",
  toolbarExportLabel: "Exportera",
  toolbarExportCSV: "Exportera som CSV",
  toolbarExportPrint: "Skriv ut",

  toolbarPivot: "Pivot",

  toolbarCharts: "Diagram",

  toolbarAssistant: "AI-assistent",

  columnsManagementSearchTitle: "Sök",
  columnsManagementNoColumns: "Inga kolumner",
  columnsManagementShowHideAllText: "Visa/Dölj alla",
  columnsManagementReset: "Återställ",
  columnsManagementDeleteIconLabel: "Rensa",

  filterPanelAddFilter: "Lägg till filter",
  filterPanelRemoveAll: "Ta bort alla",
  filterPanelDeleteIconLabel: "Ta bort",
  filterPanelLogicOperator: "Logisk operator",
  filterPanelOperator: "Operator",
  filterPanelOperatorAnd: "Och",
  filterPanelOperatorOr: "Eller",
  filterPanelColumns: "Kolumner",
  filterPanelInputLabel: "Värde",
  filterPanelInputPlaceholder: "Filtervärde",

  filterOperatorContains: "innehåller",
  filterOperatorDoesNotContain: "innehåller inte",
  filterOperatorEquals: "är lika med",
  filterOperatorDoesNotEqual: "är inte lika med",
  filterOperatorStartsWith: "börjar med",
  filterOperatorEndsWith: "slutar med",
  filterOperatorIs: "är",
  filterOperatorNot: "är inte",
  filterOperatorAfter: "är efter",
  filterOperatorOnOrAfter: "är på eller efter",
  filterOperatorBefore: "är före",
  filterOperatorOnOrBefore: "är på eller före",
  filterOperatorIsEmpty: "är tom",
  filterOperatorIsNotEmpty: "är inte tom",
  filterOperatorIsAnyOf: "är någon av",
  "filterOperator=": "=",
  "filterOperator!=": "!=",
  "filterOperator>": ">",
  "filterOperator>=": ">=",
  "filterOperator<": "<",
  "filterOperator<=": "<=",

  headerFilterOperatorContains: "Innehåller",
  headerFilterOperatorDoesNotContain: "Innehåller inte",
  headerFilterOperatorEquals: "Är lika med",
  headerFilterOperatorDoesNotEqual: "Är inte lika med",
  headerFilterOperatorStartsWith: "Börjar med",
  headerFilterOperatorEndsWith: "Slutar med",
  headerFilterOperatorIs: "Är",
  headerFilterOperatorNot: "Är inte",
  headerFilterOperatorAfter: "Är efter",
  headerFilterOperatorOnOrAfter: "Är på eller efter",
  headerFilterOperatorBefore: "Är före",
  headerFilterOperatorOnOrBefore: "Är på eller före",
  headerFilterOperatorIsEmpty: "Är tom",
  headerFilterOperatorIsNotEmpty: "Är inte tom",
  headerFilterOperatorIsAnyOf: "Är någon av",
  "headerFilterOperator=": "Är lika med",
  "headerFilterOperator!=": "Är inte lika med",
  "headerFilterOperator>": "Större än",
  "headerFilterOperator>=": "Större än eller lika med",
  "headerFilterOperator<": "Mindre än",
  "headerFilterOperator<=": "Mindre än eller lika med",
  headerFilterClear: "Rensa filter",

  filterValueAny: "något",
  filterValueTrue: "sant",
  filterValueFalse: "falskt",

  columnMenuLabel: "Meny",
  columnMenuAriaLabel: (columnName: string) => `${columnName} kolumnmeny`,
  columnMenuShowColumns: "Visa kolumner",
  columnMenuManageColumns: "Hantera kolumner",
  columnMenuFilter: "Filter",
  columnMenuHideColumn: "Dölj kolumn",
  columnMenuUnsort: "Avsortera",
  columnMenuSortAsc: "Sortera stigande",
  columnMenuSortDesc: "Sortera fallande",
  columnMenuManagePivot: "Hantera pivot",
  columnMenuManageCharts: "Hantera diagram",

  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktiva filter` : `${count} aktivt filter`,
  columnHeaderFiltersLabel: "Visa filter",
  columnHeaderSortIconLabel: "Sortera",

  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} rader markerade`
      : `${count.toLocaleString()} rad markerad`,

  footerTotalRows: "Totalt antal rader:",

  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} av ${totalCount.toLocaleString()}`,

  checkboxSelectionHeaderName: "Kryssruteval",
  checkboxSelectionSelectAllRows: "Välj alla rader",
  checkboxSelectionUnselectAllRows: "Avmarkera alla rader",
  checkboxSelectionSelectRow: "Välj rad",
  checkboxSelectionUnselectRow: "Avmarkera rad",

  booleanCellTrueLabel: "ja",
  booleanCellFalseLabel: "nej",

  longTextCellExpandLabel: "Expandera",
  longTextCellCollapseLabel: "Dölj",

  actionsCellMore: "mer",

  pinToLeft: "Fäst till vänster",
  pinToRight: "Fäst till höger",
  unpin: "Ta bort fästning",

  treeDataGroupingHeaderName: "Grupp",
  treeDataExpand: "se barn",
  treeDataCollapse: "dölj barn",

  groupingColumnHeaderName: "Grupp",
  groupColumn: (name) => `Gruppera efter ${name}`,
  unGroupColumn: (name) => `Sluta gruppera efter ${name}`,

  detailPanelToggle: "Växla detaljpanel",
  expandDetailPanel: "Expandera",
  collapseDetailPanel: "Dölj",

  paginationRowsPerPage: "Rader per sida:",
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from} av ${count !== -1 ? count : `mer än ${to}`}`;
    }
    const estimatedLabel =
      estimated && estimated > to ? `cirka ${estimated}` : `mer än ${to}`;
    return `${from}–${to} av ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === "first") {
      return "Gå till första sidan";
    }
    if (type === "last") {
      return "Gå till sista sidan";
    }
    if (type === "previous") {
      return "Gå till föregående sida";
    }
    if (type === "next") {
      return "Gå till nästa sida";
    }
    return "";
  },

  rowReorderingHeaderName: "Omordning av rader",

  aggregationMenuItemHeader: "Aggregering",
  aggregationFunctionLabelNone: "ingen",
  aggregationFunctionLabelSum: "summa",
  aggregationFunctionLabelAvg: "medelvärde",
  aggregationFunctionLabelMin: "minimum",
  aggregationFunctionLabelMax: "maximum",
  aggregationFunctionLabelSize: "storlek",

  pivotToggleLabel: "Pivot",
  pivotRows: "Rader",
  pivotColumns: "Kolumner",
  pivotValues: "Värden",
  pivotCloseButton: "Stäng pivotinställningar",
  pivotSearchButton: "Sök fält",
  pivotSearchControlPlaceholder: "Sök fält",
  pivotSearchControlLabel: "Sök fält",
  pivotSearchControlClear: "Rensa sökning",
  pivotNoFields: "Inga fält",
  pivotMenuMoveUp: "Flytta upp",
  pivotMenuMoveDown: "Flytta ner",
  pivotMenuMoveToTop: "Flytta till toppen",
  pivotMenuMoveToBottom: "Flytta till botten",
  pivotMenuRows: "Rader",
  pivotMenuColumns: "Kolumner",
  pivotMenuValues: "Värden",
  pivotMenuOptions: "Fältalternativ",
  pivotMenuAddToRows: "Lägg till i rader",
  pivotMenuAddToColumns: "Lägg till i kolumner",
  pivotMenuAddToValues: "Lägg till i värden",
  pivotMenuRemove: "Ta bort",
  pivotDragToRows: "Dra hit för att skapa rader",
  pivotDragToColumns: "Dra hit för att skapa kolumner",
  pivotDragToValues: "Dra hit för att skapa värden",
  pivotYearColumnHeaderName: "(År)",
  pivotQuarterColumnHeaderName: "(Kvartal)",

  chartsNoCharts: "Det finns inga diagram tillgängliga",
  chartsChartNotSelected:
    "Välj en diagramtyp för att konfigurera dess alternativ",
  chartsTabChart: "Diagram",
  chartsTabFields: "Fält",
  chartsTabCustomize: "Anpassa",
  chartsCloseButton: "Stäng diagramkonfiguration",
  chartsSyncButtonLabel: "Synkronisera diagram",
  chartsSearchPlaceholder: "Sök fält",
  chartsSearchLabel: "Sök fält",
  chartsSearchClear: "Rensa sökning",
  chartsNoFields: "Inga fält",
  chartsFieldBlocked: "Detta fält kan inte läggas till i någon sektion",
  chartsCategories: "Kategorier",
  chartsSeries: "Serier",
  chartsMenuAddToDimensions: (dimensionLabel: string) =>
    `Lägg till i ${dimensionLabel}`,
  chartsMenuAddToValues: (valuesLabel: string) => `Lägg till i ${valuesLabel}`,
  chartsMenuMoveUp: "Flytta upp",
  chartsMenuMoveDown: "Flytta ner",
  chartsMenuMoveToTop: "Flytta till toppen",
  chartsMenuMoveToBottom: "Flytta till botten",
  chartsMenuOptions: "Fältalternativ",
  chartsMenuRemove: "Ta bort",
  chartsDragToDimensions: (dimensionLabel: string) =>
    `Dra hit för att använda kolumn som ${dimensionLabel}`,
  chartsDragToValues: (valuesLabel: string) =>
    `Dra hit för att använda kolumn som ${valuesLabel}`,

  aiAssistantPanelTitle: "AI-assistent",
  aiAssistantPanelClose: "Stäng AI-assistent",
  aiAssistantPanelNewConversation: "Ny konversation",
  aiAssistantPanelConversationHistory: "Konversationshistorik",
  aiAssistantPanelEmptyConversation: "Ingen prompt-historik",
  aiAssistantSuggestions: "Förslag",

  promptFieldLabel: "Prompt",
  promptFieldPlaceholder: "Skriv en prompt…",
  promptFieldPlaceholderWithRecording: "Skriv eller spela in en prompt…",
  promptFieldPlaceholderListening: "Lyssnar på prompt…",
  promptFieldSpeechRecognitionNotSupported:
    "Taligenkänning stöds inte i denna webbläsare",
  promptFieldSend: "Skicka",
  promptFieldRecord: "Spela in",
  promptFieldStopRecording: "Stoppa inspelning",

  promptRerun: "Kör igen",
  promptProcessing: "Bearbetar…",
  promptAppliedChanges: "Tillämpade ändringar",

  promptChangeGroupDescription: (column: string) => `Gruppera efter ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `Aggregera ${column} (${aggregation})`,
  promptChangeFilterLabel: (
    column: string,
    operator: string,
    value: string
  ) => {
    if (operator === "is any of") {
      return `${column} är någon av: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (
    column: string,
    operator: string,
    value: string
  ) => {
    if (operator === "is any of") {
      return `Filtrera där ${column} är någon av: ${value}`;
    }
    return `Filtrera där ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `Sortera efter ${column} (${direction})`,
  promptChangePivotEnableLabel: "Pivot",
  promptChangePivotEnableDescription: "Aktivera pivot",
  promptChangePivotColumnsLabel: (count: number) => `Kolumner (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ""}`,
  promptChangePivotRowsLabel: (count: number) => `Rader (${count})`,
  promptChangePivotValuesLabel: (count: number) => `Värden (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `Dimensioner (${dimensionsCount}), Värden (${valuesCount})`,
  toolbarExportExcel: "",
};
