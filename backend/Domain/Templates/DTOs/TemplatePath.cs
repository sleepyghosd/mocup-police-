using Domain.Templates.Interfaces;
using System.Collections.Immutable;

namespace Domain.Templates.DTOs
{
    public class TemplatePath
    {
        private readonly ImmutableArray<INode> _nodes;

        public TemplatePath(IEnumerable<INode> nodes)
        {
            _nodes = nodes.ToImmutableArray();
        }

        public TemplatePath Add(INode node) => new TemplatePath(_nodes.Add(node));

        public bool Contains(INode node) => _nodes.Contains(node);

        public override string ToString()
        {
            return string.Join(" ", _nodes.Select(n => $"{GetNodeTypeName(n)} '{n.Header}'"));
        }

        private static string GetNodeTypeName(INode node)
        {
            var typeName = node.NodeType.ToString();

            return char.ToUpper(typeName[0]) + typeName.Substring(1);
        }

        public ImmutableArray<INode> Nodes => _nodes;

        public static TemplatePath Empty => new TemplatePath(ImmutableArray<INode>.Empty);
    }
}
