using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface IAssetFileRepository
    {
        Task<AssetFile?> GetByIdAsync(Guid assetFileId, CancellationToken cancellationToken = default);
        Task<List<AssetFile>> GetAllAsync(CancellationToken cancellationToken = default);
        Task AddAsync(AssetFile assetFile, CancellationToken cancellationToken = default);
        Task UpdateAsync(AssetFile assetFile, CancellationToken cancellationToken = default);
        Task DeleteAsync(AssetFile assetFile, CancellationToken cancellationToken = default);
    }
}
