using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class OfficerMapper
    {
        public static OfficerDto MapToDto(Officer officer)
        {
            return new OfficerDto
            {
                Id = officer.Id,
                FirstName = officer.FirstName,
                LastName = officer.LastName,
                Department = officer.Department.Dto,
                Team = officer.Team,
                Position = 0 // Position is only relevant in CaseOfficer context
            };
        }
    }
}

