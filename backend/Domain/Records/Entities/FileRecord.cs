using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class FileRecord : Entity
    {
        public required Guid CaseId { get; set; }
        public required string CdnPath { get; set; }
        public bool IsFavorite { get; set; }
        public long Size { get; set; } // bytes
        public required string Hash { get; set; }
        public Image? Image { get; set; }
        public IEnumerable<InvolvedEntity> AssociatedEntities { get; set; } = Enumerable.Empty<InvolvedEntity>();
        public IEnumerable<Marker> AssociatedMarkers { get; set; } = Enumerable.Empty<Marker>();

        private FileRecord() { } // EF needs this

        [SetsRequiredMembers]
        public FileRecord(CreateFileRecordDto createDto, Case caseEntity, string cdnPath, long size, string hash)
        {
            CaseId = caseEntity.Id;
            CdnPath = cdnPath;
            IsFavorite = createDto.IsFavorite;
            Size = size;
            Hash = hash;
        }

        public FileRecordDto Dto(string cdnUrl)
        {
            return FileRecordMapper.MapToDto(this, cdnUrl);
        }

        public SemanticSearchDto ToSemanticSearchDto(string cdnUrl)
        {
            return FileRecordMapper.MapToSemanticSearchDto(this, cdnUrl);
        }
    }
}