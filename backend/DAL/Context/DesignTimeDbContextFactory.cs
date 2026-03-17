using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

// used for EF to have DAL as a runnable startup project to significantly reduce design (ef migration) startup times

namespace DAL.Context
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            // Use environment variable or hardcoded connection string for design time
            var connectionString = Environment.GetEnvironmentVariable("MYSQL_CONNECTIONSTRING")
                ?? throw new InvalidOperationException("MYSQL_CONNECTIONSTRING is not set!");

            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
