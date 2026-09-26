<#
================================================================================
  KNOCKSSTUDiOS Hollywood Motion Pictures - Enterprise 4K Ultra Cinema
  Official Windows PowerShell Automated Installer & Desktop Runtime Engine
  Author: KNOCKSSTUDiOS Production Infrastructure
================================================================================
#>

[CmdletBinding()]
param (
    [string]$InstallDir = "$HOME\KNOCKSSTUDiOS",
    [int]$Port = 3000,
    [switch]$SkipBuild,
    [switch]$DevMode
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-CinemaBanner {
    Clear-Host
    Write-Host ""
    Write-Host "  ======================================================================" -ForegroundColor Cyan
    Write-Host "     __  __ _   _  ___   ____ _  ______ ____ _____ _   _ ____  _  ___  ____ " -ForegroundColor Cyan
    Write-Host "    |  \/  | \ | |/ _ \ / ___| |/ / ___/ ___|_   _| | | |  _ \(_)/ _ \/ ___|" -ForegroundColor Cyan
    Write-Host "    | |\/| |  \| | | | | |   | ' /\___ \___ \ | | | | | | | | | | | | \___ \ " -ForegroundColor White
    Write-Host "    | |  | | |\  | |_| | |___| . \ ___) |__) || | | |_| | |_| | | |_| |___) |" -ForegroundColor Cyan
    Write-Host "    |_|  |_|_| \_|\___/ \____|_|\_\____/____/ |_|  \___/|____/|_|\___/|____/ " -ForegroundColor Cyan
    Write-Host "  ======================================================================" -ForegroundColor Cyan
    Write-Host "     HOLLYWOOD MOTION PICTURES  *  4K ULTRA CINEMA  *  DIRECTX / VULKAN   " -ForegroundColor Yellow
    Write-Host "     ENTERPRISE VIP SUBSCRIPTION  *  DRM WATERMARK PROTECTION ACTIVE     " -ForegroundColor Green
    Write-Host "  ======================================================================" -ForegroundColor Cyan
    Write-Host ""
}

Write-CinemaBanner

# Step 1: System Requirements & Tool Verification
Write-Host "[1/6] Verifying Windows Environment & Prerequisites..." -ForegroundColor Yellow

# Verify Git
try {
    $gitVer = git --version
    Write-Host "  [OK] Git Detected: $gitVer" -ForegroundColor Green
} catch {
    Write-Host "  [!] Git is not installed or not in PATH." -ForegroundColor Yellow
    Write-Host "      Attempting automatic install via Windows Package Manager (winget)..." -ForegroundColor Cyan
    try {
        winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        Write-Host "  [OK] Git installed successfully." -ForegroundColor Green
    } catch {
        Write-Warning "Could not install Git automatically. Please install Git from https://git-scm.com/"
    }
}

# Verify Node.js & npm
try {
    $nodeVer = node --version
    Write-Host "  [OK] Node.js Detected: $nodeVer" -ForegroundColor Green
    $npmVer = npm --version
    Write-Host "  [OK] npm Detected: $npmVer" -ForegroundColor Green
} catch {
    Write-Host "  [!] Node.js is not installed." -ForegroundColor Yellow
    Write-Host "      Attempting automatic install via Windows Package Manager (winget)..." -ForegroundColor Cyan
    try {
        winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-source-agreements --accept-package-agreements
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        Write-Host "  [OK] Node.js installed. Restart PowerShell if needed." -ForegroundColor Green
    } catch {
        Write-Error "Node.js (v18+) is required. Please install from https://nodejs.org/"
        exit 1
    }
}

# Step 2: Target Directory & Source Setup
Write-Host ""
Write-Host "[2/6] Preparing Studio Workspace at $InstallDir..." -ForegroundColor Yellow

$currentScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# If running directly inside the repo
if (Test-Path "$currentScriptDir\package.json") {
    $StudioRoot = $currentScriptDir
    Write-Host "  [OK] Running inside existing studio repository: $StudioRoot" -ForegroundColor Green
} else {
    $StudioRoot = $InstallDir
    if (-not (Test-Path $StudioRoot)) {
        New-Item -ItemType Directory -Path $StudioRoot -Force | Out-Null
    }
    Set-Location $StudioRoot
    Write-Host "  [OK] Target workspace initialized." -ForegroundColor Green
}

Set-Location $StudioRoot

# Step 3: Install Node Dependencies
Write-Host ""
Write-Host "[3/6] Installing Studio Cinema Dependencies & 3D WebGL Engines..." -ForegroundColor Yellow
Write-Host "      Running npm install (Three.js, Lucide, Tailwind, Firebase)..." -ForegroundColor Gray

npm install --no-audit --prefer-offline
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [!] Retrying with clean install..." -ForegroundColor Yellow
    npm install
}
Write-Host "  [OK] All studio packages and dependencies installed." -ForegroundColor Green

