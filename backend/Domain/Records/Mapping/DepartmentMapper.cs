using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class DepartmentMapper
    {
        public static DepartmentDto MapToDto(Department department)
        {
            return new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name,
                Unit = department.Unit,
                Service = department.Service
            };
        }
    }
}
