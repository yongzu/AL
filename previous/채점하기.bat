@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo.
echo  AL 채점 모드를 엽니다. 브라우저가 자동으로 열립니다.
echo  다 매겼으면 이 창을 닫으세요.
echo.
call npm run dev -- --open
