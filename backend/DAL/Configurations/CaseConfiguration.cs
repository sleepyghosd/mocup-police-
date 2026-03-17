using Domain.Records.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Configurations
{
    public class CaseConfiguration : IEntityTypeConfiguration<Case>
    {
        public void Configure(EntityTypeBuilder<Case> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id)
                   .ValueGeneratedOnAdd();

            // -----------------------
            // One-to-one: Case <-> Location, Case <-> Department
            // Case is dependent (has FK)
            // -----------------------
            builder.HasOne(c => c.Location)       // Case.Location
                   .WithOne(l => l.Case)          // Location.Case
                   .HasForeignKey<Case>(c => c.LocationId) // Case table holds the FK
                   .IsRequired();

            builder.HasOne(c => c.Commission)
                    .WithOne(d => d.Case)
                    .HasForeignKey<Case>(c => c.CommissionId)
                    .IsRequired();

            // -----------------------
            // Many-to-one navigations
            // -----------------------
            builder.HasOne(c => c.Department).WithMany().IsRequired();

            // -----------------------
            // Officers backing field
            // -----------------------
            builder.HasMany(c => c.Officers)
                   .WithOne(co => co.Case)
                   .HasForeignKey(co => co.CaseId);

            builder.Navigation(c => c.Officers)
                   .UsePropertyAccessMode(PropertyAccessMode.Field);
        }
    }
}

