using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class AssetFileMapper
    {
        public static AssetFileDto MapToDto(AssetFile assetFile, string cdnUrl)
        {
            return new AssetFileDto
            {
                Id = assetFile.Id,
                CdnUrl = cdnUrl,
            };
        }
    }
}
