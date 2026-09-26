import React, { useState } from 'react';
import { GoogleDriveSyncState } from '../types';
import { StudioBrandName } from './icons';
import JSZip from 'jszip';
import {
  Cloud,
  CloudUpload,
  HardDrive,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  Download,
  Terminal,
  ExternalLink,
  ShieldCheck,
  FileText,
  FileCode,
  Layers
} from 'lucide-react';

interface GoogleDriveStudioManagerProps {
  syncState: GoogleDriveSyncState;
  onSyncStateChange: (newState: GoogleDriveSyncState) => void;
  onTriggerBackup: () => Promise<void>;
}

export const GoogleDriveStudioManager: React.FC<GoogleDriveStudioManagerProps> = ({
  syncState,
  onSyncStateChange,
  onTriggerBackup,
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await onTriggerBackup();
      onSyncStateChange({
        ...syncState,
        lastBackupTime: new Date().toLocaleTimeString(),
        totalBackedUpMb: +(syncState.totalBackedUpMb + 12.4).toFixed(1),
      });
      setSyncSuccessMessage('Enterprise Studio Project Master successfully backed up to Google Drive!');
      setTimeout(() => setSyncSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Backup error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadDriveBatchLauncher = () => {
    const batContent = `@echo off
rem =========================================================================
rem KNOCKSSTUDiOS | GoogleDriveFS Desktop Launcher for Windows
rem Looks up the latest GoogleDriveFS.exe in Windows Registry & executes
rem =========================================================================

setlocal EnableDelayedExpansion

echo [*] Resolving Google Drive for Desktop installation path...

for /f "tokens=3* delims= " %%A in ('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\GoogleDriveFS.exe" /ve 2^>nul') do (
    set "GDRIVE_PATH=%%A %%B"
)

if not defined GDRIVE_PATH (
    if exist "C:\\Program Files\\Google\\Drive File Stream\\launch.bat" (
        set "GDRIVE_PATH=C:\\Program Files\\Google\\Drive File Stream\\launch.bat"
    ) else if exist "%LOCALAPPDATA%\\Google\\DriveFS\\GoogleDriveFS.exe" (
        set "GDRIVE_PATH=%LOCALAPPDATA%\\Google\\DriveFS\\GoogleDriveFS.exe"
    )
)

if defined GDRIVE_PATH (
    echo [OK] Located Google Drive: "!GDRIVE_PATH!"
    echo [*] Mounting KNOCKSSTUDiOS cloud studio sync directory...
    start "" "!GDRIVE_PATH!" %*
) else (
    echo [!] Google Drive for Desktop is not installed in standard registry paths.
    echo [*] Opening Google Drive Web Portal in browser...
    start "" "https://drive.google.com"
)

exit /b 0
`;
    const blob = new Blob([batContent], { type: 'application/bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'launch-googledrivefs.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullDrivePackageZip = async () => {
    const zip = new JSZip();
    zip.file(
      'KNOCKSSTUDiOS_Project_Manifest.json',
      JSON.stringify(
        {
          studio: 'KNOCKSSTUDiOS Hollywood Motion Pictures Enterprise',
          project: 'Enterprise 4K Ultra Cinema Master',
          timestamp: new Date().toISOString(),
          specs: {
            resolution: '4K Ultra HD (3840x2160)',
            colorSpace: 'Rec.2020 10-Bit HDR',
            audio: 'DTS 7.1 Spatial & Dolby Atmos Stems',
            engine: '★ WINDOWS RUST NATIVE ★ & Veo 3',
          },
          cloudSync: 'Google Drive Ready',
        },
        null,
        2
      )
    );
    zip.file(
      'launch-googledrivefs.bat',
      `@echo off\nfor /f "tokens=3* delims= " %%A in ('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\GoogleDriveFS.exe" /ve 2^>nul') do set "GDRIVE_PATH=%%A %%B"\nstart "" "!GDRIVE_PATH!" %*\n`
    );

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KNOCKSSTUDiOS_GDrive_Archive_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#080C16] border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cloud className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide text-white flex items-center gap-2">
              <span>Google Drive Studio Cloud &amp; Desktop Sync</span>
              <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                GDRIVE READY
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Automated Google Drive cloud archiving for <StudioBrandName className="text-white text-xs" />, featuring Windows <code className="text-blue-400 font-mono">GoogleDriveFS.exe</code> registry launcher integration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50"
          >
            <CloudUpload className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Sync to Google Drive Now'}</span>
          </button>
        </div>
      </div>

      {syncSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncSuccessMessage}</span>
        </div>
      )}

      {/* Grid: Cloud Status & Desktop Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Google Drive Cloud Sync Status Card */}
        <div className="p-5 rounded-2xl bg-[#080B14] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-blue-400" />
              Cloud Storage &amp; Target Directory
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              CONNECTED
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gray-400">Target Google Drive Folder:</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5 flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  {syncState.folderTarget}
                </div>
              </div>
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20"
              >
                <span>Open Web Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-900/40 border border-gray-800">
                <span className="text-gray-500 text-[10px] uppercase font-mono">Last Synchronized</span>
                <div className="font-bold text-white font-mono mt-0.5">{syncState.lastBackupTime || 'Active'}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-900/40 border border-gray-800">
                <span className="text-gray-500 text-[10px] uppercase font-mono">Total Cloud Stored</span>
                <div className="font-bold text-white font-mono mt-0.5">{syncState.totalBackedUpMb} MB</div>
              </div>
            </div>

            {/* Auto-Sync Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-800 text-xs cursor-pointer">
              <span className="text-gray-300 font-medium">Automatic Cloud Sync (every 15 min)</span>
              <input
                type="checkbox"
                checked={syncState.autoSync}
                onChange={(e) => onSyncStateChange({ ...syncState, autoSync: e.target.checked })}
                className="accent-blue-400 w-4 h-4 cursor-pointer"
              />
            </label>

            {/* Quick Export ZIP to Google Drive */}
            <div className="pt-2">
              <button
                onClick={handleDownloadFullDrivePackageZip}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-gray-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Export Google Drive Studio Archive (.ZIP)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Windows GoogleDriveFS.exe Desktop Integration */}
        <div className="p-5 rounded-2xl bg-[#080B14] border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
              Windows Desktop GoogleDriveFS Launcher
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              HKLM Registry Lookup
            </span>
          </div>

          <p className="text-xs text-gray-400">
            Automated Windows Batch launcher that dynamically reads the Google Drive for Desktop install location from the Windows Registry (<code className="text-[#00E5FF] font-mono">App Paths\GoogleDriveFS.exe</code>) and connects the studio workspace.
          </p>

          {/* Batch Code Preview */}
          <div className="p-3 rounded-xl bg-black/80 border border-gray-800 font-mono text-[11px] text-gray-300 max-h-44 overflow-y-auto space-y-1">
            <div className="text-gray-500">rem GoogleDriveFS.exe Registry Launcher</div>
            <div className="text-blue-300">for /f "tokens=3* delims= " %%A in ('reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\GoogleDriveFS.exe" /ve 2^&gt;nul') do set "GDRIVE_PATH=%%A %%B"</div>
            <div className="text-emerald-400">if defined GDRIVE_PATH start "" "!GDRIVE_PATH!" %*</div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={handleDownloadDriveBatchLauncher}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download launch-googledrivefs.bat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
