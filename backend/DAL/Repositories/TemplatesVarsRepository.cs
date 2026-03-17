using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class TemplateVarsRepository : ITemplateVarsRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<TemplateVar> _templatesVars;
    
    public TemplateVarsRepository(AppDbContext context)
    {
        _context = context;
        _templatesVars = _context.Set<TemplateVar>();
    }

    public async Task<TemplateVar?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _templatesVars
            .SingleOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<List<TemplateVar>> GetAllByCaseIdAsync(Guid caseId, CancellationToken cancellationToken = default)
    {
        return await _templatesVars
            .Where(t => t.CaseId == caseId)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<TemplateVar>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _templatesVars.ToListAsync(cancellationToken);
    }

    public async Task<TemplateVar?> GetByTemplateVarIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _templatesVars
            .SingleOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task AddAsync(TemplateVar templateVar, CancellationToken cancellationToken = default)
    {
        await _templatesVars.AddAsync(templateVar, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(TemplateVar templateVar, CancellationToken cancellationToken = default)
    {
        _templatesVars.Update(templateVar);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(TemplateVar templateVar, CancellationToken cancellationToken = default)
    {
        _templatesVars.Remove(templateVar);
        await _context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task SaveAsync(CancellationToken ct = default)
    {
        await _context.SaveChangesAsync(ct);
    }
}