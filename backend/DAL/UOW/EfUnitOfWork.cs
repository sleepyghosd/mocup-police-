using DAL.Context;
using Domain.Records.UOWs;
using Microsoft.EntityFrameworkCore.Storage;

namespace DAL.UOW
{
    public sealed class EfUnitOfWork : IUnitOfWork, IAsyncDisposable
    {
        private readonly AppDbContext _dbContext;
        private IDbContextTransaction? _transaction;

        public EfUnitOfWork(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task BeginAsync(CancellationToken cancellationToken)
        {
            if (_transaction != null)
                throw new InvalidOperationException("Transaction already started.");

            _transaction =
                await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task CommitAsync(CancellationToken cancellationToken)
        {
            if (_transaction == null)
                throw new InvalidOperationException("No active transaction.");

            await _transaction.CommitAsync(cancellationToken);
            await DisposeTransactionAsync();
        }

        public async Task RollbackAsync()
        {
            if (_transaction == null)
                return;

            await _transaction.RollbackAsync(CancellationToken.None);
            await DisposeTransactionAsync();
        }

        private async Task DisposeTransactionAsync()
        {
            await _transaction!.DisposeAsync();
            _transaction = null;
        }

        public async ValueTask DisposeAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync(CancellationToken.None);
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }
    }

}
