namespace Domain.Records.DTOs
{
    public class TemplateDto
    {
        public required Guid Id { get; set; }
        public required DepartmentDto Department { get; set; }
        public required string Name { get; set; }
        public required string PayloadJson { get; set; }
    }

    public class CreateTemplateDto
    {
        public required string Name { get; set; }
        public required string PayloadJson { get; set; }
    }
};


