using Domain.Records.Entities;

namespace Domain.Records.Repositories
{
    public interface ITemplatesRepository
    {
        Task<Template?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<List<Template>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<List<Template>> GetAllByDepartmentIdAsync(Guid departmentId, CancellationToken cancellationToken = default);
        Task AddAsync(Template department, CancellationToken cancellationToken = default);
        Task UpdateAsync(Template department, CancellationToken cancellationToken = default);
        Task DeleteAsync(Template department, CancellationToken cancellationToken = default);
    }
};
