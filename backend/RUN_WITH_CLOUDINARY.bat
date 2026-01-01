@echo off
REM This script sets Cloudinary environment variables and starts the Spring Boot backend

REM Set Cloudinary credentials
set CLOUDINARY_URL=cloudinary://338174973227579:nwMY8-c6Oscb0todZK7lifobVuA@dsozrzcvb
set CLOUDINARY_CLOUD_NAME=dsozrzcvb
set CLOUDINARY_API_KEY=338174973227579
set CLOUDINARY_API_SECRET=nwMY8-c6Oscb0todZK7lifobVuA
set CLOUDINARY_FOLDER=portfolio

REM Optional: Set database URL if you have PostgreSQL running
REM set DATABASE_URL=postgresql://portfolio:admin@localhost:5432/port

REM Optional: Set admin API key for protected endpoints
set ADMIN_API_KEY=dev-secret-key-123

echo.
echo ============================================
echo  Cloudinary Environment Variables Set
echo ============================================
echo CLOUDINARY_CLOUD_NAME: %CLOUDINARY_CLOUD_NAME%
echo CLOUDINARY_API_KEY: %CLOUDINARY_API_KEY%
echo CLOUDINARY_API_SECRET: ***SET***
echo CLOUDINARY_FOLDER: %CLOUDINARY_FOLDER%
echo ADMIN_API_KEY: %ADMIN_API_KEY%
echo.
echo Starting Spring Boot backend...
echo ============================================
echo.

REM Run Maven Spring Boot
call mvnw spring-boot:run

pause
