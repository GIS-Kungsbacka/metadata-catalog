namespace metadata_forvaltningsplan_api.Models
{
    public class Metadata
    {
        public int Gid { get; set; }
        public string? SakerhetsKlassDokument { get; set; }
        public string? ArendeNummer { get; set; }
        public string? BestallareNamn { get; set; }
        public string? BestallareEpost { get; set; }
        public string? SakerhetsKlass { get; set; }
        public string? DataKallaTyp { get; set; }
        public string? Schema { get; set; }
        public string? Namn { get; set; }
        public string? Beskrivning { get; set; }
        public string? Syfte { get; set; }
        public string[]? Datakalla { get; set; }
        public string? Metod { get; set; }
        public string? Projekt { get; set; }
        public string[]? GeografiskBegransning { get; set; }
        public string? UppdateringsFrekvens { get; set; }
        public string? Fullstandighet { get; set; }
        public string? Skalniva { get; set; }
        public string[]? NyckelOrd { get; set; }
        public string? Kategori { get; set; }
        public bool? Tidsperiod { get; set; }
        public DateOnly? TidsperiodStartdatum { get; set; }
        public DateOnly? TidsperiodSlutdatum { get; set; }
        public string? TidsUpplosning { get; set; }
        public DateOnly? SkapelseDatum { get; set; }
        public bool AnvandarBegransningLicens { get; set; }
        public string? AnvandarBegransningLicensText { get; set; }
        public string[]? RelateradeResurser { get; set; }
        public string? Status { get; set; }
        public string? Handlaggare { get; set; }
        public string? MetaDataVersion { get; set; }
        public DateTimeOffset SkapadTidPunkt { get; set; }
    }
}
