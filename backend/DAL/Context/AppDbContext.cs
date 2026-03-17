using DAL.Configurations;
using DAL.Conventions;
using Domain.Records.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Case> Cases { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Commission> Commissions { get; set; }
        public DbSet<CaseOfficer> CaseOfficers { get; set; }
        public DbSet<Officer> Officers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<Marker> Markers { get; set; }
        public DbSet<MarkerIcon> MarkerIcons { get; set; }
        public DbSet<AssetFile> AssetFiles { get; set; }
        public DbSet<FileRecord> FileRecords { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<ImageObservation> ImageObservations { get; set; }
        public DbSet<InvolvedEntity> InvolvedEntities { get; set; }
        public DbSet<TemplateVar> TemplateVars { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply configurations for each entity
            modelBuilder.ApplyConfiguration(new CaseConfiguration());
            modelBuilder.ApplyConfiguration(new OfficerConfiguration());
            modelBuilder.ApplyConfiguration(new ImageConfiguration());
            // Apply snake_case naming (which is conventional in mysql) by converting PascalCase (which is default in c# / efcore)
            modelBuilder.UseSnakeCaseNaming();
        }

        public override int SaveChanges()
        {
            TimestampConvention.UpdateTimestamps(ChangeTracker);
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            TimestampConvention.UpdateTimestamps(ChangeTracker);
            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}