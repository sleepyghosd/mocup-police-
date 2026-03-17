using Domain.Records.Entities;

namespace Domain.Records.Repositories;

public interface IFileRecordRepository
{
    Task AddAsync(FileRecord fileRecord, CancellationToken cancellationToken = default);
    Task DeleteAsync(FileRecord fileRecord, CancellationToken cancellationToken = default);
    Task UpdateAsync(FileRecord fileRecord, CancellationToken cancellationToken = default);
    Task<FileRecord?> GetByIdAsync(Guid fileRecordId, CancellationToken cancellationToken = default);
    Task<List<FileRecord>> GetAllByCaseAsync(Guid caseId, CancellationToken cancellationToken = default);
    Task<FileRecord?> GetByCdnPathAsync(Guid caseId, string cdnPath, CancellationToken cancellationToken = default);
    Task<List<FileRecord>> GetAllImagesNotEmbedded(CancellationToken cancellationToken = default);
    Task<FileRecord?> GetByHashAsync(string hash, CancellationToken cancellationToken = default);
}