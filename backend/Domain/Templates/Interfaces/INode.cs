using System.Text.Json.Serialization;

namespace Domain.Templates.Interfaces
{
    public interface INode
    {
        string Header { get; set; }
        string Content { get; set; }
        NodeType NodeType { get; set; }
        [JsonIgnore]
        IEnumerable<INode> Children { get; }
    }

    public enum NodeType
    {
        Chapter,
        Section,
        Subsection
    }
}
