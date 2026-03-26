using metadata_forvaltningsplan_api.Models;
using metadata_forvaltningsplan_api.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace metadata_forvaltningsplan_api.Data;

public class DbContextMetadataRepository : IMetadataRepository
{
    private readonly AppDbContext _context;

    public DbContextMetadataRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Metadata>> GetAllAsync()
    {
        return await _context.Metadatas
            .OrderBy(x => x.Gid)
            .ToListAsync();
    }

    public async Task<Metadata?> GetByIdAsync(int gid)
    {
        return await _context.Metadatas.FindAsync(gid);
    }
}

