using System.Text.Json.Serialization;

namespace Domain.Records.DTOs;

public class SemanticSearchDto
{
    [JsonPropertyName("img")]
    public string? Img { get; set; }
    
    [JsonPropertyName("path")]
    public string? Path { get; set; }
    
    [JsonPropertyName("hash")]
    public string? Hash { get; set; }
    
    [JsonPropertyName("casus")]
    public string? Casus { get; set; }

    public SemanticSearchDto(string img, string path, string hash, string casus)
    {
        Img = img;
        Path = path;
        Hash = hash;
        Casus = casus;
    }

    public SemanticSearchDto()
    {
    }
}