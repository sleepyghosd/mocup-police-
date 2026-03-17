namespace Domain.Records.Entities
{
    public enum Role
    {
        User = 1,
    }

    public class UserRole : Entity
    {
        public required Guid UserId { get; set; }
        public User User { get; set; } = default!;

        public required Role Role { get; set; }
    }
}
