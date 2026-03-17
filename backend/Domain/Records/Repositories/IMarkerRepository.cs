using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface IMarkerRepository
    {
        Task<Marker?> GetByIdAsync(Guid caseId, Guid markerId, CancellationToken cancellationToken = default);
        Task<List<Marker>> GetAllByCaseIdAsync(Guid caseId, CancellationToken cancellationToken = default);
        Task AddAsync(Marker marker, CancellationToken cancellationToken = default);
        Task UpdateAsync(Marker marker, CancellationToken cancellationToken = default);
        Task DeleteAsync(Marker marker, CancellationToken cancellationToken = default);
    }
}
