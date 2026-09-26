@echo off
title KNOCKSSTUDiOS Hollywood Motion Pictures - 4K Ultra Cinema
cd /d "%~dp0"
echo ======================================================================
echo    KNOCKSSTUDiOS HOLLYWOOD MOTION PICTURES - 4K ULTRA CINEMA
echo    VIP ENTERPRISE SUBSCRIPTION * WATERMARK DRM PROTECTION ACTIVE
echo ======================================================================
echo Starting 4K Cinema Studio on http://localhost:3000...
start http://localhost:3000
npm run dev -- --port 3000 --host
pause
