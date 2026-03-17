using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Domain.Records.Entities
{
    public enum InvolvedEntityType
    {
        [Display(Name = "Personenauto")]
        Car = 1,

        [Display(Name = "Bedrijfsvoertuig")]
        CommercialVehicle = 2,
        
        [Display(Name = "Bromfiets")]
        Scooter = 3,

        [Display(Name = "Fiets")]
        Bicycle = 4,

        [Display(Name = "Motorfiets")]
        Motorcycle = 5,

        [Display(Name = "Voetganger")]
        Pedestrian = 6
    }

    public abstract class InvolvedPayload { }

    public class CarPayload : InvolvedPayload
    {
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? LicensePlate { get; set; }
    }

    public class CommercialVehiclePayload : InvolvedPayload
    {
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? LicensePlate { get; set; }
    }

    public class ScooterPayload : InvolvedPayload
    {
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? LicensePlate { get; set; }
    }

    public class BicyclePayload : InvolvedPayload
    {
        public string? Brand { get; set; }
        public string? Color { get; set; }
    }

    public class MotorcyclePayload : InvolvedPayload
    {
        public string? Brand { get; set; }
        public string? Color { get; set; }
        public string? LicensePlate { get; set; }
    }
    public class PedestrianPayload : InvolvedPayload
    {
        public string? Gender { get; set; }
        public int? Age { get; set; }
        public int? BSN { get; set; }
    }


    public static class InvolvedPayloadConverter
    {
        private static readonly JsonSerializerOptions Options = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        private static readonly Dictionary<InvolvedEntityType, Type> PayloadTypeMap = new()
        {
            { InvolvedEntityType.Car, typeof(CarPayload) },
            { InvolvedEntityType.CommercialVehicle, typeof(CommercialVehiclePayload) },
            { InvolvedEntityType.Scooter, typeof(ScooterPayload) },
            { InvolvedEntityType.Bicycle, typeof(BicyclePayload) },
            { InvolvedEntityType.Motorcycle, typeof(MotorcyclePayload) },
            { InvolvedEntityType.Pedestrian, typeof(PedestrianPayload) }
        };

        public static string Serialize(InvolvedPayload payload)
            => JsonSerializer.Serialize(payload, payload.GetType(), Options);

        public static InvolvedPayload Deserialize(InvolvedEntityType type, string json)
        {
            if (!PayloadTypeMap.TryGetValue(type, out var payloadType))
                throw new NotSupportedException($"Unknown payload type: {type}");

            return (InvolvedPayload?)JsonSerializer.Deserialize(json, payloadType, Options)
                ?? throw new InvalidOperationException($"Failed to deserialize {type} payload.");
        }

    }

    public class InvolvedEntity : Entity
    {
        public required Case Case { get; set; }
        public required string Name { get; set; }
        public required InvolvedEntityType Type { get; set; }
        public string PayloadJson { get; set; } = string.Empty;
        public IEnumerable<Marker> AssociatedMarkers { get; set; } = Enumerable.Empty<Marker>();
        public IEnumerable<FileRecord> AssociatedFiles { get; set; } = Enumerable.Empty<FileRecord>();

        // Strongly typed payload (not mapped)
        [NotMapped]
        public InvolvedPayload Payload // TODO: consider caching payload to avoid deserializing frequently
        {
            get => string.IsNullOrEmpty(PayloadJson)
                ? InvolvedPayloadConverter.Deserialize(Type, "{}")
                : InvolvedPayloadConverter.Deserialize(Type, PayloadJson);

            set => PayloadJson = value == null
                ? string.Empty
                : InvolvedPayloadConverter.Serialize(value);
        }
    }
}
