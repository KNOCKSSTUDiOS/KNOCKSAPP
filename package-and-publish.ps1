<#
================================================================================
  KNOCKSSTUDiOS Hollywood Motion Pictures - Enterprise 4K Ultra Cinema
  Official Windows PowerShell Packaging & GitHub Publishing Pipeline
  Author: KNOCKSSTUDiOS Production Infrastructure
================================================================================
#>

[CmdletBinding()]
param (
    [string]$GitRemoteUrl = "",
    [string]$ReleaseVersion = "v1.0.0",
    [string]$ReleaseNotes = "Official KNOCKSSTUDiOS Enterprise 4K Ultra Cinema Production Release",
    [switch]$SkipZip,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-PublishBanner {
    Clear-Host
    Write-Host ""
    Write-Host "  ======================================================================" -ForegroundColor Magenta
    Write-Host "     KNOCKSSTUDiOS HOLLYWOOD MOTION PICTURES - GITHUB PUBLISHER        " -ForegroundColor Cyan
    Write-Host "     PACKAGE COMPILATION * CODE SEALING * RELEASES & GITHUB CLOUD       " -ForegroundColor Yellow
    Write-Host "  ======================================================================" -ForegroundColor Magenta
    Write-Host "     VERSION: $ReleaseVersion  *  ENTERPRISE VIP SUBSCRIPTION ACTIVE    " -ForegroundColor Green
    Write-Host "     WATERMARK DRM: ENFORCED  *  4K HDR DOLBY & DTS ENGINE SEALED      " -ForegroundColor Green
    Write-Host "  ======================================================================" -ForegroundColor Magenta
    Write-Host ""
}

Write-PublishBanner

$StudioRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $StudioRoot

# Step 1: Validate Prerequisites
Write-Host "[1/5] Verifying Packaging Tools & Git Configuration..." -ForegroundColor Yellow

try {
    $gitVer = git --version
    Write-Host "  [OK] Git ready: $gitVer" -ForegroundColor Green
} catch {
    Write-Error "Git is required to package and publish to GitHub."
    exit 1
}

# Check Git Status / Initialize if needed
if (-not (Test-Path "$StudioRoot\.git")) {
    Write-Host "  [*] Initializing local Git repository..." -ForegroundColor Cyan
    git init
    git branch -M main
}

# Check Git Remote
$currentRemote = git remote get-url origin 2>$null
if (-not $currentRemote -and $GitRemoteUrl) {
    git remote add origin $GitRemoteUrl
    $currentRemote = $GitRemoteUrl
    Write-Host "  [OK] Added Git origin: $currentRemote" -ForegroundColor Green
} elseif ($currentRemote) {
    Write-Host "  [OK] Git Origin: $currentRemote" -ForegroundColor Green
} else {
    Write-Host "  [!] No Git remote origin configured." -ForegroundColor Yellow
    Write-Host "      You can provide -GitRemoteUrl https://github.com/username/repo.git or configure via git remote add origin <url>" -ForegroundColor Gray
}

# Step 2: Compile Production Distribution
Write-Host ""
Write-Host "[2/5] Compiling Production Bundle (npm run build)..." -ForegroundColor Yellow

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Production build failed. Fix compilation errors before publishing."
    exit 1
}
Write-Host "  [OK] Studio compiled cleanly to /dist directory." -ForegroundColor Green

# Step 3: Package Distribution Archive (.ZIP)
Write-Host ""
Write-Host "[3/5] Sealing Package into Standalone Distribution Archive..." -ForegroundColor Yellow

$DistZipName = "KNOCKSSTUDiOS-Cinema-Release-$ReleaseVersion.zip"
$DistZipPath = "$StudioRoot\$DistZipName"

