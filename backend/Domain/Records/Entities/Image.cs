namespace Domain.Records.Entities
{
    public class Image : Entity
    {
        public bool IsHidden { get; set; } = false;
        public bool IsBlurry { get; set; } = false;
        public bool IsEmbedded { get; set; } = false;

        public required Guid FileId { get; set; }
        public FileRecord File { get; set; } = null!;
    }
}