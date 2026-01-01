@echo off
REM Test script to upload an image to the backend API

echo.
echo ============================================
echo  Testing Image Upload to Backend API
echo ============================================
echo.

REM Create a test image file (small 1x1 pixel PNG)
REM This is a minimal valid PNG file
setlocal enabledelayedexpansion

set "testImage=%TEMP%\test-image.png"

REM Create a minimal PNG (1x1 transparent pixel)
for /f %%A in ('powershell -Command "[System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes('NUL'))"') do (
    echo. > "%testImage%"
)

REM Use PowerShell to create a proper test image
powershell -Command "
[byte[]]$png = @(
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x44, 0x41,
    0x54, 0x08, 0x99, 0x63, 0xF8, 0x0F, 0x00, 0x00,
    0x01, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
    0xAE, 0x42, 0x60, 0x82
)
[System.IO.File]::WriteAllBytes('$testImage', \$png)
Write-Host \"Test image created at: $testImage\" -ForegroundColor Green
"

echo Test image created.
echo.

echo Uploading to http://localhost:8080/api/images...
echo.

REM Upload with curl
curl -X POST ^
  -H "X-Admin-Key: dev-secret-key-123" ^
  -F "file=@%testImage%" ^
  http://localhost:8080/api/images

echo.
echo.
echo Upload complete. Check the response above.
echo If successful, you should see: {"id":..., "url":"https://res.cloudinary.com/...", "filename":"test-image.png"}
echo.

REM Cleanup
if exist "%testImage%" del "%testImage%"

pause
