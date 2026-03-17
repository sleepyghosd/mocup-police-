using Domain.Records.DTOs;
using Domain.Records.Mapping;

namespace Domain.Records.Entities
{
    public class MarkerIcon : Entity
    {
        public required string Name { get; set; }
        public string? Code { get; set; }
        public InvolvedEntityType? AssociatedEntityType { get; set; }
        public required AssetFile Icon { get; set; }

        public MarkerIconDto Dto(AssetFileDto assetFileDto)
        {
            return MarkerIconMapper.MapToDto(this, assetFileDto);
        }
    }
}
