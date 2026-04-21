using metadata_forvaltningsplan_api.Models;
using System.Text.Json;

namespace metadata_forvaltningsplan_api.Data
{
    public class JsonMetadataColumnDescriptionRepository : IMetadataColumnDescriptionRepository
    {
        private readonly string _jsonFilePath;
        private readonly ILogger<JsonMetadataColumnDescriptionRepository> _logger;
        private readonly object _lock = new object();

        public JsonMetadataColumnDescriptionRepository(
            ILogger<JsonMetadataColumnDescriptionRepository> logger,
            IWebHostEnvironment env)
        {
            _logger = logger;
            _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "metadataColumnDescriptions.json");

            _logger.LogInformation("JSON MetadataColumnDescription Repository initialized. File path: {Path}", _jsonFilePath);

            var directory = Path.GetDirectoryName(_jsonFilePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(_jsonFilePath))
            {
                _logger.LogInformation("MetadataColumnDescriptions JSON file not found, initializing with sample records");
                InitializeSampleData();
            }
        }

        private void InitializeSampleData()
        {
            var sample = new List<MetadataColumnDescription>
            {
                new MetadataColumnDescription
                {
                    Gid = 1,
                    TableSchema = "metadata",
                    TableName = "geodata_metadata_kolumner_beskrivning",
                    ColumnName = "table_name",
                    ColumnTitle = "Tabellnamn",
                    ColumnDescription = "Namnet på tabellen som kolumnen tillhör."
                },
                new MetadataColumnDescription
                {
                    Gid = 2,
                    TableSchema = "metadata",
                    TableName = "geodata_metadata_kolumner_beskrivning",
                    ColumnName = "column_description",
                    ColumnTitle = "Kolumnbeskrivning",
                    ColumnDescription = "Beskrivning av vad kolumnen representerar."
                }
            };

            SaveData(sample);
        }

        private List<MetadataColumnDescription> LoadData()
        {
            lock (_lock)
            {
                if (!File.Exists(_jsonFilePath))
                {
                    InitializeSampleData();
                }

                try
                {
                    var json = File.ReadAllText(_jsonFilePath);
                    if (string.IsNullOrWhiteSpace(json))
                    {
                        InitializeSampleData();
                        json = File.ReadAllText(_jsonFilePath);
                    }

                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var data = JsonSerializer.Deserialize<List<MetadataColumnDescription>>(json, options);
                    return data ?? new List<MetadataColumnDescription>();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading metadata column descriptions from {Path}", _jsonFilePath);
                    try
                    {
                        InitializeSampleData();
                        var json = File.ReadAllText(_jsonFilePath);
                        return JsonSerializer.Deserialize<List<MetadataColumnDescription>>(
                                   json,
                                   new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                               ?? new List<MetadataColumnDescription>();
                    }
                    catch
                    {
                        return new List<MetadataColumnDescription>();
                    }
                }
            }
        }

        private void SaveData(List<MetadataColumnDescription> data)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_jsonFilePath, json);
            }
        }

        public Task<IEnumerable<MetadataColumnDescription>> GetAllAsync()
        {
            var data = LoadData();
            return Task.FromResult<IEnumerable<MetadataColumnDescription>>(data.OrderByDescending(x => x.Gid));
        }

        public Task<MetadataColumnDescription?> GetByIdAsync(int gid)
        {
            var data = LoadData();
            return Task.FromResult(data.FirstOrDefault(x => x.Gid == gid));
        }
    }
}

