namespace Domain.Records.DTOs
{
    public class DepartmentDto
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; } // Afdeling
        public required string Unit { get; set; } // Eenheid
        public required string Service { get; set; }  // Dienst
    }

    public class CreateDepartmentDto
    {
        public required string Name { get; set; }
        public required string Unit { get; set; }
        public required string Service { get; set; }
    }
}
