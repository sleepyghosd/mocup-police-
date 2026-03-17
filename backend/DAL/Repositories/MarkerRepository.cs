using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class MarkerRepository : IMarkerRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Marker> _markers;

        public MarkerRepository(AppDbContext context)
        {
            _context = context;
            _markers = _context.Set<Marker>();
        }

        public async Task<Marker?> GetByIdAsync(Guid caseId, Guid markerId, CancellationToken cancellationToken = default)
        {
            return await _markers
                .Include(m => m.Icon)   
                    .ThenInclude(i => i.Icon) // MarkerIcon.Icon is a FileRecord
                .Where(m => m.CaseId == caseId)
                .SingleOrDefaultAsync(m => m.Id == markerId, cancellationToken);
        }

        public async Task<List<Marker>> GetAllByCaseIdAsync(Guid caseId, CancellationToken cancellationToken = default)
        {
            return await _markers
                .Include(m => m.Icon)
                    .ThenInclude(i => i.Icon) // MarkerIcon.Icon is a FileRecord
                .Where(m => m.CaseId == caseId)
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Marker marker, CancellationToken cancellationToken = default)
        {
            await _markers.AddAsync(marker, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(Marker marker, CancellationToken cancellationToken = default)
        {
            _markers.Update(marker);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Marker marker, CancellationToken cancellationToken = default)
        {
            _markers.Remove(marker);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

