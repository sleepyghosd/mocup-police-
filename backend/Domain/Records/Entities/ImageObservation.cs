using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Domain.Records.Entities
{
    public enum ImageObservationType
    {
        Blur = 1,
        Embedding = 2,
    }

    public abstract class ObservationPayload { }
    public interface IRequiresReview { } // payload marker interface

    public class BlurPayloadV1 : ObservationPayload, IRequiresReview
    {
        public float Score { get; set; } // 0-1
        public bool IsBlurry { get; set; }
    }

    public class EmbeddingPayloadV1 : ObservationPayload 
    {
        public bool HasEmbedding { get; set; }
    }

    public static class ObservationPayloadConverter
    {
        private static readonly JsonSerializerOptions Options = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        private static readonly Dictionary<(ImageObservationType type, string version), Type> PayloadTypeMap = new()
        {
            { (ImageObservationType.Blur, "v1"), typeof(BlurPayloadV1) },
            { (ImageObservationType.Embedding, "v1"), typeof(EmbeddingPayloadV1) }
        };

        public static string Serialize(ObservationPayload payload)
            => JsonSerializer.Serialize(payload, payload.GetType(), Options);

        public static ObservationPayload Deserialize(ImageObservationType type, string version, string json)
        {
            if (!PayloadTypeMap.TryGetValue((type, version), out var payloadType))
                throw new NotSupportedException($"Unknown payload type/version: {type}/{version}");

            return (ObservationPayload?)JsonSerializer.Deserialize(json, payloadType, Options)
                ?? throw new InvalidOperationException($"Failed to deserialize {type}/{version} payload.");
        }

    }

    public class ImageObservation : Entity
    {
        public required Image Image { get; set; }
        public required ImageObservationType Type {  get; set; }
        public required string Version { get; set; }
        public required string PayloadJson { get; set; }
        public bool HumanReviewed { get; private set; } = false;
        public bool? HumanApproved { get; private set; }

        // Strongly typed access
        [NotMapped]
        public ObservationPayload Payload // TODO: consider caching payload to avoid deserializing frequently
        {
            get => ObservationPayloadConverter.Deserialize(Type, Version, PayloadJson);
            private set => PayloadJson = ObservationPayloadConverter.Serialize(value);
        }

        // Mark that a human has reviewed this observation
        public void HumanReview(bool approved)
        {
            HumanReviewed = true;
            HumanApproved = approved;
        }
        public bool RequiresHumanReview() => Payload is IRequiresReview;
    }
}
