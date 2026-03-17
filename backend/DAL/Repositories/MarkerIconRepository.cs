using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class MarkerIconRepository : IMarkerIconRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<MarkerIcon> _markerIcons;

        public MarkerIconRepository(AppDbContext context)
        {
            _context = context;
            _markerIcons = _context.Set<MarkerIcon>();
        }

        public async Task<MarkerIcon?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _markerIcons // MarkerIcon.Icon is a FileRecord
                .Include(i => i.Icon)   
                .SingleOrDefaultAsync(i => i.Id == id, cancellationToken);
        }

        public async Task<List<MarkerIcon>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _markerIcons
                .Include(i => i.Icon) // MarkerIcon.Icon is a FileRecord
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(MarkerIcon markerIcon, CancellationToken cancellationToken = default)
        {
            await _markerIcons.AddAsync(markerIcon, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(MarkerIcon markerIcon, CancellationToken cancellationToken = default)
        {
            _markerIcons.Update(markerIcon);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(MarkerIcon markerIcon, CancellationToken cancellationToken = default)
        {
            _markerIcons.Remove(markerIcon);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

