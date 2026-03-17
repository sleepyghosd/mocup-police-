using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class Marker : Entity
    {
        public required Guid CaseId { get; set; }
        public required string Title { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public required decimal NorthRd { get; set; }
        public required decimal EastRd { get; set; }
        public decimal? HeightRd { get; set; }
        public required MarkerIcon Icon { get; set; }
        public IEnumerable<InvolvedEntity> AssociatedEntities { get; set; } = Enumerable.Empty<InvolvedEntity>();
        public IEnumerable<FileRecord> AssociatedFiles { get; set; } = Enumerable.Empty<FileRecord>();

        private Marker() { } // EF Core needs this

        [SetsRequiredMembers]
        public Marker(CreateMarkerDto createDto, Case caseEntity, MarkerIcon markerIcon)
        {
            CaseId = caseEntity.Id;
            Title = createDto.Title;
            Code = createDto.Code;
            Description = createDto.Description;
            NorthRd = createDto.NorthRd;
            EastRd = createDto.EastRd;
            HeightRd = createDto.HeightRd;
            Icon = markerIcon;
        }

        public MarkerDto Dto(MarkerIconDto markerIconDto)
        {
            return MarkerMapper.MapToDto(this, markerIconDto);
        }
    }
}
