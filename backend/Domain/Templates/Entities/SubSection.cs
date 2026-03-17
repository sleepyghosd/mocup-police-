using Domain.Templates.Interfaces;
using System.Text.Json.Serialization;

namespace Domain.Templates.Entities
{
    public class SubSection : INode
    {
        public required string Header { get; set; }
        public string Content { get; set; } = string.Empty;
        [JsonIgnore]
        public NodeType NodeType { get; set; } = NodeType.Subsection;
        [JsonIgnore]
        public IEnumerable<INode> Children => Enumerable.Empty<INode>(); // SubSection has no child nodes for now
    }
}