if (-not $SkipZip) {
    if (Test-Path $DistZipPath) {
        Remove-Item $DistZipPath -Force
    }

    Write-Host "  [*] Compressing application assets into $DistZipName..." -ForegroundColor Gray
    
    # Exclude bulky dev folders from user installer zip
    $excludePatterns = @("node_modules", ".git", "dist", "*.zip")
    $filesToCompress = Get-ChildItem -Path $StudioRoot | Where-Object {
        $name = $_.Name
        $exclude = $false
        foreach ($pat in $excludePatterns) {
            if ($name -like $pat) { $exclude = $true; break }
        }
        -not $exclude
    }

    Compress-Archive -Path $filesToCompress.FullName -DestinationPath $DistZipPath -Force
    $zipSizeMb = [math]::Round(((Get-Item $DistZipPath).Length / 1MB), 2)
    Write-Host "  [OK] Standalone Package Created: $DistZipName ($zipSizeMb MB)" -ForegroundColor Green
} else {
    Write-Host "  [>>] Skipped ZIP archive creation per flag." -ForegroundColor Cyan
}

# Step 4: Git Commit & Tag Sealing
Write-Host ""
Write-Host "[4/5] Committing Studio Assets & Tagging Release ($ReleaseVersion)..." -ForegroundColor Yellow

git add -A
$statusOutput = git status --porcelain
if ($statusOutput) {
    $commitMsg = "Release $ReleaseVersion - KNOCKSSTUDiOS Hollywood Motion Pictures 4K Ultra Cinema"
    git commit -m $commitMsg
    Write-Host "  [OK] Git commit created: $commitMsg" -ForegroundColor Green
} else {
    Write-Host "  [OK] Working tree clean; nothing new to commit." -ForegroundColor Green
}

# Tag the release
$existingTag = git tag -l $ReleaseVersion
if ($existingTag) {
    Write-Host "  [*] Updating existing tag $ReleaseVersion..." -ForegroundColor Gray
    git tag -d $ReleaseVersion 2>$null
}
git tag -a $ReleaseVersion -m "$ReleaseNotes"
Write-Host "  [OK] Git tag sealed: $ReleaseVersion" -ForegroundColor Green

# Step 5: Push to GitHub & Publish Release
Write-Host ""
Write-Host "[5/5] Publishing to GitHub Cloud Repository..." -ForegroundColor Yellow

if ($currentRemote) {
    Write-Host "  [*] Pushing commits and tags to origin main..." -ForegroundColor Cyan
    try {
        git push -u origin main --tags
        Write-Host "  [OK] Successfully pushed to $currentRemote!" -ForegroundColor Green
    } catch {
        Write-Warning "Could not push automatically. Ensure you have push access or run: git push -u origin main --tags"
    }

    # Attempt GitHub CLI Release creation if 'gh' is installed
    try {
        $ghVer = gh --version 2>$null
        if ($ghVer) {
            Write-Host "  [*] Creating GitHub Release via GitHub CLI (gh)..." -ForegroundColor Cyan
            if (Test-Path $DistZipPath) {
                gh release create $ReleaseVersion "$DistZipPath" --title "KNOCKSSTUDiOS Cinema $ReleaseVersion" --notes "$ReleaseNotes"
            } else {
                gh release create $ReleaseVersion --title "KNOCKSSTUDiOS Cinema $ReleaseVersion" --notes "$ReleaseNotes"
            }
            Write-Host "  [OK] Official GitHub Release published!" -ForegroundColor Green
        }
    } catch {
        Write-Host "  [*] GitHub CLI not detected. Release can also be created on GitHub.com releases page." -ForegroundColor Gray
    }
} else {
    Write-Host "  [i] Repository is tagged and sealed locally." -ForegroundColor Cyan
    Write-Host "      To publish to your GitHub, run:" -ForegroundColor White
    Write-Host "        git remote add origin https://github.com/<YOUR_USER>/<REPO>.git" -ForegroundColor Yellow
    Write-Host "        git push -u origin main --tags" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "  [SUCCESS] KNOCKSSTUDiOS IS COMPILED, PACKAGED & READY TO PUBLISH!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host "  Package Archive : $DistZipPath" -ForegroundColor Cyan
Write-Host "  Release Tag     : $ReleaseVersion" -ForegroundColor Cyan
Write-Host "  PowerShell Run  : powershell -ExecutionPolicy Bypass -File .\install.ps1" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Magenta
Write-Host ""
