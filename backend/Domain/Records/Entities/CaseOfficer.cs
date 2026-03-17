using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Records.Entities
{
    public class CaseOfficer : Entity
    {
        public required Guid CaseId { get; set; }
        public required Case Case { get; set; }

        public required Guid OfficerId { get; set; }
        public required Officer Officer { get; set; }

        // Explicit order in the domain
        public required int Position { get; set; }
        [NotMapped]
        public OfficerDto Dto { get => CaseOfficerMapper.MapToDto(this); }
    }
}
