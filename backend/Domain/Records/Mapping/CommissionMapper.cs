using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class CommissionMapper
    {
        public static CommissionDto MapToDto(Commission commission)
        {
            return new CommissionDto
            {
                Id = commission.Id,
                Name = commission.Name,
                EmployedAt = commission.EmployedAt,
                Location = commission.Location,
            };
        }
    }
}
