using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class FileRecordMapper
    {
        public static FileRecordDto MapToDto(FileRecord fileRecord, string cdnUrl)
        {
            return new FileRecordDto
            {
                Id = fileRecord.Id,
                CaseId = fileRecord.CaseId,
                CdnUrl = cdnUrl,
                IsFavorite = fileRecord.IsFavorite,
                Size = fileRecord.Size,
                Hash = fileRecord.Hash
            };
        }

        public static SemanticSearchDto MapToSemanticSearchDto(FileRecord fileRecord, string cdnUrl)
        {
            return new SemanticSearchDto
            {
                Img = cdnUrl,
                Casus = fileRecord.CaseId.ToString(),
                Hash = fileRecord.Hash,
                Path = fileRecord.CdnPath
            };
        }
    }
}
