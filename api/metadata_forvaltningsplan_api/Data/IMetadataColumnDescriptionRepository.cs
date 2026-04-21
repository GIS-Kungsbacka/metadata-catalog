using metadata_forvaltningsplan_api.Models;

namespace metadata_forvaltningsplan_api.Data
{
    public interface IMetadataColumnDescriptionRepository
    {
        Task<IEnumerable<MetadataColumnDescription>> GetAllAsync();
        Task<MetadataColumnDescription?> GetByIdAsync(int gid);
    }
}

