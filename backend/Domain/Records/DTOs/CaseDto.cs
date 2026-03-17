namespace Domain.Records.DTOs
{
    public class CaseDto
    {
        public required Guid Id { get; set; }
        public required string CaseNumber { get; set; }
        public required DateTime IncidentDateTime { get; set; }

        public required LocationDto Location { get; set; }
        public required CommissionDto Commission { get; set; }

        public required DepartmentDto Department { get; set; }
        public required List<OfficerDto> Officers { get; set; }
    }

    public class CreateCaseDto
    {
        public required string CaseNumber { get; set; }
        public required DateTime IncidentDateTime { get; set; }
        public required CreateLocationDto Location { get; set; }
        public required CreateCommissionDto Commission { get; set; }

        public required Guid DepartmentId { get; set; }
        public required List<Guid> OfficerIds { get; set; }
    }
}
