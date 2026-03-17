using Domain.Templates.Interfaces;
using System.Text.Json.Serialization;

namespace Domain.Templates.Entities;

public class Chapter : INode
{
    public List<Section>? Sections { get; set; }
    public List<SubSection>? SubSections { get; set; } // semi-standalone subsections, result in c.0.n when enumerated, this is accepted in the domain!

    public required string Header { get; set; }
    public string Content { get; set; } = string.Empty;

    [JsonIgnore] public NodeType NodeType { get; set; } = NodeType.Chapter;

    [JsonIgnore]
    public IEnumerable<INode> Children
    {
        get
        {
            if (SubSections != null)
                foreach (SubSection ss in SubSections) yield return ss; // semi-standalone subsection can only exist before section, so return first
            if (Sections != null)
                foreach (Section s in Sections) yield return s;
        }
    }

    public void Add(Section section)
    {
        Sections ??= new List<Section>();
        Sections.Add(section);
    }

    public void Add(SubSection subsection)
    {
        SubSections ??= new List<SubSection>();
        SubSections.Add(subsection);
    }
}