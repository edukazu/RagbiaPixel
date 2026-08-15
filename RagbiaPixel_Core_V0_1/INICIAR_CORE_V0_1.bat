@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "VERSION=4.2.1"
set "VENDOR=%~dp0phaser_map_beta\vendor"
set "PHASER=%VENDOR%\phaser.min.js"
set "TMP=%TEMP%\ragbia_phaser_%VERSION%_%RANDOM%_%RANDOM%.js"

if not exist "%VENDOR%" mkdir "%VENDOR%" >nul 2>nul

call :validate_file "%PHASER%"
if "%FILE_OK%"=="1" goto launch

echo.
echo [Ragbia Pixel CORE V0.1] Phaser %VERSION% ausente/invalido.
echo [Ragbia Pixel CORE V0.1] Recuperacao automatica iniciada...

del /q "%TMP%" >nul 2>nul
call :try_download "https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.min.js"
if "%PHASER_READY%"=="1" goto launch
call :try_download "https://github.com/phaserjs/phaser/releases/download/v4.2.1/phaser.min.js"
if "%PHASER_READY%"=="1" goto launch
call :try_download "https://cdnjs.cloudflare.com/ajax/libs/phaser/4.2.1/phaser.min.js"
if "%PHASER_READY%"=="1" goto launch

echo.
echo ================================================================
echo ERRO: nao foi possivel obter uma copia valida do Phaser %VERSION%.
echo Nenhum arquivo do jogo foi alterado.
echo ================================================================
del /q "%TMP%" >nul 2>nul
pause
exit /b 1

:try_download
set "URL=%~1"
set "PHASER_READY=0"
del /q "%TMP%" >nul 2>nul

echo Tentando: %URL%
where curl.exe >nul 2>nul
if not errorlevel 1 (
    curl.exe -L -f --retry 2 --retry-delay 1 --connect-timeout 20 --max-time 120 -o "%TMP%" "%URL%" >nul 2>&1
    if not errorlevel 1 goto downloaded
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; try { Invoke-WebRequest -UseBasicParsing -Uri '%URL%' -OutFile '%TMP%' -ErrorAction Stop; exit 0 } catch { Write-Host ('Falha: ' + $_.Exception.Message); exit 1 }"
if errorlevel 1 goto failed

:downloaded
call :validate_file "%TMP%"
if not "%FILE_OK%"=="1" goto failed
copy /y "%TMP%" "%PHASER%" >nul
if errorlevel 1 goto failed
call :validate_file "%PHASER%"
if not "%FILE_OK%"=="1" goto failed
set "PHASER_READY=1"
del /q "%TMP%" >nul 2>nul
echo Phaser %VERSION% validado e armazenado localmente.
goto :eof

:failed
del /q "%TMP%" >nul 2>nul
goto :eof

:validate_file
set "FILE_OK=0"
set "CHECK_FILE=%~1"
if not exist "%CHECK_FILE%" goto :eof
for %%A in ("%CHECK_FILE%") do set "FILE_SIZE=%%~zA"
if !FILE_SIZE! LSS 500000 goto :eof
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=[IO.File]::ReadAllText('%CHECK_FILE%'); if($p.Contains('Phaser')){exit 0}else{exit 1}" >nul 2>nul
if errorlevel 1 goto :eof
set "FILE_OK=1"
goto :eof

:launch
echo.
echo [Ragbia Pixel CORE V0.1] Phaser %VERSION% OK.
echo [Ragbia Pixel CORE V0.1] Iniciando baseline consolidada...
start "" "%~dp0phaser_map_beta\index.html"
exit /b 0
