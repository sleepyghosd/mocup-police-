using Domain.Exceptions;
using Domain.Records.DTOs;
using Domain.Templates.DTOs;
using Logic.Interfaces;
using Logic.Services;
using Microsoft.AspNetCore.Mvc;
using Path = System.IO.Path;

namespace API.Controllers;

[ApiController]
public class TemplatesController : ControllerBase
{
    private readonly ITemplateHtmlService _templateHtmlService;
    private readonly ITemplatesService _templatesService;

    public TemplatesController(ITemplateHtmlService templateHtmlService, ITemplatesService templatesService)
    {
        _templateHtmlService = templateHtmlService;
        _templatesService = templatesService;
    }

    [HttpGet]
    [Route("api/cases/{caseId}/variables")]
    public async Task<IActionResult> GetAllCaseVars(Guid caseId, CancellationToken ct)
    {
        List<TemplateVarDto> templates = await _templateHtmlService.GetAllTemplateVarsByCaseIdAsync(caseId, ct);
        if (!templates.Any()) return NoContent();
        return Ok(templates);
    }
    
    [HttpGet]
    [Route("api/cases/variables/{variableId}")]
    public async Task<IActionResult> GetCaseVarsById(Guid variableId, CancellationToken ct)
    {
        TemplateVarDto? templateVar = await _templateHtmlService.GetTemplateVarByIdAsync(variableId, ct);
        if (templateVar is null) return NotFound();
        return Ok(templateVar);
    }
    
    [HttpPatch]
    [Route("api/cases/variables/{variableId}")]
    public async Task<IActionResult> PatchTemplateVars([FromBody] PatchTemplateVarDto patchDto, Guid variableId, CancellationToken ct)
    {
        TemplateVarDto? templateVar = await _templateHtmlService.UpdateTemplateVarByIdAsync(patchDto, variableId, ct);
        
        if (templateVar is null) return NotFound();
        
        return Ok(templateVar);
    }
    
    [HttpPost]
    [Route("api/cases/{caseId}/variables")]
    public async Task<IActionResult> CreateTemplateVars([FromBody] CreateTemplateVarDto createDto, Guid caseId, CancellationToken ct)
    {
        TemplateVarDto templateVar = await _templateHtmlService.CreateTemplateVarAsync(createDto, caseId, ct);
        return Created($"api/cases/variables/{templateVar.Id}", templateVar);
    }
    
    
    [HttpGet]
    [Route("api/departments/{departmentId}/templates")]
    public async Task<IActionResult> GetAllTemplates(Guid departmentId, CancellationToken ct)
    {
        List<TemplateDto> templates = await _templateHtmlService.GetAllTemplatesByDepartmentIdAsync(departmentId, ct);
        if (!templates.Any()) return NoContent();
        return Ok(templates);
    }

    [HttpGet]
    [Route("api/templates/{templateId}")]
    public async Task<IActionResult> GetTemplateById(Guid templateId, CancellationToken ct)
    {
        TemplateDto? template = await _templateHtmlService.GetTemplateByIdAsync(templateId, ct);
        if (template is null) return NotFound();
        return Ok(template);
    }

    [HttpPost]
    [Route("api/departments/{departmentId}/templates")]
    public async Task<IActionResult> CreateTemplate([FromBody] CreateTemplateDto createDto, Guid departmentId)
    {
        try
        {
            TemplateDto templateDto = await _templateHtmlService.CreateTemplateAsync(createDto, departmentId);
            return Created($"/api/templates/{templateDto.Id}", templateDto);
        }
        catch (DomainException e)
        {
            return BadRequest(e.Message);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }


    [HttpGet]
    [Route("api/templates/{templateId}/html")]
    public IActionResult GetHtml(Guid templateId)
    {
        string template = Path.Combine(AppContext.BaseDirectory, "Templates", "test_template.md");
        string md = System.IO.File.ReadAllText(template);

        TemplateResult templateResult = _templatesService.CreateAndValidateTemplate(md);
        HtmlReturn html = _templateHtmlService.ParseHtml(templateResult);

        if (html.Html.Length <= 0) return BadRequest();

        return Ok(html);
    }
}