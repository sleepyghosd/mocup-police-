namespace Domain.Records.Entities
{
    public class User : Entity
    {
        public required string Username { get; set; }
        public DateTime? LastLoginAt { get; set; }

        private readonly List<Role> _roles = new();
        public IReadOnlyCollection<Role> Roles => _roles.AsReadOnly();
        
        public required Guid OfficerId { get; set; }
        public required Officer Officer { get; set; }

        public void AddRole(Role role)
        {
            if (!_roles.Contains(role))
            {
                _roles.Add(role);
            }
        }

        public void RemoveRole(Role role)
        {
            _roles.Remove(role);
        }
    }
}
