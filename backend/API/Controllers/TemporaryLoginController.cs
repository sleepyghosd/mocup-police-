using Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/temp/login")]
public class TemporaryLoginController : ControllerBase
{
    private readonly IDepartmentsService _departmentsService;

    public TemporaryLoginController(IDepartmentsService departmentsService)
    {
        _departmentsService = departmentsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLogin(CancellationToken ct)
    {
        try
        {
            var departmentDto = (await _departmentsService.GetAllDepartmentsAsync(ct)).FirstOrDefault();
            if (departmentDto == null)
                return NotFound($"No department found");
            var officerDto = await _departmentsService.GetAllOfficersByDepartmentIdAsync(departmentDto.Id, ct);
            if (officerDto == null)
                return NotFound($"No officer found");

            return Ok(new 
            {
                Department = departmentDto,
                Officer = officerDto
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while fetching the case: {ex.Message}");
        }
    }
}

