using Domain.Exceptions;
using Domain.Records.DTOs;
using Domain.Records.Mapping;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace Domain.Records.Entities
{
    public class Case : Entity
    {
        public required string CaseNumber { get; set; } // dossiernummer
        // Parketnummer was left out; unsure what this is used for
        public required DateTime IncidentDateTime { get; set; } // datum en tijd

        public Guid LocationId { get; set; }
        public required Location Location {  get; set; } // straatnaam, plaatsnaam en gemeente

        public Guid CommissionId { get; set; }
        public required Commission Commission { get; set; } // opdrachtgever

        public Guid DepartmentId { get; set; }
        public required Department Department { get; set; } // afdeling verantwoordelijk voor uitvoeren onderzoek


        private readonly List<CaseOfficer> _officers = new();
        public IReadOnlyList<CaseOfficer> Officers => _officers.OrderBy(o => o.Position).ToList(); // verbalisanten met expliciete volgorde (1ste verbalisant .. nth verbalisant)

        private Case() { } // EF Core needs this

        [SetsRequiredMembers]
        public Case(CreateCaseDto createDto, Location location, Commission commission, Department department, IEnumerable<Officer> officers)
        {
            CaseNumber = createDto.CaseNumber;
            IncidentDateTime = createDto.IncidentDateTime;
            Location = location;
            Commission = commission;
            Department = department;

            if (officers == null || !officers.Any())
                throw new DomainException("A case must have at least one assigned officer.");

            // Initialize _officers as CaseOfficer entities with positions 1..N
            int position = 1;
            foreach (var officer in officers)
            {
                _officers.Add(new CaseOfficer
                {
                    CaseId = Id,
                    Case = this,
                    Officer = officer,
                    OfficerId = officer.Id,
                    Position = position++
                });
            }
        }

        [NotMapped]
        public CaseDto Dto { get => CaseMapper.MapToDto(this); } 

        // Domain rule: must always have >= 1 officer
        public void AddOfficer(Officer officer)
        {
            if (_officers.Any(o => o.OfficerId == officer.Id))
                throw new ArgumentException("Officer already assigned.");

            int position = _officers.Count == 0 ? 1 : _officers.Max(o => o.Position) + 1;

            _officers.Add(new CaseOfficer
            {
                CaseId = Id,
                Case = this,
                Officer = officer,
                OfficerId = officer.Id,
                Position = position
            });
        }

        public void RemoveOfficer(Officer officer)
        {
            if (_officers.Count == 1)
                throw new DomainException("A case must have at least one assigned officer.");

            var officerId = officer?.Id;
            var entry = _officers.SingleOrDefault(o => o.OfficerId == officerId);
            if (entry == null)
                throw new ArgumentException("Officer not assigned.");

            int removedPosition = entry.Position;

            _officers.Remove(entry);

            // Re-index positions (no gaps)
            foreach (var o in _officers.Where(o => o.Position > removedPosition))
            {
                o.Position--;
            }
        }
    }
}