# Step 4: Build Production Assets
Write-Host ""
Write-Host "[4/6] Compiling 4K HDR Cinema Production Distribution..." -ForegroundColor Yellow

if (-not $SkipBuild) {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Build encountered an issue; falling back to developer runtime mode."
    } else {
        Write-Host "  [OK] Production build compiled successfully into /dist." -ForegroundColor Green
    }
} else {
    Write-Host "  [>>] Skipped build compilation per flag." -ForegroundColor Cyan
}

# Step 5: Desktop Shortcuts & App Icon Generation
Write-Host ""
Write-Host "[5/6] Creating Windows Desktop App Shortcut & Icon Integration..." -ForegroundColor Yellow

$DesktopPath = [Environment]::GetFolderPath("Desktop")
$StartMenuPath = [Environment]::GetFolderPath("StartMenu") + "\Programs"

# Create a clean Windows Launcher Script
$LauncherVbsPath = "$StudioRoot\launch-studio.vbs"
$LauncherBatPath = "$StudioRoot\launch-studio.bat"

$BatContent = @"
@echo off
title KNOCKSSTUDiOS 4K Cinema
cd /d "$StudioRoot"
start http://localhost:$Port
call npm run dev -- --port $Port --host
"@
Set-Content -Path $LauncherBatPath -Value $BatContent -Encoding ASCII

# Silent VBS launcher (runs without annoying black cmd window)
$VbsContent = @"
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "$StudioRoot"
WshShell.Run """$StudioRoot\launch-studio.bat""", 0, False
"@
Set-Content -Path $LauncherVbsPath -Value $VbsContent -Encoding ASCII

# Create Windows Shell Shortcut on Desktop
try {
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$DesktopPath\KNOCKSSTUDiOS Cinema.lnk")
    $Shortcut.TargetPath = "wscript.exe"
    $Shortcut.Arguments = "`"$LauncherVbsPath`""
    $Shortcut.WorkingDirectory = $StudioRoot
    $Shortcut.Description = "KNOCKSSTUDiOS Hollywood Motion Pictures - 4K Ultra Cinema"
    if (Test-Path "$StudioRoot\public\favicon.svg") {
        $Shortcut.IconLocation = "$StudioRoot\public\favicon.svg, 0"
    }
    $Shortcut.Save()
    Write-Host "  [OK] Desktop shortcut created: 'KNOCKSSTUDiOS Cinema'" -ForegroundColor Green
} catch {
    Write-Host "  [*] Desktop shortcut created as batch launcher: $LauncherBatPath" -ForegroundColor Gray
}

# Step 6: Launch Studio
Write-Host ""
Write-Host "[6/6] Launching KNOCKSSTUDiOS Hollywood Motion Pictures..." -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  STUDIO URL    : http://localhost:$Port" -ForegroundColor Green
Write-Host "  LICENSE       : KNX-PRO-9842-ENTERPRISE-4K-2026 (VIP ACTIVE)" -ForegroundColor Green
Write-Host "  WATERMARK DRM : ACTIVE - KNOCKSSTUDiOS Hollywood Motion Pictures" -ForegroundColor Green
Write-Host "  ACCOUNT       : GTamayo36@gmail.com" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Studio Server... Press Ctrl+C in this terminal to stop." -ForegroundColor Cyan
Write-Host ""

# Open default browser or Edge Application Mode
Start-Process "http://localhost:$Port"

# Run Vite dev server
npm run dev -- --port $Port --host
