namespace Domain.Records.DTOs;

public class SemanticSearchResponseDto
{
    public List<string> Hashes { get; set; } = [];
    public int Count { get; set; }
}