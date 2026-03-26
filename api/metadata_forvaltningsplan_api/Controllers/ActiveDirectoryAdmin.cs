using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace metadata_forvaltningsplan_api.Controllers
{
    [ApiController]
    [Route("me")]
    [Authorize]
    public class ActiveDirectoryAdmin : ControllerBase
    {

        [HttpGet]
        public IActionResult Get()
        {
            var username = User.Identity?.Name ?? "";
            return Ok(new { username });
        }
    }
}
