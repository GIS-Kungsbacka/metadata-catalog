namespace metadata_forvaltningsplan_api.Models
{
    public class ManagementPlan
    {
        public int Gid { get; set; }
        public string? ArendeNummer { get; set; }
        public string? BestallareNamn { get; set; }
        public string? BestallareEpost { get; set; }
        public string? Sakerhetsklass { get; set; }
        public string? DatakallaTyp { get; set; }
        public string? Schema { get; set; }
        public string? Namn { get; set; }
        public string? Titel { get; set; }
        public string? DataAgare { get; set; }
        public string? DataForvaltare { get; set; }
        public string[]? DataAdministrator { get; set; }
        public string[]? DataKonsument { get; set; }
        public string[]? RedigeringsKalla { get; set; }
        public string? Publicering { get; set; }
        public bool? OppnaData { get; set; }
        public string? Arkivering { get; set; }
        public string? ArkiveringTidpunkt { get; set; }
        public string[]? Atkomst { get; set; }
        public string? Status { get; set; }
        public string? Handlaggare { get; set; }
        public string? ForvaltningsplanVersion { get; set; }
        public DateTimeOffset SkapadTidPunkt { get; set; }

    }
}
