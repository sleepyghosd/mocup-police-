using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class OfficerRepository : IOfficerRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Officer> _officers;

        public OfficerRepository(AppDbContext context)
        {
            _context = context;
            _officers = _context.Set<Officer>();
        }

        public async Task<Officer?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _officers
                .Include(o => o.Department)
                .SingleOrDefaultAsync(o => o.Id == id, cancellationToken);
        }

        public async Task<List<Officer>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _officers
                .Include(o => o.Department)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Officer>> GetAllByDepartmentIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _officers
                .Where(m => m.DepartmentId == id)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<Officer>> GetByIdsAsync(IEnumerable<Guid> ids, CancellationToken cancellationToken = default)
        {
            var idList = ids.ToList();
            return await _officers
                .Include(o => o.Department)
                .Where(o => idList.Contains(o.Id))
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Officer officer, CancellationToken cancellationToken = default)
        {
            await _officers.AddAsync(officer, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(Officer officer, CancellationToken cancellationToken = default)
        {
            _officers.Update(officer);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Officer officer, CancellationToken cancellationToken = default)
        {
            _officers.Remove(officer);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

