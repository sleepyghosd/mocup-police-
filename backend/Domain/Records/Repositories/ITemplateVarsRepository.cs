using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface ITemplateVarsRepository
    {
        Task<TemplateVar?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<TemplateVar>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<List<TemplateVar>> GetAllByCaseIdAsync(Guid caseId, CancellationToken cancellationToken = default);
        Task<TemplateVar?> GetByTemplateVarIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task AddAsync(TemplateVar department, CancellationToken cancellationToken = default);
        Task UpdateAsync(TemplateVar department, CancellationToken cancellationToken = default);
        Task DeleteAsync(TemplateVar department, CancellationToken cancellationToken = default);
        Task SaveAsync(CancellationToken ct = default);
    }
};
