using metadata_forvaltningsplan_api.Models;
using metadata_forvaltningsplan_api.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace metadata_forvaltningsplan_api.Data;

public class DbContextMetadataTechDescriptionRepository : IMetadataTechDescriptionRepository
{
    private readonly AppDbContext _context;

    public DbContextMetadataTechDescriptionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MetadataTechDescription>> GetAllAsync()
    {
        return await _context.MetadataTechDescriptions
            .OrderBy(x => x.Gid)
            .ToListAsync();
    }

    public async Task<MetadataTechDescription?> GetByIdAsync(int gid)
    {
        return await _context.MetadataTechDescriptions.FindAsync(gid);
    }
}
