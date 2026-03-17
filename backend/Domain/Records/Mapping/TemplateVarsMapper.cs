using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public static class TemplateVarsMapper
    {
        public static TemplateVarDto MapToDto(TemplateVar entity)
        {
            return new TemplateVarDto
            {
                Id = entity.Id,
                Name = entity.Name,
                PayloadJson =  entity.PayloadJson,
            };
        }
    }
};

