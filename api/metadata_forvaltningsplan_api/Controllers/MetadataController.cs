using metadata_forvaltningsplan_api.Data;
using metadata_forvaltningsplan_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace metadata_forvaltningsplan_api.Controllers
{
    [ApiController]
    [Route("metadata")]
    public class MetadataController : ControllerBase
    {
        private readonly IMetadataRepository _repository;
        private readonly ILogger<MetadataController> _logger;

        public MetadataController(IMetadataRepository repository, ILogger<MetadataController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        /// <summary>
        /// Get all metadata records
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Metadata>>> GetAll()
        {
            try
            {
                var items = await _repository.GetAllAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving metadata records");
                return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
            }
        }

        /// <summary>
        /// Get a metadata record by GID
        /// </summary>
        [HttpGet("{gid}")]
        public async Task<ActionResult<Metadata>> GetById(int gid)
        {
            try
            {
                var item = await _repository.GetByIdAsync(gid);
                if (item == null)
                {
                    return NotFound();
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving metadata record {Gid}", gid);
                return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
            }
        }
    }
}
