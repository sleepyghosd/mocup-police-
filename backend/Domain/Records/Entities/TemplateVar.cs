using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class TemplateVar : Entity
    {
        public required Guid CaseId { get; set; }
        public Case Case { get; set; }
        public required string Name { get; set; }
        public required string PayloadJson { get; set; }
        public TemplateVarDto Dto { get => TemplateVarsMapper.MapToDto(this); }
        private TemplateVar() { } //EF core needs this
        
        [SetsRequiredMembers]
        public TemplateVar(CreateTemplateVarDto createDto, Case caseObj)
        {
            Case = caseObj;
            Name = createDto.Name;
            PayloadJson = createDto.PayloadJson;
        }
    }
}
