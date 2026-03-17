using Domain.Exceptions;
using Domain.Records.DTOs;
using Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/cases")]
public class CasesController : ControllerBase
{
    private readonly ICasesService _casesService;

    public CasesController(ICasesService casesService)
    {
        _casesService = casesService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        try
        {
            var cases = await _casesService.GetAllAsync(ct);
            if (!cases.Any())
                return NoContent();
            return Ok(cases);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while fetching cases: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        try
        {
            var caseDto = await _casesService.GetByIdAsync(id, ct);
            if (caseDto == null)
                return NotFound($"Case with ID {id} not found");
            return Ok(caseDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while fetching the case: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCaseDto createDto)
    {
        try
        {
            var caseDto = await _casesService.CreateAsync(createDto);
            return Created($"/api/cases/{caseDto.Id}", caseDto);
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while creating the case: {ex.Message}");
        }
    }

    [HttpPost("export")]
    public async Task<IActionResult> Export([FromBody] HtmlDataRequest htmlData)
    {
        string outPath = Path.Combine(AppContext.BaseDirectory, "Templates", "output.docx");

        try
        {
            bool result = await _casesService.Export(htmlData.HtmlData);
            if (!result) throw new Exception("Error while exporting");

            byte[] resFile = await System.IO.File.ReadAllBytesAsync(outPath);

            return File(
                resFile,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "output.docx" // just a simple filename
            );
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
        finally
        {
            System.IO.File.Delete(outPath);
        }
    }
}

public class HtmlDataRequest
{
    public string HtmlData { get; set; }
}