using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class Location : Entity
    {
        public Case Case { get; set; } = null!; // requires configuration to explicitly define case to be dependent
        public required string Street { get; set; } // straatnaam
        public required string City { get; set; } // plaatsnaam
        public required string Municipality { get; set; } // gemeente

        [NotMapped]
        public LocationDto Dto { get => LocationMapper.MapToDto(this); }

        private Location() { } // EF needs this

        [SetsRequiredMembers]
        public Location(CreateLocationDto createDto)
        {
            Street = createDto.Street;
            City = createDto.City;
            Municipality = createDto.Municipality;
        }
    }
}
