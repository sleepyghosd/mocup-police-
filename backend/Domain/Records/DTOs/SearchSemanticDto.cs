namespace Domain.Records.DTOs;

public class SearchSemanticDto
{
    
    public string text { get; set; }
    public string casus { get; set; }
    
    public SearchSemanticDto(string text, string casus)
    {
        this.text = text;
        this.casus = casus;
    }
}