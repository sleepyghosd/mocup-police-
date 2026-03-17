namespace Domain.Records.DTOs
{
    public class TemplateVarDto
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public required string PayloadJson { get; set; }
    }

    public class CreateTemplateVarDto
    {
        public required string Name { get; set; }
        public required string PayloadJson { get; set; }
    }


    public class PatchTemplateVarDto
    {
        public string? Name { get; set; }
        public string? PayloadJson { get; set; }
    }
};


