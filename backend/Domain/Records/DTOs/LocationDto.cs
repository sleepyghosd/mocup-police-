namespace Domain.Records.DTOs
{
    public class LocationDto
    {
        public required Guid Id { get; set; }
        public required string Street { get; set; } // straatnaam
        public required string City { get; set; } // plaatsnaam
        public required string Municipality { get; set; } // gemeente
    }

    public class CreateLocationDto
    {
        public required string Street { get; set; }
        public required string City { get; set; }
        public required string Municipality { get; set; }
    }
}
