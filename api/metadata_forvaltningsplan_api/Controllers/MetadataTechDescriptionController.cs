using metadata_forvaltningsplan_api.Data;
using metadata_forvaltningsplan_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace metadata_forvaltningsplan_api.Controllers
{
    [ApiController]
    [Route("metadatatechdescription")]
    public class MetadataTechDescriptionController : ControllerBase
    {
        private readonly IMetadataTechDescriptionRepository _repository;
        private readonly ILogger<MetadataTechDescriptionController> _logger;

        public MetadataTechDescriptionController(
            IMetadataTechDescriptionRepository repository,
            ILogger<MetadataTechDescriptionController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        /// <summary>
        /// Get all metadata tech description records
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MetadataTechDescription>>> GetAll()
        {
            try
            {
                var items = await _repository.GetAllAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving metadata tech descriptions");
                return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
            }
        }

        /// <summary>
        /// Get a metadata tech description record by GID
        /// </summary>
        [HttpGet("{gid}")]
        public async Task<ActionResult<MetadataTechDescription>> GetById(int gid)
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
                _logger.LogError(ex, "Error retrieving metadata tech description record {Gid}", gid);
                return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
            }
        }
    }
}
