using metadata_forvaltningsplan_api.Models;

namespace metadata_forvaltningsplan_api.Data
{
    public interface IManagementPlanRepository
    {
        Task<IEnumerable<ManagementPlan>> GetAllAsync();
        Task<ManagementPlan?> GetByIdAsync(int gid);
    }
}
