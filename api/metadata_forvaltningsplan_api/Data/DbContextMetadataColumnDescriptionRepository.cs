using metadata_forvaltningsplan_api.Models;
using metadata_forvaltningsplan_api.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace metadata_forvaltningsplan_api.Data;

public class DbContextMetadataColumnDescriptionRepository : IMetadataColumnDescriptionRepository
{
    private readonly AppDbContext _context;

    public DbContextMetadataColumnDescriptionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MetadataColumnDescription>> GetAllAsync()
    {
        return await _context.MetadataColumnDescriptions
            .OrderBy(x => x.Gid)
            .ToListAsync();
    }

    public async Task<MetadataColumnDescription?> GetByIdAsync(int gid)
    {
        return await _context.MetadataColumnDescriptions.FindAsync(gid);
    }
}

