using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class FileRecordRepository : IFileRecordRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<FileRecord> _fileRecords;

    public FileRecordRepository(AppDbContext context)
    {
        _context = context;
        _fileRecords = _context.Set<FileRecord>();
    }

    public Task AddAsync(FileRecord fileRecord, CancellationToken cancellationToken = default)
    {
        _fileRecords.AddAsync(fileRecord, cancellationToken);
        return _context.SaveChangesAsync(cancellationToken);
    }

    public Task DeleteAsync(FileRecord fileRecord, CancellationToken cancellationToken = default)
    {
        _fileRecords.Remove(fileRecord);
        _context.FileRecords.Remove(fileRecord);
        return _context.SaveChangesAsync(cancellationToken);
    }

    public Task UpdateAsync(FileRecord fileRecord, CancellationToken cancellationToken = default)
    {
        _fileRecords.Update(fileRecord);
        return _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<FileRecord?> GetByIdAsync(Guid fileRecordId, CancellationToken cancellationToken = default)
    {
        return await _fileRecords
            .Include(fr => fr.Image)
            .SingleOrDefaultAsync(fr => fr.Id == fileRecordId, cancellationToken);
    }

    public async Task<List<FileRecord>> GetAllImagesNotEmbedded(CancellationToken cancellationToken = default)
    {
        return await _fileRecords
            .Include(f => f.Image)
            .Where(f => f.Image != null && !f.Image.IsEmbedded)
            .ToListAsync(cancellationToken);
    }

    public async Task<FileRecord?> GetByHashAsync(string hash, CancellationToken cancellationToken = default)
    {
        return await _fileRecords
            .Include(f => f.Image)
            .Where(f => f.Hash == hash).FirstOrDefaultAsync(cancellationToken);
    }

    public Task<List<FileRecord>> GetAllByCaseAsync(Guid caseId, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public async Task<FileRecord?> GetByCdnPathAsync(Guid caseId, string cdnPath, CancellationToken cancellationToken)
    {
        return await _fileRecords
            .Include(f => f.AssociatedEntities)
            .Include(f => f.AssociatedMarkers)
            .FirstOrDefaultAsync(
                f => f.CaseId == caseId && f.CdnPath == cdnPath,
                cancellationToken);
    }
}