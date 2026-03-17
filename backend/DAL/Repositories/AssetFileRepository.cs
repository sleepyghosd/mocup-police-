using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class AssetFileRepository : IAssetFileRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<AssetFile> _assetFiles;

        public AssetFileRepository(AppDbContext context)
        {
            _context = context;
            _assetFiles = _context.Set<AssetFile>();
        }

        public async Task<AssetFile?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _assetFiles
                .SingleOrDefaultAsync(f => f.Id == id, cancellationToken);
        }

        public async Task<List<AssetFile>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _assetFiles
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(AssetFile assetFile, CancellationToken cancellationToken = default)
        {
            await _assetFiles.AddAsync(assetFile, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(AssetFile assetFile, CancellationToken cancellationToken = default)
        {
            _assetFiles.Update(assetFile);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(AssetFile assetFile, CancellationToken cancellationToken = default)
        {
            _assetFiles.Remove(assetFile);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

