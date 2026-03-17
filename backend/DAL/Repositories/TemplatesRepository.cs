using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class TemplatesRepository : ITemplatesRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<Template> _templates;
    
    public TemplatesRepository(AppDbContext context)
    {
        _context = context;
        _templates = _context.Set<Template>();
    }

    public async Task<Template?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _templates
            .Include(c => c.Department)
            .SingleOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<List<Template>> GetAllByDepartmentIdAsync(Guid departmentId, CancellationToken cancellationToken = default)
    {
        return await _templates
            .Include(t => t.Department)
            .Where(t => t.DepartmentId == departmentId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Template>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _templates.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Template department, CancellationToken cancellationToken = default)
    {
        await _templates.AddAsync(department, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Template department, CancellationToken cancellationToken = default)
    {
        _templates.Update(department);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Template department, CancellationToken cancellationToken = default)
    {
        _templates.Remove(department);
        await _context.SaveChangesAsync(cancellationToken);
    }
}