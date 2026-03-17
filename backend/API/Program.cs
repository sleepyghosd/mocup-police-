//using DAL.Repositories;

using API.BackgroundWorkers;
using DAL.Context;
using DAL.Repositories;
using DAL.Seeder;
using DAL.UOW;
using Domain.Records.Repositories;
using Domain.Records.Seeder;
using Domain.Records.UOWs;
using Logic.Interfaces;
using Logic.Services;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Read connection string from environment variable
            var connectionString = builder.Configuration["MYSQL_CONNECTIONSTRING"]
                                   ?? throw new InvalidOperationException("MYSQL_CONNECTIONSTRING is not set!");

            var seedDemo = bool.TryParse(builder.Configuration["SEED_DATABASE"], out var seed) && seed;
            var migrationName = Environment.GetEnvironmentVariable("MIGRATION_NAME");
            Console.WriteLine($"migration name: {migrationName}");
            // Add DbContext with MySQL
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            );

            builder.Services.AddControllers();

            // Add Repositories
            builder.Services.AddScoped<IUoWCaseRepository, CaseRepository>();
            builder.Services.AddScoped<IUoWLocationRepository, LocationRepository>();
            builder.Services.AddScoped<IUoWCommissionRepository, CommissionRepository>();
            builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
            builder.Services.AddScoped<IOfficerRepository, OfficerRepository>();
            builder.Services.AddScoped<ITemplatesRepository, TemplatesRepository>();
            builder.Services.AddScoped<ITemplateVarsRepository, TemplateVarsRepository>();
            builder.Services.AddScoped<IFileRecordRepository, FileRecordRepository>();
            builder.Services.AddScoped<IImageRepository, ImageRepository>();
            builder.Services.AddScoped<IAssetFileRepository, AssetFileRepository>();
            builder.Services.AddScoped<IMarkerRepository, MarkerRepository>();
            builder.Services.AddScoped<IMarkerIconRepository, MarkerIconRepository>();


            // Add UoW
            builder.Services.AddScoped<IUnitOfWork, EfUnitOfWork>();

            // Add Seeders
            builder.Services.AddScoped<IAssetSeeder, AssetDatabaseSeeder>();
            builder.Services.AddScoped<IDemoSeeder, DemoDatabaseSeeder>();
            builder.Services.AddScoped<DatabaseSeederRunner>();

            // Add Services
            builder.Services.AddScoped<ICasesService, CasesService>();
            builder.Services.AddScoped<IFilesService, FilesService>();
            builder.Services.AddScoped<IDepartmentsService, DepartmentsService>();
            builder.Services.AddScoped<ITemplatesService, TemplatesService>();
            builder.Services.AddScoped<ITemplateHtmlService, TemplateHtmlService>();
            builder.Services.AddScoped<IMarkersService, MarkersService>();

            // This is a background service for embedding 
            builder.Services.AddHostedService<EmbedBackgroundWorker>();

            builder.Services.AddSwaggerGen();
            // Add CORS services to the container.  
            builder.Services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = int.MaxValue; // 2.2 GB,
                options.ValueLengthLimit = int.MaxValue; // allow huge form fields
            });
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    a =>
                    {
                        a.AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader();
                    });
            });

            var app = builder.Build();

            // make sure database is up-to date, properly seeded with assets and has a potential demo seed
            if(string.IsNullOrEmpty(migrationName))
            {
                Console.WriteLine("Attempting to seed database...");
                using var scope = app.Services.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                // always migrate
                db.Database.Migrate();
            
                var runner = scope.ServiceProvider.GetRequiredService<DatabaseSeederRunner>();
                runner.RunAsync(seedDemo).GetAwaiter().GetResult();
            }
            else
            {
                Console.WriteLine($"Skipping seeding database due to migration name: {migrationName}");
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("AllowAllOrigins");

            app.UseAuthorization();

            app.MapControllers();

            //if (app.Environment.IsDevelopment())
            //{
            app.UseSwagger();
            app.UseSwaggerUI();
            //}

            app.Run();
        }
    }
}