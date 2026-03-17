using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface IMarkerIconRepository
    {
        Task<MarkerIcon?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<MarkerIcon>> GetAllAsync(CancellationToken cancellationToken = default);
        Task AddAsync(MarkerIcon markerIcon, CancellationToken cancellationToken = default);
        Task UpdateAsync(MarkerIcon markerIcon, CancellationToken cancellationToken = default);
        Task DeleteAsync(MarkerIcon markerIcon, CancellationToken cancellationToken = default);
    }
}
