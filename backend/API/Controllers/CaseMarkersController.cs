using Domain.Exceptions;
using Domain.Records.DTOs;
using Logic.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
public class CaseMarkersController : ControllerBase
{
    private readonly IMarkersService _markersService;

    public CaseMarkersController(IMarkersService markersService)
    {
        _markersService = markersService;
    }

    [HttpGet]
    [Route("api/markers/icons")]
    public async Task<IActionResult> GetMarkerIcons(CancellationToken ct)
    {
        try
        {
            var markerIcons = await _markersService.GetMarkerIconsAsync(ct);
            if (markerIcons.Count < 1)
            {
                return NoContent();
            }
            return Ok(markerIcons);
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    [Route("api/cases/{caseId:guid}/markers")]
    public async Task<IActionResult> UploadMarker([FromForm] CreateMarkerDto createDto, Guid caseId, CancellationToken ct)
    {
        try
        {
            var newMarker = await _markersService.UploadMarkerAsync(createDto, caseId, ct);
            return Ok(newMarker);
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPatch]
    [Route("api/cases/{caseId:guid}/markers/{markerId:guid}")]
    public async Task<IActionResult> UpdateMarker([FromForm] PatchMarkerDto patchDto, Guid caseId, Guid markerId, CancellationToken ct)
    {
        try
        {
            var updatedMarker = await _markersService.UpdateMarkerAsync(patchDto, caseId, markerId, ct);
            return Ok(updatedMarker);
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet]
    [Route("api/cases/{caseId:guid}/markers")]
    public async Task<IActionResult> GetMarkers(Guid caseId, CancellationToken ct)
    {
        try
        {
            var markers = await _markersService.GetMarkersAsync(caseId, ct);
            if (markers.Count < 1)
            {
                return NoContent();
            }
            return Ok(markers);
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet]
    [Route("api/cases/{caseId:guid}/markers/{markerId:guid}")]
    public async Task<IActionResult> GetMarker(Guid caseId, Guid markerId, CancellationToken ct)
    {
        try
        {
            var marker = await _markersService.GetMarkerByIdAsync(caseId,markerId, ct);
            return Ok(marker);
        }
        catch (DomainException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}