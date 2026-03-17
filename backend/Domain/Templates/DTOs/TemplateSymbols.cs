using Domain.Templates.Symbols;

namespace Domain.Templates.DTOs
{
    public class TemplateSymbols
    {
        public List<ValidatedSymbol<InputSymbol>> Inputs { get; } = new();
        public List<ValidatedSymbol<VariableSymbol>> Variables { get; } = new();
        public List<ValidatedSymbol<UsageSymbol>> Usages { get; } = new();

        public void Add(InputSymbol input) => Inputs.Add(new ValidatedSymbol<InputSymbol>(input));
        public void Add(ValidatedSymbol<InputSymbol> input) => Inputs.Add(input);
        public void Add(VariableSymbol variable) => Variables.Add(new ValidatedSymbol<VariableSymbol>(variable));
        public void Add(ValidatedSymbol<VariableSymbol> variable) => Variables.Add(variable);
        public void Add(UsageSymbol usage) => Usages.Add(new ValidatedSymbol<UsageSymbol>(usage));
        public void Add(ValidatedSymbol<UsageSymbol> usage) => Usages.Add(usage);
    }
}
