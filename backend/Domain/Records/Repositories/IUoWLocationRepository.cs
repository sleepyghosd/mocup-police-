using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface IUoWLocationRepository
    {
        Task<Location?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Location>> GetAllAsync(CancellationToken cancellationToken = default);
        void Add(Location location);
        void Update(Location location);
        void Delete(Location location);
    }
}

