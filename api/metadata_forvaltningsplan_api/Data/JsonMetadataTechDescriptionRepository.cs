using metadata_forvaltningsplan_api.Models;
using System.Text.Json;

namespace metadata_forvaltningsplan_api.Data
{
    public class JsonMetadataTechDescriptionRepository : IMetadataTechDescriptionRepository
    {
        private readonly string _jsonFilePath;
        private readonly ILogger<JsonMetadataTechDescriptionRepository> _logger;
        private readonly object _lock = new object();

        public JsonMetadataTechDescriptionRepository(
            ILogger<JsonMetadataTechDescriptionRepository> logger,
            IWebHostEnvironment env)
        {
            _logger = logger;
            _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "metadataTechDescriptions.json");

            _logger.LogInformation("JSON MetadataTechDescription Repository initialized. File path: {Path}", _jsonFilePath);

            var directory = Path.GetDirectoryName(_jsonFilePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(_jsonFilePath))
            {
                _logger.LogInformation("MetadataTechDescriptions JSON file not found, initializing with sample records");
                InitializeSampleData();
            }
        }

        private void InitializeSampleData()
        {
            var sample = new List<MetadataTechDescription>
            {
                new MetadataTechDescription
                {
                    Gid = 1,
                    SchemaNamn = "sk0_schema_test",
                    Namn = "lekplatser_test_123",
                    Datatype = "geometry",
                    Srid = 3006,
                    GeometryDimension = "2",
                    GeometryType = "POLYGON",
                    GeometryColumn = "geom"
                },
                new MetadataTechDescription
                {
                    Gid = 2,
                    SchemaNamn = "sk0_schema_test",
                    Namn = "lekplatser_test",
                    Datatype = "geometry",
                    Srid = 3006,
                    GeometryDimension = "2",
                    GeometryType = "POINT",
                    GeometryColumn = "geom"
                }
            };

            SaveData(sample);
        }

        private List<MetadataTechDescription> LoadData()
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
                    var data = JsonSerializer.Deserialize<List<MetadataTechDescription>>(json, options);
                    return data ?? new List<MetadataTechDescription>();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading metadata tech descriptions from {Path}", _jsonFilePath);
                    try
                    {
                        InitializeSampleData();
                        var json = File.ReadAllText(_jsonFilePath);
                        return JsonSerializer.Deserialize<List<MetadataTechDescription>>(
                                   json,
                                   new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                               ?? new List<MetadataTechDescription>();
                    }
                    catch
                    {
                        return new List<MetadataTechDescription>();
                    }
                }
            }
        }

        private void SaveData(List<MetadataTechDescription> data)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_jsonFilePath, json);
            }
        }

        public Task<IEnumerable<MetadataTechDescription>> GetAllAsync()
        {
            var data = LoadData();
            return Task.FromResult<IEnumerable<MetadataTechDescription>>(data.OrderByDescending(x => x.Gid));
        }

        public Task<MetadataTechDescription?> GetByIdAsync(int gid)
        {
            var data = LoadData();
            return Task.FromResult(data.FirstOrDefault(x => x.Gid == gid));
        }
    }
}
