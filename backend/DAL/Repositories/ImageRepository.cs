using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class ImageRepository : IImageRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<Image> _images;

    public ImageRepository(AppDbContext context)
    {
        _context = context;
        _images = _context.Set<Image>();
    }

    public Task<List<Image>> GetAllByCaseIdAsync(Guid caseId, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    public Task<Image?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _images.Where(i => i.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public Task AddAsync(Image image, CancellationToken cancellationToken = default)
    {
        _images.AddAsync(image, cancellationToken);
        return _context.SaveChangesAsync(cancellationToken);
    }

    public Task UpdateAsync(Image image, CancellationToken cancellationToken = default)
    {
        _images.Update(image);
        return _context.SaveChangesAsync(cancellationToken);
    }

    public Task DeleteAsync(Image image, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}