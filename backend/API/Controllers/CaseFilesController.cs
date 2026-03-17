using Domain.Records.DTOs;
using Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/cases/{caseId}/files")]
public class CaseFilesController : ControllerBase
{
    private readonly IFilesService _filesService;

    public CaseFilesController(IFilesService filesService)
    {
        _filesService = filesService;
    }

    [HttpPost]
    [RequestSizeLimit(10_000_000_000)]
    public async Task<IActionResult> UploadFile([FromForm] CreateFileRecordDto createDto, Guid caseId, CancellationToken ct)
    {
        try
        {
            var uploaded = await _filesService.UploadFileAsync(createDto, caseId, ct);
            if (!uploaded)
                return BadRequest();
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while uploading file: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetFiles([FromQuery] string? casePath, Guid caseId, CancellationToken ct)
    {
        var fileSystemItem = await _filesService.GetFilesAsync(caseId, casePath, ct);

        if (fileSystemItem == null)
            return NotFound("No files found");

        return Ok(fileSystemItem);
    }

    [HttpPatch("{fileId}/favorite")]
    public async Task<IActionResult> UpdateFavorite(Guid fileId, [FromBody] UpdateFavoriteDto updateDto, Guid caseId, CancellationToken ct)
    {
        if (updateDto == null)
        {
            return BadRequest("Request body is required");
        }

        try
        {
            var updated = await _filesService.UpdateFavoriteAsync(fileId, updateDto, caseId, ct);
            if (!updated)
                return BadRequest("Failed to update favorite status");

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while updating favorite status: {ex.Message}");
        }
    }
}