using Logic.Interfaces;

namespace API.BackgroundWorkers;

public class EmbedBackgroundWorker : BackgroundService
{
    // private readonly IFilesService _filesService;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public EmbedBackgroundWorker(IServiceScopeFactory ScopeFactory)
    {
        _serviceScopeFactory = ScopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var fileService = scope.ServiceProvider.GetRequiredService<IFilesService>();
            
            await fileService.EmbedFilesAsync();
            
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }
}