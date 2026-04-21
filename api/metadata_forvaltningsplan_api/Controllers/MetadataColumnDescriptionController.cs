using metadata_forvaltningsplan_api.Data;
using metadata_forvaltningsplan_api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace metadata_forvaltningsplan_api.Controllers
{
    [ApiController]
    [Route("metadatacolumndescription")]
    public class MetadataColumnDescriptionController : ControllerBase
    {
        private readonly IMetadataColumnDescriptionRepository _repository;
        private readonly ILogger<MetadataColumnDescriptionController> _logger;

        public MetadataColumnDescriptionController(
            IMetadataColumnDescriptionRepository repository,
            ILogger<MetadataColumnDescriptionController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        /// <summary>
        /// Get all metadata column description records
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MetadataColumnDescription>>> GetAll()
        {
            try
            {
                var items = await _repository.GetAllAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving metadata column descriptions");
                return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
            }
        }

        /// <summary>
        /// Get a metadata column description record by GID
        /// </summary>
        [HttpGet("{gid}")]
        public async Task<ActionResult<MetadataColumnDescription>> GetById(int gid)
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
                _logger.LogError(ex, "Error retrieving metadata column description record {Gid}", gid);
                return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
            }
        }
    }
}
