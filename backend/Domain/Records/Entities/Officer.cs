using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class Officer : Entity
    {
        public User? User { get; set; } // requires configuration to explicitly define user to be dependent
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required Guid DepartmentId { get; set; }
        public required Department Department { get; set; } // Afdeling
        public required string Team { get; set; } // Team

        [NotMapped]
        public OfficerDto Dto { get => OfficerMapper.MapToDto(this); }

        private Officer() { } // EF core needs this

        [SetsRequiredMembers]
        public Officer(CreateOfficerDto createDto, Department department)
        {
            FirstName = createDto.FirstName;
            LastName = createDto.LastName;
            DepartmentId = department.Id;
            Department = department;
            Team = createDto.Team;
        }
    }
}
