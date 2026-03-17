using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class CaseMapper
    {
        public static CaseDto MapToDto(Case entity)
        {
            return new CaseDto
            {
                Id = entity.Id,
                CaseNumber = entity.CaseNumber,
                IncidentDateTime = entity.IncidentDateTime,
                Location = entity.Location.Dto,
                Commission = entity.Commission.Dto,
                Department = entity.Department.Dto,
                Officers = entity.Officers.Select(co => co.Dto).ToList()
            };
        }
    }
}
