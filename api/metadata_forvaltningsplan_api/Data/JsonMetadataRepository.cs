using metadata_forvaltningsplan_api.Models;
using System.Text.Json;

namespace metadata_forvaltningsplan_api.Data
{
    public class JsonMetadataRepository:IMetadataRepository
    {
        private readonly string _jsonFilePath;
        private readonly ILogger<JsonMetadataRepository> _logger;
        private readonly object _lock = new object();

        public JsonMetadataRepository(ILogger<JsonMetadataRepository> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _jsonFilePath = Path.Combine(env.ContentRootPath, "data", "metadata.json");

            _logger.LogInformation("JSON Metadata Repository initialized. File path: {Path}", _jsonFilePath);

            var directory = Path.GetDirectoryName(_jsonFilePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            if (!File.Exists(_jsonFilePath))
            {
                _logger.LogInformation("JSON file not found, initializing with one sample record");
                InitializeSampleData();
            }
        }

        private void InitializeSampleData()
        {
            var sample = new List<Metadata>
        {
            new Metadata
            {
                Gid = 1,
                SakerhetsKlassDokument = "sk-0-test.pdf",
                ArendeNummer = "263521",
                BestallareNamn = "Testnamn",
                BestallareEpost = "testnamn@test.com",
                SakerhetsKlass = "sk0_test",
                DataKallaTyp = "{Extern,organisation}",
                Schema = "sk0_schema_test",
                Namn = "lekplatser_test_123",
                Beskrivning = "Test beskrivning",
                Syfte = "Att identifiera alla lekplatser och ta en kopp kaffe",
                Datakalla = ["Extern","organisation"],
                Metod = "Fjärranalys",
                Projekt = "Nej",
                GeografiskBegransning = ["tätort","test"],
                UppdateringsFrekvens = "Årligen",
                Fullstandighet = "Fullständig",
                Skalniva = "2",
                NyckelOrd = ["Tätortsmiljö","Test"],
                Kategori = "Nybyggnation",
                Tidsperiod = false,
                TidsperiodStartdatum = new DateOnly(2026, 4, 15),
                TidsperiodSlutdatum = new DateOnly(2026, 4, 15),
                TidsUpplosning = "Sekund",
                SkapelseDatum = new DateOnly(2026, 4, 14),
                AnvandarBegransningLicens = false,
                AnvandarBegransningLicensText = "Test",
                RelateradeResurser = ["Nej"],
                Status = "granskas",
                Handlaggare = "Jag",
                MetaDataVersion = "1.0",
                SkapadTidPunkt = DateTimeOffset.Parse("2026-02-14T15:00:05.462671+01:00")
            },
            new Metadata
            {
                Gid = 2,
                SakerhetsKlassDokument = "sk-0-test.pdf",
                ArendeNummer = "2026BM132",
                BestallareNamn = "Testnamn2",
                BestallareEpost = "testnamn2@test.com",
                SakerhetsKlass = "sk0_test",
                DataKallaTyp = "{Extern,organisation}",
                Schema = "sk0_schema_test",
                Namn = "lekplatser_test_123",
                Beskrivning = "Test beskrivning",
                Syfte = "Att identifiera alla lekplatser och ta en kopp kaffe",
                Datakalla = ["Extern","organisation"],
                Metod = "Fjärranalys",
                Projekt = "Nej",
                GeografiskBegransning = ["tätort","test"],
                UppdateringsFrekvens = "Årligen",
                Fullstandighet = "Fullständig",
                Skalniva = "2",
                NyckelOrd = ["Tätortsmiljö","Test"],
                Kategori = "Hälsa",
                Tidsperiod = false,
                TidsperiodStartdatum = new DateOnly(2026, 4, 15),
                TidsperiodSlutdatum = new DateOnly(2026, 4, 15),
                TidsUpplosning = "Sekund",
                SkapelseDatum = new DateOnly(2026, 4, 14),
                AnvandarBegransningLicens = false,
                AnvandarBegransningLicensText = "Test",
                RelateradeResurser = ["Nej"],
                Status = "granskas",
                Handlaggare = "Jag",
                MetaDataVersion = "1.0",
                SkapadTidPunkt = DateTimeOffset.Parse("2026-02-14T15:00:05.462671+01:00")
            }
        };

            SaveData(sample);
        }

        private List<Metadata> LoadData()
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
                    var data = JsonSerializer.Deserialize<List<Metadata>>(json, options);
                    return data ?? new List<Metadata>();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error loading order summary from {Path}", _jsonFilePath);
                    try
                    {
                        InitializeSampleData();
                        var json = File.ReadAllText(_jsonFilePath);
                        return JsonSerializer.Deserialize<List<Metadata>>(json,
                            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<Metadata>();
                    }
                    catch
                    {
                        return new List<Metadata>();
                    }
                }
            }
        }


        private void SaveData(List<Metadata> data)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_jsonFilePath, json);
            }
        }

        public Task<IEnumerable<Metadata>> GetAllAsync()
        {
            var data = LoadData();
            return Task.FromResult<IEnumerable<Metadata>>(data.OrderByDescending(x => x.Gid));
        }

        public Task<Metadata?> GetByIdAsync(int gid)
        {
            var data = LoadData();
            return Task.FromResult(data.FirstOrDefault(x => x.Gid == gid));
        }
    }

}


