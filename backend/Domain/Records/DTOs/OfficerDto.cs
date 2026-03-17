namespace Domain.Records.DTOs
{
    public class OfficerDto
    {
        public required Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required DepartmentDto Department { get; set; } // Afdeling
        public required string Team { get; set; } // Team
        public required int Position { get; set; }
    }

    public class CreateOfficerDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Team { get; set; }
    }
}
