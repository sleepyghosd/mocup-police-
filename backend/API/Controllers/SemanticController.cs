using Domain.Records.DTOs;
using Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/cases/{caseId}/Semantic")]
public class SemanticController : ControllerBase
{
    private readonly IFilesService _filesService;

    public SemanticController(IFilesService filesService)
    {
        _filesService = filesService;
    }

    [HttpPost]
    [Route("Search")]
    public async Task<IActionResult> Search([FromBody] SearchSemanticDto body)
    {
        var response = await _filesService.QuerySemanticSearch(body);
        if (null != response)
        {
            return Ok(response);
        }

        return NoContent();
    }
}