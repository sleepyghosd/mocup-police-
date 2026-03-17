using Domain.Records.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Configurations
{
    public class OfficerConfiguration : IEntityTypeConfiguration<Officer>
    {
        public void Configure(EntityTypeBuilder<Officer> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(o => o.User) // some officers may not have an User, however an User is dependent on an officer
                   .WithOne(u => u.Officer)
                   .HasForeignKey<User>(u => u.OfficerId)
                   .IsRequired(false);

        }
    }
}

