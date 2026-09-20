@echo off
title B & Y JEOCAD - Canli Web Sitesi Sunucusu
color 0E
echo ===================================================================
echo             B & Y JEOCAD - RESMI WEB SITESI SUNUCUSU
echo ===================================================================
echo.
echo  Web sunucusu baslatiliyor...
echo  Erisim Adresi: http://localhost:8080/
echo.
start "" "http://localhost:8080/"
"C:\Users\BURHAN\.gemini\antigravity\scratch\geosection_studio\JeoCAD_Server.exe" 8080 "C:\Users\BURHAN\.gemini\antigravity\scratch\geosection_studio\web_portal"
pause
