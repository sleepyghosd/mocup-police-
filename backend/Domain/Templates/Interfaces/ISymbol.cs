namespace Domain.Templates.Symbols;

public interface ISymbol
{
    string Path { get; set; }
    string RawText { get; set; }
    string Html { get; }
}