using metadata_forvaltningsplan_api.Data;
using metadata_forvaltningsplan_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace metadata_forvaltningsplan_api.Controllers
{
    [ApiController]
    [Route("managementplan")]
    public class ManagementPlanController : ControllerBase
    {
        private readonly IManagementPlanRepository _repository;
        private readonly ILogger<ManagementPlanController> _logger;

        public ManagementPlanController(IManagementPlanRepository repository, ILogger<ManagementPlanController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        /// <summary>
        /// Get all management plan records
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ManagementPlan>>> GetAll()
        {
            try
            {
                var items = await _repository.GetAllAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving management plan records");
                return StatusCode(500, new { error = "An error occurred while retrieving records", details = ex.Message });
            }
        }

        /// <summary>
        /// Get a management plan record by GID
        /// </summary>
        [HttpGet("{gid}")]
        public async Task<ActionResult<ManagementPlan>> GetById(int gid)
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
                _logger.LogError(ex, "Error retrieving management plan record {Gid}", gid);
                return StatusCode(500, new { error = "An error occurred while retrieving the record", details = ex.Message });
            }
        }
    }
}
