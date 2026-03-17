using Domain.Records.Entities;

namespace Domain.Records.Repositories;

public interface IImageRepository
{
    Task<List<Image>> GetAllByCaseIdAsync(Guid caseId, CancellationToken cancellationToken = default);
    Task<Image?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Image image, CancellationToken cancellationToken = default);
    Task UpdateAsync(Image image, CancellationToken cancellationToken = default);
    Task DeleteAsync(Image image, CancellationToken cancellationToken = default);
}