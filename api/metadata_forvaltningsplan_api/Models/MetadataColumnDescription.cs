namespace metadata_forvaltningsplan_api.Models
{
    public class MetadataColumnDescription
    {
        public int Gid { get; set; }
        public string? TableSchema { get; set; }
        public string? TableName { get; set; }
        public string? ColumnName { get; set; }
        public string? ColumnDescription { get; set; }
        public string? ColumnTitle { get; set; }
    }
}
