using Microsoft.AspNetCore.Http;

namespace Domain.Records.DTOs
{
    public class FileRecordDto
    {
        public required Guid Id { get; set; }
        public required Guid CaseId { get; set; }
        public required string CdnUrl { get; set; }
        public required bool IsFavorite { get; set; }
        public required long Size { get; set; } // bytes

        public required string Hash { get; set; }
        // TODO implement: public List<InvolvedEntity> AssociatedEntities { get; set; }
        // TODO implement: public List<Marker> AssociatedMarkers { get; set; }
    }

    public class CreateFileRecordDto
    {
        public required IFormFile File { get; set; }
        public required string? CaseDirectory { get; set; }
        public required bool IsFavorite { get; set; }
    }

    public class UpdateFavoriteDto
    {
        public required bool IsFavorite { get; set; }
    }
}
