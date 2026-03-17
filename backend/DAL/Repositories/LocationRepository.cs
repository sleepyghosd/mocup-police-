using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class LocationRepository : IUoWLocationRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Location> _locations;

        public LocationRepository(AppDbContext context)
        {
            _context = context;
            _locations = _context.Set<Location>();
        }

        public async Task<Location?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _locations
                .SingleOrDefaultAsync(l => l.Id == id, cancellationToken);
        }

        public async Task<List<Location>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _locations
                .ToListAsync(cancellationToken);
        }

        public void Add(Location location)
        {
            _locations.Add(location);
        }

        public void Update(Location location)
        {
            _locations.Update(location);
        }

        public void Delete(Location location)
        {
            _locations.Remove(location);
        }
    }
}

