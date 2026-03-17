using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class MarkerIconMapper
    {
        public static MarkerIconDto MapToDto(MarkerIcon markerIcon, AssetFileDto assetFileDto)
        {
            return new MarkerIconDto
            {
                Id = markerIcon.Id,
                Name = markerIcon.Name,
                Code = markerIcon.Code,
                Icon = assetFileDto
            };
        }
    }
}
