@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo [RagbiaPixel] Node.js nao foi encontrado no PATH.
  echo.
  pause
  exit /b 1
)

if not exist "tools\local_server.js" (
  echo.
  echo [RagbiaPixel] tools\local_server.js nao existe.
  echo Execute primeiro o patch M002.2A.1 FIX1 CORS / servidor local.
  echo.
  pause
  exit /b 1
)

set "RAGBIA_PORT=41731"
set "RAGBIA_URL=http://127.0.0.1:%RAGBIA_PORT%/phaser_map_beta/microtest-northwall-v0.html"

start "RagbiaPixel Local Server" /min cmd /c "set RAGBIA_PORT=%RAGBIA_PORT%&& node tools\local_server.js"
timeout /t 1 /nobreak >nul
start "" "%RAGBIA_URL%"

endlocal
