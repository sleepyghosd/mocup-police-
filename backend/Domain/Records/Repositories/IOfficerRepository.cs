using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface IOfficerRepository
    {
        Task<Officer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Officer>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<List<Officer>> GetAllByDepartmentIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Officer>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default);
        Task AddAsync(Officer officer, CancellationToken cancellationToken = default);
        Task UpdateAsync(Officer officer, CancellationToken cancellationToken = default);
        Task DeleteAsync(Officer officer, CancellationToken cancellationToken = default);
    }
}

