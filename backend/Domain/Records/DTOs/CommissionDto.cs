namespace Domain.Records.DTOs
{
    public class CommissionDto
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; } // Naam opdrachtgever
        public required string EmployedAt { get; set; } // Opdrachtgever - werkzaam bij
        public required string Location { get; set; }  // Locatie
    }

    public class CreateCommissionDto
    {
        public required string Name { get; set; }
        public required string EmployedAt { get; set; }
        public required string Location { get; set; }
    }
}
