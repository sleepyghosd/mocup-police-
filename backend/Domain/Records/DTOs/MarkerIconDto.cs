using Domain.Records.Entities;

namespace Domain.Records.DTOs
{
    public class MarkerIconDto
    {
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Code { get; set; }
        public InvolvedEntityType? AssociatedEntityType { get; set; }
        public required AssetFileDto Icon { get; set; }
    }
}
