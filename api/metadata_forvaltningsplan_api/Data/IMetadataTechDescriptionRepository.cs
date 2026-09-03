using metadata_forvaltningsplan_api.Models;

namespace metadata_forvaltningsplan_api.Data
{
    public interface IMetadataTechDescriptionRepository
    {
        Task<IEnumerable<MetadataTechDescription>> GetAllAsync();
        Task<MetadataTechDescription?> GetByIdAsync(int gid);
    }
}
