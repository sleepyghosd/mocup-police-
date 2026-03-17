using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface IUoWCaseRepository
    {
        Task<Case?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<Case?> GetByCaseNumberAsync(string caseNumber, CancellationToken cancellationToken = default);
        Task<List<Case>> GetAllAsync(CancellationToken cancellationToken = default);

        void Add(Case caseEntity);
        void Update(Case caseEntity);
        void Delete(Case caseEntity);
    }
}
