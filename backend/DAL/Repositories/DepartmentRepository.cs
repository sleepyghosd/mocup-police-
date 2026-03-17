using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Department> _departments;

        public DepartmentRepository(AppDbContext context)
        {
            _context = context;
            _departments = _context.Set<Department>();
        }

        public async Task<Department?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _departments
                .SingleOrDefaultAsync(d => d.Id == id, cancellationToken);
        }

        public async Task<List<Department>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _departments
                .ToListAsync(cancellationToken);
        }

        public async Task AddAsync(Department department, CancellationToken cancellationToken = default)
        {
            await _departments.AddAsync(department, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(Department department, CancellationToken cancellationToken = default)
        {
            _departments.Update(department);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteAsync(Department department, CancellationToken cancellationToken = default)
        {
            _departments.Remove(department);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

