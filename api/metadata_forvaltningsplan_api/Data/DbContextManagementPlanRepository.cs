using metadata_forvaltningsplan_api.Models;
using metadata_forvaltningsplan_api.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace metadata_forvaltningsplan_api.Data;

public class DbContextManagementPlanRepository : IManagementPlanRepository
{
    private readonly AppDbContext _context;

    public DbContextManagementPlanRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ManagementPlan>> GetAllAsync()
    {
        return await _context.ManagementPlans
            .OrderBy(x => x.Gid)
            .ToListAsync();
    }

    public async Task<ManagementPlan?> GetByIdAsync(int gid)
    {
        return await _context.ManagementPlans.FindAsync(gid);
    }
}
