using Domain.Records.DTOs;
using Domain.Records.Entities;

namespace Domain.Records.Mapping
{
    public class MarkerMapper
    {
        public static MarkerDto MapToDto(Marker marker, MarkerIconDto markerIconDto)
        {
            return new MarkerDto
            {
                Id = marker.Id,
                CaseId = marker.CaseId,
                Title = marker.Title,
                Code = marker.Code,
                Description = marker.Description,
                NorthRd = marker.NorthRd,
                EastRd = marker.EastRd,
                HeightRd = marker.HeightRd,
                Icon = markerIconDto
            };
        }
    }
}
