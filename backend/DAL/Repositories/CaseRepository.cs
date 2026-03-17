using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class CaseRepository : IUoWCaseRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Case> _cases;

        public CaseRepository(AppDbContext context)
        {
            _context = context;
            _cases = _context.Set<Case>();
        }

        public async Task<Case?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _cases
                .Include(c => c.Location)
                .Include(c => c.Commission)
                .Include(c => c.Department)
                .Include(c => c.Officers)
                    .ThenInclude(co => co.Officer)
                .SingleOrDefaultAsync(c => c.Id == id, cancellationToken);
        }

        public async Task<Case?> GetByCaseNumberAsync(string caseNumber, CancellationToken cancellationToken = default)
        {
            return await _cases
                .Include(c => c.Location)
                .Include(c => c.Commission)
                .Include(c => c.Department)
                .Include(c => c.Officers)
                    .ThenInclude(co => co.Officer)
                .SingleOrDefaultAsync(c => c.CaseNumber == caseNumber, cancellationToken);
        }

        public async Task<List<Case>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _cases
                .Include(c => c.Location)
                .Include(c => c.Commission)
                .Include(c => c.Department)
                .Include(c => c.Officers)
                    .ThenInclude(co => co.Officer)
                .ToListAsync(cancellationToken);
        }

        public void Add(Case caseEntity)
        {
            _cases.Add(caseEntity);
        }

        public void Update(Case caseEntity)
        {
            _cases.Update(caseEntity);
        }

        public void Delete(Case caseEntity)
        {
            _cases.Remove(caseEntity);
        }
    }
}
