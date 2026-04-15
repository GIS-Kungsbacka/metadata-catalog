namespace metadata_forvaltningsplan_api.Models
{
    public class ManagementPlan
    {
        public int Gid { get; set; }
        public string? ArendeNummberOpenE { get; set; }
        public string? BestallareNamn { get; set; }
        public string? BestallareEpost { get; set; }
        public string? Sakerhetsklass { get; set; }
        public string? DatakallaTyp { get; set; }
        public string? SchemaNamn { get; set; }
        public string? Namn { get; set; }
        public string? Titel { get; set; }
        public string? DataAgare { get; set; }
        public string? DataForvaltare { get; set; }
        public string[]? DataAdministrator { get; set; }
        public string[]? DataKonsument { get; set; }
        public string[]? RedigeringsKalla { get; set; }
        public bool? OppnaData { get; set; }
        public string? DokumentSkUrl { get; set; }
        public string? DokuementInfoUrl { get; set; }
        public string? OvrigInformation { get; set; }
        public bool? KritiskDatamangd {  get; set; }
        public string? Arkivering { get; set; }
        public string? ArkiveringTidpunkt { get; set; }
        public string[]? Publicerad { get; set; }
        public bool? PubliceradOppnaData { get; set; }
        public string[]? Atkomst { get; set; }
        public string[]? Integration { get; set; }
        public string? Status { get; set; }
        public string? Handlaggare { get; set; }
        public string? ForvaltningsplanVersion { get; set; }
        public DateTimeOffset? SkapadTidPunkt { get; set; }
        public string? SkapadAv { get; set; }
        public DateTimeOffset? AndradTidPunkt { get; set; }
        public string? AndradAv { get; set; }

    }
}
