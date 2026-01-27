@echo off
setlocal enabledelayedexpansion
for /L %%i in (1,1,35) do (
  timeout /t 2 /nobreak >nul
  powershell -NoProfile -Command "try { $r=Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; if($r.StatusCode -eq 200){Start-Process 'http://localhost:3000'; exit 0} } catch {}; exit 1"
  if !errorlevel! equ 0 exit /b 0
)
