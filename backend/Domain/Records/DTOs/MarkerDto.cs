namespace Domain.Records.DTOs
{
    public class MarkerDto
    {
        public required Guid Id { get; set; }
        public required Guid CaseId { get; set; }
        public required string Title { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public required decimal NorthRd { get; set; }
        public required decimal EastRd { get; set; }
        public decimal? HeightRd { get; set; }
        public required MarkerIconDto Icon { get; set; }
    }

    public class CreateMarkerDto
    {
        public required Guid MarkerIconId { get; set; }
        public required string Title { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public required decimal NorthRd { get; set; }
        public required decimal EastRd { get; set; }
        public decimal? HeightRd { get; set; }
    }


    public class PatchMarkerDto
    {
        public required Guid MarkerIconId { get; set; }
        public required string Title { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public required decimal NorthRd { get; set; }
        public required decimal EastRd { get; set; }
        public decimal? HeightRd { get; set; }
    }
};


