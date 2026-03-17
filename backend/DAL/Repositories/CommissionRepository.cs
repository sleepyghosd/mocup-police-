    using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class CommissionRepository : IUoWCommissionRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Commission> _commissions;

        public CommissionRepository(AppDbContext context)
        {
            _context = context;
            _commissions = _context.Set<Commission>();
        }

        public async Task<Commission?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _commissions
                .SingleOrDefaultAsync(c => c.Id == id, cancellationToken);
        }

        public async Task<List<Commission>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _commissions
                .ToListAsync(cancellationToken);
        }

        public void Add(Commission commission)
        {
            _commissions.Add(commission);
        }

        public void Update(Commission commission)
        {
            _commissions.Update(commission);
        }

        public void Delete(Commission commission)
        {
            _commissions.Remove(commission);
        }
    }
}

