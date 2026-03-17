using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class LocationMapper
    {
        public static LocationDto MapToDto(Location location)
        {
            return new LocationDto
            {
                Id = location.Id,
                Street = location.Street,
                City = location.City,
                Municipality = location.Municipality
            };
        }
    }
}
