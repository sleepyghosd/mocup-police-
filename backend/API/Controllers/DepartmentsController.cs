using Domain.Exceptions;
using Domain.Records.DTOs;
using Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/departments")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentsService _departmentsService;

    public DepartmentsController(IDepartmentsService departmentsService)
    {
        _departmentsService = departmentsService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDepartmentById(Guid id, CancellationToken ct)
    {
        try
        {
            var departmentDto = await _departmentsService.GetDepartmentByIdAsync(id, ct);
            if (departmentDto == null)
                return NotFound($"Case with ID {id} not found");
            return Ok(departmentDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while fetching the case: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDepartments(CancellationToken ct)
    {
        try
        {
            var departments = await _departmentsService.GetAllDepartmentsAsync(ct);
            if (!departments.Any())
                return NoContent();
            return Ok(departments);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while fetching cases: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDto createDto)
    {
        try
        {
            var departmentDto = await _departmentsService.CreateDepartmentAsync(createDto);
            return Created($"/api/departments/{departmentDto.Id}", departmentDto);
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while creating the department: {ex.Message}");
        }
    }

    [HttpGet("officers/{id}")]
    public async Task<IActionResult> GetOfficerById(Guid id, CancellationToken ct)
    {
        try
        {
            var officerDto = await _departmentsService.GetOfficerByIdAsync(id, ct);
            if (officerDto == null)
                return NotFound($"Case with ID {id} not found");
            return Ok(officerDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while fetching the case: {ex.Message}");
        }
    }

    [HttpGet("{departmentId}/officers")]
    public async Task<IActionResult> GetAllOfficers(Guid departmentId, CancellationToken ct)
    {
        try
        {
            var officers = await _departmentsService.GetAllOfficersByDepartmentIdAsync(departmentId, ct);
            if (!officers.Any())
                return NoContent();
            return Ok(officers);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while fetching cases: {ex.Message}");
        }
    }

    [HttpPost("{departmentId}/officers")]
    public async Task<IActionResult> CreateOfficer(Guid departmentId, [FromBody] CreateOfficerDto createDto)
    {
        try
        {
            var officerDto = await _departmentsService.CreateOfficerAsync(createDto, departmentId);
            return Created($"/api/officers/{officerDto.Id}", officerDto);
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while creating the officer: {ex.Message}");
        }
    }
}

