namespace Domain.Records.DTOs
{
    public class AssetFileDto
    {
        public required Guid Id { get; set; }
        public required string CdnUrl { get; set; }
    }

    public class CreateAssetFileDto
    {
        public required string CdnPath { get; set; }
    }
}
