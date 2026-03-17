using DAL.Context;
using Domain.Records.DTOs;
using Domain.Records.Entities;
using Domain.Records.Seeder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public class DemoDatabaseSeeder : IDemoSeeder
{

    private readonly IServiceProvider _services;

    public DemoDatabaseSeeder(IServiceProvider services)
    {
        _services = services;
    }
    public async Task SeedAsync()
    {
        using var scope = _services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // Guard: only seed once
        if (await db.Departments.AnyAsync())
        {
            Console.WriteLine("Database already seeded");
            return;
        }

        // Seed logic here
        var department = new Department(
            new CreateDepartmentDto
            {
                Name = "Test Afdeling",
                Unit = "Eenheid A",
                Service = "Dienst X"
            }
        );

        var officer = new Officer(
            new CreateOfficerDto
            {
                FirstName = "Test",
                LastName = "Officier",
                Team = "Team A",
            },
            department
        );

        var createLocationDto = new CreateLocationDto
        {
            Street = "Achtseweg Zuid 151 C",
            City = "Eindhoven",
            Municipality = "Eindhoven"
        };

        var createCommissionDto = new CreateCommissionDto
        {
            Name = "Officier X",
            EmployedAt = "Recherche",
            Location = "Den Haag"
        };

        var createCaseDto = new CreateCaseDto
        {
            CaseNumber = "CASE-123",
            IncidentDateTime = DateTime.Now,
            DepartmentId = department.Id,
            OfficerIds = new List<Guid> { officer.Id },
            Location = createLocationDto,
            Commission = createCommissionDto
        };

        var location = new Location(
            createLocationDto
        );

        var commission = new Commission(
            createCommissionDto
        );

        var caseEntity = new Case(
            createCaseDto,
            location,
            commission,
            department,
            new List<Officer> { officer }
        );

        db.Locations.Add(location);
        db.Commissions.Add(commission);
        db.Departments.Add(department);
        db.Officers.Add(officer);
        db.Cases.Add(caseEntity);

        await db.SaveChangesAsync();

        Console.WriteLine("Successfully seeded database");
    }
}
