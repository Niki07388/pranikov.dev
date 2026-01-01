# This PowerShell script sets Cloudinary environment variables and starts the Spring Boot backend

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Setting Cloudinary Environment Variables" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Set Cloudinary credentials from your account
$env:CLOUDINARY_URL = "cloudinary://338174973227579:nwMY8-c6Oscb0todZK7lifobVuA@dsozrzcvb"
$env:CLOUDINARY_CLOUD_NAME = "dsozrzcvb"
$env:CLOUDINARY_API_KEY = "338174973227579"
$env:CLOUDINARY_API_SECRET = "nwMY8-c6Oscb0todZK7lifobVuA"
$env:CLOUDINARY_FOLDER = "portfolio"

# Optional: Database URL (if you have PostgreSQL)
# $env:DATABASE_URL = "postgresql://portfolio:admin@localhost:5432/port"

# Optional: Admin API key for protected endpoints
$env:ADMIN_API_KEY = "dev-secret-key-123"

# Display what was set
Write-Host "✓ CLOUDINARY_CLOUD_NAME: $($env:CLOUDINARY_CLOUD_NAME)" -ForegroundColor Green
Write-Host "✓ CLOUDINARY_API_KEY: $($env:CLOUDINARY_API_KEY)" -ForegroundColor Green
Write-Host "✓ CLOUDINARY_API_SECRET: ***SET***" -ForegroundColor Green
Write-Host "✓ CLOUDINARY_FOLDER: $($env:CLOUDINARY_FOLDER)" -ForegroundColor Green
Write-Host "✓ ADMIN_API_KEY: $($env:ADMIN_API_KEY)" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Spring Boot backend..." -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Change to backend directory and run Maven Spring Boot
Set-Location "c:\Users\Manoj Kasyap\Desktop\port\backend"
& .\mvnw spring-boot:run
