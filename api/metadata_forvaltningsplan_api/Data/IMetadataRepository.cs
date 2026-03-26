using metadata_forvaltningsplan_api.Models;

namespace metadata_forvaltningsplan_api.Data
{
    public interface IMetadataRepository
    {
        Task<IEnumerable<Metadata>> GetAllAsync();
        Task<Metadata?> GetByIdAsync(int gid);
    }
}
