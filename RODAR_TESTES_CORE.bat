@echo off
setlocal
cd /d "%~dp0"
where node.exe >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Este arquivo e opcional e serve apenas para auditoria tecnica.
  pause
  exit /b 1
)
set FAIL=0
for %%F in (tests\*.js) do (
  echo.
  echo ==== %%F ====
  node "%%F"
  if errorlevel 1 set FAIL=1
)
echo.
if "%FAIL%"=="0" (
  echo TODOS OS TESTES PASSARAM.
) else (
  echo UM OU MAIS TESTES FALHARAM.
)
pause
exit /b %FAIL%
