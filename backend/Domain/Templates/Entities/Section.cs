using Domain.Templates.Interfaces;
using System.Text.Json.Serialization;

namespace Domain.Templates.Entities;

public class Section : INode
{
    public List<SubSection>? SubSections { get; set; }
    public required string Header { get; set; }
    public string Content { get; set; } = string.Empty;

    [JsonIgnore] public NodeType NodeType { get; set; } = NodeType.Section;

    [JsonIgnore]
    public IEnumerable<INode> Children
    {
        get
        {
            if (SubSections != null)
                foreach (SubSection ss in SubSections)
                    yield return ss;
        }
    }

    public void Add(SubSection subSection)
    {
        SubSections ??= new List<SubSection>();
        SubSections.Add(subSection);
    }
}