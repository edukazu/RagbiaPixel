@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo [RagbiaPixel] Node.js nao foi encontrado no PATH.
    echo Instale/ative o Node.js e execute este launcher novamente.
    echo.
    pause
    exit /b 1
)

set "RAGBIA_PORT=41731"
set "RAGBIA_URL=http://127.0.0.1:%RAGBIA_PORT%/phaser_map_beta/index.html"

rem Phaser carrega imagens por HTTP. Abrir index.html diretamente via file:// causa CORS.
start "RagbiaPixel Local Server" /min cmd /c "set RAGBIA_PORT=%RAGBIA_PORT%&& node tools\local_server.js"

rem Pequena espera para o servidor subir.
timeout /t 1 /nobreak >nul

start "" "%RAGBIA_URL%"

endlocal
