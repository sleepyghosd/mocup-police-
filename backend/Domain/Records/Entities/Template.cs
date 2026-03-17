using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class Template : Entity
    {
        public Guid DepartmentId { get; set; }
        public required Department Department { get; set; }
        public required string Name { get; set; }
        public required string PayloadJson { get; set; }
        [NotMapped]
        public TemplateDto Dto { get => TemplatesMapper.MapToDto(this); }
        private Template() { } //EF core needs this
        [SetsRequiredMembers]
        public Template(CreateTemplateDto createDto, Department department)
        {
            Department = department;
            Name = createDto.Name;
            PayloadJson = createDto.PayloadJson;
        }
    }
}
