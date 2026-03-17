using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class CaseOfficerMapper
    {
        public static OfficerDto MapToDto(CaseOfficer caseOfficer)
        {
            return new OfficerDto
            {
                Id = caseOfficer.OfficerId,
                FirstName = caseOfficer.Officer.FirstName,
                LastName = caseOfficer.Officer.LastName,
                Department = caseOfficer.Officer.Department.Dto,
                Team = caseOfficer.Officer.Team,
                Position = caseOfficer.Position
            };
        }
    }
}
