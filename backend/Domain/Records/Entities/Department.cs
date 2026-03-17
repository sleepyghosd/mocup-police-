using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class Department : Entity
    {
        private readonly List<Template> _templates = new();
        public IReadOnlyCollection<Template> Templates => _templates;
        public required string Name { get; set; } // Afdeling
        public required string Unit { get; set; } // Eenheid
        public required string Service { get; set; }  // Dienst
        [NotMapped]
        public DepartmentDto Dto { get => DepartmentMapper.MapToDto(this); }
        public void AddTemplate(Template template)
        {
            _templates.Add(template);
        }

        private Department () { } // EF needs this

        [SetsRequiredMembers]
        public Department(CreateDepartmentDto createDto) 
        {
            Name = createDto.Name;
            Unit = createDto.Unit;
            Service = createDto.Service;
        }
    }
}
