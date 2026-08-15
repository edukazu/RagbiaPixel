@echo off
setlocal
cd /d "%~dp0"
title Ragbia Pixel FULL HD

echo ==========================================
echo   RAGBIA - PROTOTIPO PIXEL FULL HD
echo ==========================================
echo.
echo Tentando iniciar servidor local...

where py >nul 2>nul
if %errorlevel%==0 goto USE_PY

where python >nul 2>nul
if %errorlevel%==0 goto USE_PYTHON

echo Python nao foi encontrado no PATH.
echo Abrindo o prototipo diretamente no navegador...
start "" "%~dp0index.html"
echo.
echo Dica: para melhor suporte a gamepad, abra via servidor local.
pause
exit /b 0

:USE_PY
start "Ragbia Local Server" /min cmd /c "cd /d \"%~dp0\" && py -m http.server 8000"
timeout /t 1 /nobreak >nul
start "" "http://localhost:8000"
exit /b 0

:USE_PYTHON
start "Ragbia Local Server" /min cmd /c "cd /d \"%~dp0\" && python -m http.server 8000"
timeout /t 1 /nobreak >nul
start "" "http://localhost:8000"
exit /b 0
