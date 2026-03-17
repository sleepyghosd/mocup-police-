using DAL.Context;
using Domain.Records.Entities;
using Domain.Records.Seeder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DAL.Seeder;
public record MarkerIconSeed(
    string Name,
    string FileName,
    string? Code = null
);

public class AssetDatabaseSeeder : IAssetSeeder
{

    private readonly IServiceProvider _services;
    private const string assetDir = "/upload/assets";

    private static readonly MarkerIconSeed[] MarkerIcons =
    {
        new("Bestelauto", "BA.svg", "BA"),
        new("Boom", "BM.svg", "BM"),
        new("Bromfiets", "BRF.svg", "BRF"),
        new("VRI Detectiepunt", "DP.svg", "DP"),
        new("Fiets", "F.svg", "F"),
        new("Lantaarnpaal", "LP.svg", "LP"),
        new("Treinstel", "MAT.svg", "MAT"),
        new("Motorfiets", "MF.svg", "MF"),
        new("Anders", "Other.svg"),
        new("Personenauto", "PA.svg", "PA"),
        new("Slachtoffer", "SO.svg", "SO"),
        new("Tractor", "TRAC.svg", "TRAC"),
        new("Vrachtauto", "VA.svg", "VA"),
    };

    public AssetDatabaseSeeder(IServiceProvider services)
    {
        _services = services;
    }

    private static void AddIcon(AppDbContext db, MarkerIconSeed seed)
    {
        var cdnPath = $"{assetDir}/{seed.FileName}";
        var assetFile = new AssetFile { CdnPath = cdnPath };
        var markerIcon = new MarkerIcon { Name = seed.Name, Code = seed.Code, Icon = assetFile };
        db.AssetFiles.Add(assetFile);
        db.MarkerIcons.Add(markerIcon);
    }
    public async Task SeedAsync()
    {
        using var scope = _services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // Guard: only seed once
        if (await db.MarkerIcons.AnyAsync())
        {
            Console.WriteLine("Database already filled with assets");
            return;
        }

        foreach (var seed in MarkerIcons)
        {
            AddIcon(db, seed);
        }

        await db.SaveChangesAsync();

        Console.WriteLine("Successfully linked assets in database");
    }
}
