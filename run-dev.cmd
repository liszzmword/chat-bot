@echo off
cd /d "%~dp0"
echo [CHATBOT] Dev server starting...
echo [CHATBOT] Browser will open when the server is ready. If you see 404, wait for "Ready" and press F5.
start /B cmd /c "call ""%~dp0scripts\wait-and-open.cmd"""
npx.cmd next dev
