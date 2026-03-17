namespace Domain.Templates.DTOs
{
    public class ValidatedSymbol<TSymbol>
    {
        public TSymbol Symbol { get; }
        public List<ValidationIssue> Issues { get; } = new List<ValidationIssue>();

        public bool HasIssues => Issues.Any();

        public ValidatedSymbol(TSymbol symbol)
        {
            Symbol = symbol;
        }

        public void AddIssue(ValidationIssue issue)
        {
            Issues.Add(issue);
        }
    }
}
