using Domain.Records.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DAL.Conventions
{
    internal static class TimestampConvention
    {
        internal static void UpdateTimestamps(ChangeTracker changeTracker)
        {
            foreach (var entry in changeTracker.Entries<Entity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Property(nameof(Entity.CreatedAt)).CurrentValue = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Property(nameof(Entity.UpdatedAt)).CurrentValue = DateTime.UtcNow;
                        break;
                    case EntityState.Deleted:
                        entry.State = EntityState.Modified; // soft delete
                        entry.Property(nameof(Entity.DeletedAt)).CurrentValue = DateTime.UtcNow;
                        break;
                }
            }
        }
    }
}
