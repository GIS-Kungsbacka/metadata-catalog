using metadata_forvaltningsplan_api.Models;
using System.Text.Json;

namespace metadata_forvaltningsplan_api.Data
{
    public class JsonManagementPlanRepository : IManagementPlanRepository
    {
        private readonly string _jsonFilePath;
        private readonly ILogger<JsonManagementPlanRepository> _logger;
        private readonly object _lock = new object();

        public JsonManagementPlanRepository(ILogger<JsonManagementPlanRepository> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "managementplan.json");

            _logger.LogInformation("JSON ManagementPlan Repository initialized. File path: {Path}", _jsonFilePath);

            var directory = Path.GetDirectoryName(_jsonFilePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(_jsonFilePath))
            {
                _logger.LogInformation("ManagementPlan JSON file not found, initializing with one sample record");
                InitializeSampleData();
            }
        }

        private void InitializeSampleData()
        {
            var sample = new List<ManagementPlan>
            {
                new ManagementPlan
                {
                    Gid = 1,
                    ArendeNummer = "263521",
                    BestallareNamn = "Testnamn",
                    BestallareEpost = "testnamn@test.com",
                    Sakerhetsklass = "sk0_test",
                    DatakallaTyp = "{Extern,organisation}",
                    Schema = "sk0_schema_test",
                    Namn = "lekplatser_test_123",
                    Titel = "lekplatser_test_123",
                    DataAgare = "Testnamn",
                    DataForvaltare = "Jag",
                    DataAdministrator = ["Jag"],
                    DataKonsument = ["organisation"],
                    RedigeringsKalla = ["Extern", "organisation"],
                    Publicering = "Nej",
                    OppnaData = false,
                    Arkivering = "Nej",
                    ArkiveringTidpunkt = "Ej planerad",
                    Atkomst = ["Intern"],
                    Status = "granskas",
                    Handlaggare = "Jag",
                    ForvaltningsplanVersion = "1.0",
                    SkapadTidPunkt = DateTimeOffset.Parse("2026-02-14T15:00:05.462671+01:00")
                }
            };

            SaveData(sample);
        }

        private List<ManagementPlan> LoadData()
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
                    var data = JsonSerializer.Deserialize<List<ManagementPlan>>(json, options);
                    return data ?? new List<ManagementPlan>();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading management plan data from {Path}", _jsonFilePath);
                    try
                    {
                        InitializeSampleData();
                        var json = File.ReadAllText(_jsonFilePath);
                        return JsonSerializer.Deserialize<List<ManagementPlan>>(json,
                                   new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                               ?? new List<ManagementPlan>();
                    }
                    catch
                    {
                        return new List<ManagementPlan>();
                    }
                }
            }
        }

        private void SaveData(List<ManagementPlan> data)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_jsonFilePath, json);
            }
        }

        public Task<IEnumerable<ManagementPlan>> GetAllAsync()
        {
            var data = LoadData();
            return Task.FromResult<IEnumerable<ManagementPlan>>(data.OrderByDescending(x => x.Gid));
        }

        public Task<ManagementPlan?> GetByIdAsync(int gid)
        {
            var data = LoadData();
            return Task.FromResult(data.FirstOrDefault(x => x.Gid == gid));
        }
    }
}
