namespace Domain.Records.UOWs
{
    public interface IUnitOfWork
    {
        Task BeginAsync(CancellationToken cancellationToken);
        Task CommitAsync(CancellationToken cancellationToken);
        Task RollbackAsync();
        Task SaveChangesAsync(CancellationToken cancellationToken);
    }
}
