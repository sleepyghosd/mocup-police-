using Domain.Templates.DTOs;
using Domain.Templates.Symbols;

namespace Domain.Templates.Issues
{
    public static class ValidationIssues
    {
        public static ValidationIssue UsageWithoutDefinition(UsageSymbol usage)
            => new ValidationIssue(
                location: usage.Path.ToString(),
                message: $"Usage '{usage.Identifier}' has no corresponding definition",
                value: usage.RawText,
                severity: ValidationSeverity.Error
            );

        public static ValidationIssue DuplicateDefinitionIssue(VariableSymbol variable)

            => new ValidationIssue(
                        location: variable.Path.ToString(),
                        message: $"Variable '{variable.Identifier}' is defined multiple times",
                        value: variable.RawText
            );

        public static ValidationIssue UnusedDefinitionIssue(VariableSymbol variable)
            => new ValidationIssue(
                location: variable.Path.ToString(),
                message: $"Variable '{variable.Identifier}' is not used, consider using an input",
                value: variable.RawText,
                severity: ValidationSeverity.Info
            );

        public static ValidationIssue InvalidInputSyntaxIssue(InputSymbol input)
            => new ValidationIssue(
                location: input.Path.ToString(),
                message: $"Invalid input symbol at '{input.Path.ToString()}': '{input.RawText}'. " +
                            "Expected syntax: {i{'request'}}, {i{'request'}?['suggestion1','suggestion2']}, " +
                            "or {i{'request'}['option1','option2']}. Please check for missing quotes, braces, or invalid characters.",
                value: input.RawText,
                severity: ValidationSeverity.Error
            );

        public static ValidationIssue InvalidVariableSyntaxIssue(VariableSymbol variable)
            => new ValidationIssue(
                location: variable.Path.ToString(),
                message: $"Invalid variable symbol at '{variable.Path.ToString()}': '{variable.RawText}'. " +
                            "Expected syntax examples:\n" +
                            "  {v{var_name}}\n" +
                            "  {v{var_name, 'request for definition'}}\n" +
                            "  {v{var_name}?['suggestion1','suggestion2']}\n" +
                            "  {v{var_name, 'request for definition'}?['suggestion1','suggestion2']}\n" +
                            "  {v{var_name}['option1','option2']}\n" +
                            "  {v{var_name, 'request for definition'}['option1','option2']}\n" +
                            "Check for missing quotes, braces, or invalid characters.",
                value: variable.RawText,
                severity: ValidationSeverity.Error
            );

        public static ValidationIssue InvalidUsageSyntaxIssue(UsageSymbol usage)
            => new ValidationIssue(
                location: usage.Path.ToString(),
                message: $"Invalid usage symbol at '{usage.Path.ToString()}': '{usage.RawText}'. " +
                            "Expected syntax: {{var_name}} (double curly braces enclosing a variable identifier). " +
                            "Check for missing braces or invalid characters.",
                value: usage.RawText,
                severity: ValidationSeverity.Error
            );
    }
}
