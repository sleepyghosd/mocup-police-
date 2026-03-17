using Domain.Templates.Interfaces;
using System.Text.Json.Serialization;

namespace Domain.Templates.Entities
{
    public class Template
    {
        public List<Chapter>? Chapters { get; private set; } = null;
        public List<Section>? Sections { get; private set; } = null; // standalone sections, result in 0.n when enumerated, this is accepted in the domain!
        public List<SubSection>? SubSections { get; private set; } = null; // standalone subsections, result in 0.0.n when enumerated, this is accepted in the domain!
        [JsonIgnore]
        public IEnumerable<INode> Children
        {
            get
            {
                if (SubSections != null)
                    foreach (var ss in SubSections) yield return ss; // standalone subsection can only exist before chapter or section, so return first
                if (Sections != null)
                    foreach (var s in Sections) yield return s; // standalone section can only exist before chapter, so return second
                if (Chapters != null)
                    foreach (var c in Chapters) yield return c;
            }
        }

        public void Add(Chapter chapter)
        {
            Chapters ??= new List<Chapter>();
            Chapters.Add(chapter);
        }

        public void Add(Section section, Chapter? chapter)
        {
            if (chapter != null)
            {
                chapter.Add(section);
            }
            else
            {
                Sections ??= new List<Section>();
                Sections.Add(section);
            }
        }

        public void Add(SubSection subSection, Section? section, Chapter? chapter)
        {
            if (section != null)
            {
                section.Add(subSection);
            }
            else if (chapter != null)
            {
                chapter.Add(subSection);
            }
            else
            {
                SubSections ??= new List<SubSection>();
                SubSections.Add(subSection);
            }   
        }
    }
}
