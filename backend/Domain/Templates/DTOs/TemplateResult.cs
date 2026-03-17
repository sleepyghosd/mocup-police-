using Domain.Templates.Entities;
using Domain.Templates.Symbols;
using System.Text.Json.Serialization;

namespace Domain.Templates.DTOs
{
    public class TemplateResult
    {
        /// <summary>
        /// The parsed Template entity.
        /// </summary>
        public Template Template { get; set; }

        /// <summary>
        /// Collected symbols from the template, might contain symbols with validation errors.
        /// </summary>
        [JsonIgnore]
        public TemplateSymbols Symbols { get; set; } = new TemplateSymbols();

        /// <summary>
        /// List of validation issues found in the template.
        /// </summary>
        public List<ValidationIssue> Issues =>
                Symbols.Inputs
                    .SelectMany(s => s.Issues)
                    .Concat(Symbols.Variables.SelectMany(s => s.Issues))
                    .Concat(Symbols.Usages.SelectMany(s => s.Issues))
                    // .Concat(Issues) // include any top-level issues already in the list TODO: implement top-level issues
                    .ToList();

        /// <summary>
        /// True if no errors were found.
        /// </summary>
        public bool IsValid => !Issues.Any(e => e.Severity == ValidationSeverity.Error);

        public TemplateResult(Template template)
        {
            Template = template;
        }

        public IReadOnlyList<InputSymbol> ValidInputs =>
            Symbols.Inputs
                .Where(s => !s.HasIssues || s.Issues.All(e => e.Severity != ValidationSeverity.Error))
                .Select(s => s.Symbol)
                .ToList();

        public IReadOnlyList<VariableSymbol> ValidVariables =>
            Symbols.Variables
                .Where(s => !s.HasIssues || s.Issues.All(e => e.Severity != ValidationSeverity.Error))
                .Select(s => s.Symbol)
                .ToList();

        public IReadOnlyList<UsageSymbol> ValidUsages =>
            Symbols.Usages
                .Where(s => !s.HasIssues || s.Issues.All(e => e.Severity != ValidationSeverity.Error))
                .Select(s => s.Symbol)
                .ToList();
    }
}
