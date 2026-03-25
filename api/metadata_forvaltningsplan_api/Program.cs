using metadata_forvaltningsplan_api.Data;
using metadata_forvaltningsplan_api.Models.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// ---- Data Storage Configuration ----
var postgresConnection = builder.Configuration.GetConnectionString("Postgres");


    // Use Postgres database
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(postgresConnection)
    );
    builder.Services.AddScoped<IChecklistRepository, DbContextChecklistRepository>();
    builder.Services.AddScoped<IOrderSummaryRepository, DbContextOrderSummaryRepository>();
    builder.Services.AddScoped<IManagementPlanRepository, DbContextManagementPlanRepository>();
    builder.Services.AddScoped<IMetadataRepository, DbContextMetadataRepository>();
    Console.WriteLine("INFO: Using Postgres database for forms data");



builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS configuration
// In production (IIS), all apps are served from the same origin, so CORS is not needed
// But we configure it to ensure no CORS errors occur
builder.Services.AddCors(options =>
{
    // Development policy for separate dev servers
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001",
                          "https://localhost:3000", "https://localhost:3001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });

    // Production policy - allow requests from same origin
    // Since all apps are served from the same domain in IIS, same-origin requests don't trigger CORS
    // But we configure this to be safe and allow any origin (for flexibility)
    options.AddPolicy("AllowProduction", policy =>
    {
        policy.SetIsOriginAllowed(origin => true)  // Allow any origin (same-origin in IIS)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();  // Important for Windows Authentication cookies
    });
});

var app = builder.Build();

// CORS must be configured before UseAuthentication and UseAuthorization
// In production (IIS), all apps are same-origin so CORS isn't triggered, but we enable it for safety
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("AllowLocalhost");
}
else
{
    // Enable CORS in production to prevent any potential CORS errors
    // Since all apps are served from the same domain, same-origin requests don't need CORS
    // But having this configured ensures no CORS errors occur
    app.UseCors("AllowProduction");
}

app.UseHttpsRedirection();

// API routes only - admin and client are separate IIS applications
app.MapControllers();

app.Run();
