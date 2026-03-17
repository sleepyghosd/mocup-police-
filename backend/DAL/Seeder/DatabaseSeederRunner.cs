using Domain.Records.Seeder;

public class DatabaseSeederRunner
{
    private readonly IAssetSeeder _assetSeeder;
    private readonly IDemoSeeder _demoSeeder;

    public DatabaseSeederRunner(
        IAssetSeeder assetSeeder,
        IDemoSeeder demoSeeder)
    {
        _assetSeeder = assetSeeder;
        _demoSeeder = demoSeeder;
    }

    public async Task RunAsync(bool seedDemo)
    {
        Console.WriteLine("Seeding assets...");
        await _assetSeeder.SeedAsync();

        if (seedDemo)
        {
            Console.WriteLine("Seeding demo data...");
            await _demoSeeder.SeedAsync();
        }
    }
}