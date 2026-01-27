@echo off
cd /d "%~dp0"
echo [CHATBOT] Vercel deploy - After deploy, use the URL without running CMD.
echo [CHATBOT] Add GEMINI_API_KEY in Vercel Project Settings if not set.
npx.cmd vercel --yes
