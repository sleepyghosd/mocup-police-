using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface IUoWCommissionRepository
    {
        Task<Commission?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Commission>> GetAllAsync(CancellationToken cancellationToken = default);
        void Add(Commission commission);
        void Update(Commission commission);
        void Delete(Commission commission);
    }
}

