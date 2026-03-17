using Domain.Records.DTOs;
using Domain.Records.Mapping;

namespace Domain.Records.Entities
{
    public class AssetFile : Entity
    {
        public required string CdnPath { get; set; }
        public AssetFileDto Dto(string cdnUrl)
        {
            return AssetFileMapper.MapToDto(this, cdnUrl);
        }
    }
}
