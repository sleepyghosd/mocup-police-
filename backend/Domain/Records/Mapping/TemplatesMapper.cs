using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public static class TemplatesMapper
    {
        public static TemplateDto MapToDto(Template entity)
        {
            return new TemplateDto
            {
                Id = entity.Id,
                Department =  entity.Department.Dto,
                Name = entity.Name,
                PayloadJson =  entity.PayloadJson,
            };
        }
    }
};

