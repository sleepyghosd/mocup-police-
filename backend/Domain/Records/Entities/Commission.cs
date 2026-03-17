using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class Commission : Entity
    {
        public Case Case { get; set; } = null!; // requires configuration to explicitly define case to be dependent
        public required string Name { get; set; } // Naam opdrachtgever
        public required string EmployedAt { get; set; } // Opdrachtgever - werkzaam bij
        public required string Location { get; set; }  // Locatie
        [NotMapped]
        public CommissionDto Dto { get => CommissionMapper.MapToDto(this); }

        private Commission() { } // EF core needs this

        [SetsRequiredMembers]
        public Commission(CreateCommissionDto createDto)
        {
            Name = createDto.Name;
            EmployedAt = createDto.EmployedAt;
            Location = createDto.Location;
        }
    }
}
