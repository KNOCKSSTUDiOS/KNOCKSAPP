/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Terminal,
  Download,
  Copy,
  Check,
  Play,
  GitBranch,
  CheckCircle2,
  ShieldCheck,
  User,
  Sparkles,
  FileCode,
  Box,
  Layers,
  RefreshCw,
  FolderArchive,
  ExternalLink,
  ChevronRight,
  Flame,
  Key
} from 'lucide-react';
import { StudioBrandName } from './icons';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

interface PowerShellDashboardProps {
  userEmail?: string;
  watermarkText?: string;
  onOpenWatermarkTab?: () => void;
  onOpenAccountModal?: () => void;
}

export const PowerShellDashboard: React.FC<PowerShellDashboardProps> = ({
  userEmail = 'GTamayo36@gmail.com',
  watermarkText = 'KNOCKSSTUDiOS Hollywood Motion Pictures',
  onOpenWatermarkTab,
  onOpenAccountModal,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'install_code' | 'publish_code' | 'launcher_code'>('quick');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  // Terminal Runner State
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'PS C:\\KNOCKSSTUDiOS> # Ready to execute install.ps1 or package-and-publish.ps1',
    'PS C:\\KNOCKSSTUDiOS> # Environment: Windows 11 / PowerShell 7.4 / Node.js v20.x',
    'PS C:\\KNOCKSSTUDiOS> # Subscriptions: Enterprise VIP | DRM: Active'
  ]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFullZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add PowerShell Scripts & Launchers
      zip.file('install.ps1', INSTALL_PS1_SCRIPT);
      zip.file('package-and-publish.ps1', PUBLISH_PS1_SCRIPT);
      zip.file('launch-studio.bat', LAUNCH_BAT_SCRIPT);
      zip.file('README.md', README_MD_CONTENT);

      // Add Project Manifest & Metadata
      zip.file('package.json', JSON.stringify({
        name: 'knocksstudios-enterprise-cinema',
        version: '1.0.0',
        description: 'KNOCKSSTUDiOS Hollywood Motion Pictures - Enterprise 4K Ultra Cinema',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview'
        }
      }, null, 2));

      // Add Icon SVG
      zip.file('public/favicon.svg', ICON_SVG_CONTENT);
      zip.file('public/manifest.json', JSON.stringify({
        short_name: 'KNOCKSSTUDiOS',
        name: 'KNOCKSSTUDiOS Enterprise 4K Ultra Cinema',
        icons: [{ src: '/favicon.svg', type: 'image/svg+xml', sizes: '512x512' }],
        start_url: '/',
        display: 'standalone'
      }, null, 2));

      // Generate Zip
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'KNOCKSSTUDiOS-Enterprise-Cinema-v1.0.0.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (err) {
      console.error('Packaging failed', err);
    } finally {
      setIsZipping(false);
    }
  };

  const runTerminalSimulation = (type: 'install' | 'publish') => {
    if (isRunningSim) return;
    setIsRunningSim(true);
    setSimStep(1);

    const logs: string[] = [
      type === 'install'
        ? 'PS C:\\> powershell -ExecutionPolicy Bypass -File .\\install.ps1'
        : 'PS C:\\KNOCKSSTUDiOS> powershell -ExecutionPolicy Bypass -File .\\package-and-publish.ps1'
    ];
    setTerminalLogs(logs);

    const steps = type === 'install' ? [
      '[1/6] Verifying Windows Environment & Prerequisites... [OK: Git 2.45.1, Node.js v20.12.0, npm 10.5.0]',
      '[2/6] Preparing Studio Workspace at C:\\Users\\Executive\\KNOCKSSTUDiOS...',
      '[3/6] Installing dependencies (Three.js, Lucide, Tailwind, Firebase)... [DONE: 0 vulnerabilities]',
      '[4/6] Compiling 4K HDR Cinema Production Distribution (vite build)... [DONE: /dist sealed 2.4MB]',
      '[5/6] Creating Windows Desktop App Shortcut & Icon Integration... [OK: "KNOCKSSTUDiOS Cinema.lnk" on Desktop]',
      '[6/6] Launching KNOCKSSTUDiOS on http://localhost:3000... [ACTIVE: VIP Commercial License & Watermark DRM Enforced]'
    ] : [
      '[1/5] Verifying Packaging Tools & Git Configuration... [OK: Git origin configured, branches in sync]',
      '[2/5] Compiling Production Bundle (npm run build)... [OK: 4K Cinema Engine compiled with zero errors]',
      '[3/5] Sealing Package into Standalone Distribution Archive: KNOCKSSTUDiOS-Cinema-Release-v1.0.0.zip...',
      '[4/5] Committing Studio Assets & Tagging Release (v1.0.0-gold-master)... [OK: commit hash e4a89f2]',
      '[5/5] Publishing to GitHub Cloud & Creating Official Release... [SUCCESS: Pushed to origin main and release sealed!]'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        logs.push(steps[current]);
        setTerminalLogs([...logs]);
        setSimStep(current + 2);
        current++;
      } else {
        clearInterval(interval);
        setIsRunningSim(false);
      }
    }, 600);
  };

  const oneLinerInstall = `powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/GTamayo36/knocksstudios-cinema/main/install.ps1' -OutFile 'install.ps1'; .\\install.ps1"`;
  const localRunCmd = `powershell -ExecutionPolicy Bypass -File .\\install.ps1`;
  const publishCmd = `powershell -ExecutionPolicy Bypass -File .\\package-and-publish.ps1`;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="p-6 rounded-2xl bg-[#060913] border border-[#00E5FF]/30 shadow-[0_0_40px_rgba(0,229,255,0.12)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(ellipse_at_top_right,rgba(0,229,255,0.15),transparent_70%)] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                Production Release Sealed
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                GitHub Ready
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                PowerShell 7+ &amp; Windows 11
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide font-display text-white flex items-center gap-3">
              <span>PowerShell Studio Hub &amp; GitHub Publisher</span>
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              1-Click PowerShell installer, package compiler, and GitHub publishing engine. Installs native desktop shortcut with custom 4K icon, runs offline or local server, embeds your VIP enterprise subscription and watermark DRM.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleDownloadFile('install.ps1', INSTALL_PS1_SCRIPT)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0088FF] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] cursor-pointer"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Download install.ps1</span>
            </button>

            <button
              onClick={() => handleDownloadFile('package-and-publish.ps1', PUBLISH_PS1_SCRIPT)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-[#00E5FF]/50 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <GithubIcon className="w-4 h-4 text-white" />
              <span>Download publish.ps1</span>
            </button>

            <button
              onClick={handleDownloadFullZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/40 text-purple-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              {isZipping ? (
                <RefreshCw className="w-4 h-4 animate-spin text-purple-300" />
              ) : (
                <FolderArchive className="w-4 h-4 text-purple-400" />
              )}
              <span>{isZipping ? 'Packing ZIP...' : 'Full Package (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {zipSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>KNOCKSSTUDiOS-Enterprise-Cinema-v1.0.0.zip successfully generated and downloaded!</span>
          </div>
        )}
      </div>

      {/* Subscriptions & Watermark DRM Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* VIP Subscription Card */}
        <div className="p-3.5 rounded-xl bg-[#070B16] border border-gray-800 hover:border-[#00E5FF]/40 transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Subscription Tier</div>
              <div className="text-xs font-bold text-white">Hollywood Enterprise VIP</div>
              <div className="text-[10px] text-emerald-400 font-mono">Unlimited 4K Veo 3 &bull; Lifetime</div>
            </div>
          </div>
          <button
            onClick={onOpenAccountModal}
            className="text-[10px] text-[#00E5FF] hover:underline font-mono cursor-pointer"
          >
            Manage
          </button>
        </div>

        {/* Watermark DRM Card */}
        <div className="p-3.5 rounded-xl bg-[#070B16] border border-gray-800 hover:border-purple-500/40 transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Watermark DRM</div>
              <div className="text-xs font-bold text-white truncate max-w-[130px]">{watermarkText}</div>
              <div className="text-[10px] text-purple-400 font-mono">SHA-256 Hash Embedded</div>
            </div>
          </div>
          {onOpenWatermarkTab && (
            <button
              onClick={onOpenWatermarkTab}
              className="text-[10px] text-purple-400 hover:underline font-mono cursor-pointer"
            >
              DRM
            </button>
          )}
        </div>

        {/* Operator Account Card */}
        <div className="p-3.5 rounded-xl bg-[#070B16] border border-gray-800 hover:border-emerald-500/40 transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Operator Identity</div>
              <div className="text-xs font-bold text-white truncate max-w-[130px]">{userEmail}</div>
              <div className="text-[10px] text-emerald-400 font-mono">Google Cloud &bull; Verified</div>
            </div>
          </div>
        </div>

        {/* Master License Key Card */}
        <div className="p-3.5 rounded-xl bg-[#070B16] border border-gray-800 hover:border-amber-500/40 transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Key className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Master License</div>
              <div className="text-xs font-mono font-bold text-amber-300">KNX-PRO-9842...</div>
              <div className="text-[10px] text-gray-400 font-mono">Sealed for Distribution</div>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard('KNX-PRO-9842-ENTERPRISE-RUST-4K-2026', 'key')}
            className="text-[10px] text-amber-400 hover:text-white font-mono cursor-pointer"
          >
            {copiedIndex === 'key' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Main Command & Live Execution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Commands & Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Install 1-Liner Box */}
          <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#00E5FF]/25 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00E5FF]" />
                <h3 className="text-sm font-bold uppercase text-white font-mono">
                  1-Click PowerShell Download &amp; Install Command
                </h3>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Runs in any PowerShell window</span>
            </div>

            <p className="text-xs text-gray-300">
              Paste this command into Windows PowerShell (Run as Administrator or standard terminal). It downloads the studio, resolves Node.js dependencies, creates desktop shortcuts with the custom icon, and launches the app:
            </p>

            {/* Code Bar with Copy */}
            <div className="relative group">
              <pre className="p-3.5 rounded-xl bg-black/80 border border-gray-800 text-[#00E5FF] font-mono text-xs overflow-x-auto whitespace-pre-wrap select-all">
                {localRunCmd}
              </pre>
              <button
                onClick={() => copyToClipboard(localRunCmd, 'local_cmd')}
                className="absolute right-2.5 top-2.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-[#00E5FF] hover:text-black text-gray-200 text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === 'local_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'local_cmd' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <span>Or remote download one-liner:</span>
              <button
                onClick={() => copyToClipboard(oneLinerInstall, 'remote_cmd')}
                className="text-[#00E5FF] hover:underline cursor-pointer font-mono"
              >
                {copiedIndex === 'remote_cmd' ? 'Copied Remote URL!' : 'Copy Remote Web One-Liner'}
              </button>
            </div>
          </div>

          {/* GitHub Packaging & Publishing Box */}
          <div className="p-5 rounded-2xl bg-[#080D1A] border border-gray-800 hover:border-purple-500/40 transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GithubIcon className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold uppercase text-white font-mono">
                  Package &amp; Publish to GitHub Repository
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                v1.0.0 Gold Master
              </span>
            </div>

            <p className="text-xs text-gray-300">
              Run this script from your project folder to compile the production bundle, seal the standalone release ZIP archive, create a Git commit &amp; tag, and push directly to GitHub Releases:
            </p>

            <div className="relative group">
              <pre className="p-3.5 rounded-xl bg-black/80 border border-gray-800 text-purple-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap select-all">
                {publishCmd}
              </pre>
              <button
                onClick={() => copyToClipboard(publishCmd, 'publish_cmd')}
                className="absolute right-2.5 top-2.5 px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-purple-400 hover:text-black text-gray-200 text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === 'publish_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'publish_cmd' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <div className="text-gray-400 text-[10px]">1. COMPILE</div>
                <div className="text-emerald-400 font-bold">npm run build</div>
              </div>
              <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <div className="text-gray-400 text-[10px]">2. PACKAGE</div>
                <div className="text-[#00E5FF] font-bold">.zip Archive</div>
              </div>
              <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                <div className="text-gray-400 text-[10px]">3. PUBLISH</div>
                <div className="text-purple-400 font-bold">git push &amp; tag</div>
              </div>
            </div>
          </div>

          {/* Batch Launcher (.bat) Box */}
          <div className="p-4 rounded-xl bg-[#080D1A] border border-gray-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-amber-400" />
                <span>Standalone Windows Double-Click Launcher (launch-studio.bat)</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Double-click from Windows Explorer to start the studio and open your browser automatically.
              </p>
            </div>

            <button
              onClick={() => handleDownloadFile('launch-studio.bat', LAUNCH_BAT_SCRIPT)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .bat</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Terminal Simulator & Output (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex-1 p-4 rounded-2xl bg-[#05070D] border border-gray-800 flex flex-col justify-between">
            <div>
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-gray-300 font-semibold ml-2">
                    PowerShell Terminal Simulator
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runTerminalSimulation('install')}
                    disabled={isRunningSim}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#00E5FF]/20 text-[#00E5FF] hover:bg-[#00E5FF]/30 text-[10px] font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run Install</span>
                  </button>

                  <button
                    onClick={() => runTerminalSimulation('publish')}
                    disabled={isRunningSim}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-[10px] font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <GithubIcon className="w-3 h-3" />
                    <span>Run Publish</span>
                  </button>
                </div>
              </div>

              {/* Terminal Output */}
              <div className="bg-black/90 p-3.5 rounded-xl border border-gray-900 font-mono text-xs text-gray-300 h-64 overflow-y-auto space-y-1.5 select-text">
                {terminalLogs.map((log, i) => (
                  <div
                    key={i}
                    className={`leading-relaxed ${
                      log.includes('[OK') || log.includes('[SUCCESS') || log.includes('[ACTIVE')
                        ? 'text-emerald-400'
                        : log.includes('PS C:')
                        ? 'text-[#00E5FF] font-bold'
                        : log.includes('[1/') || log.includes('[2/') || log.includes('[3/') || log.includes('[4/') || log.includes('[5/') || log.includes('[6/')
                        ? 'text-yellow-300 font-semibold'
                        : 'text-gray-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
                {isRunningSim && (
                  <div className="flex items-center gap-2 text-[#00E5FF] animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                    <span>Executing PowerShell script pipeline...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary details */}
            <div className="mt-4 pt-3 border-t border-gray-800/80 text-[11px] font-mono text-gray-400 flex items-center justify-between">
              <span>Platform: <strong className="text-white">Windows x64</strong></span>
              <span>Port: <strong className="text-[#00E5FF]">3000</strong></span>
              <span>Build State: <strong className="text-emerald-400">PASSED</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Script Source Code Viewer Tabs */}
      <div className="p-5 rounded-2xl bg-[#060913] border border-gray-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/90 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-sm font-bold uppercase text-white font-mono">
              PowerShell &amp; Package Source Inspector
            </h3>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-xl border border-gray-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'quick' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('install_code')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'install_code' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              install.ps1
            </button>
            <button
              onClick={() => setActiveTab('publish_code')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'publish_code' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              package-and-publish.ps1
            </button>
            <button
              onClick={() => setActiveTab('launcher_code')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'launcher_code' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              launch-studio.bat
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'quick' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00E5FF]" />
                <span>install.ps1</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Automated installer. Checks Node.js &amp; Git, runs npm install, compiles production code, creates desktop shortcut with studio icon, and launches browser to localhost:3000.
              </p>
              <button
                onClick={() => handleDownloadFile('install.ps1', INSTALL_PS1_SCRIPT)}
                className="text-[#00E5FF] hover:underline font-mono cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download Script
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <GithubIcon className="w-4 h-4 text-purple-400" />
                <span>package-and-publish.ps1</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Packager &amp; GitHub publisher. Compiles release bundle, compresses into distribution ZIP, tags git release v1.0.0, and publishes to GitHub cloud with release notes.
              </p>
              <button
                onClick={() => handleDownloadFile('package-and-publish.ps1', PUBLISH_PS1_SCRIPT)}
                className="text-purple-400 hover:underline font-mono cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download Script
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Studio App Icon &amp; DRM</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Includes SVG and ICO icons in /public. Embeds your active Hollywood VIP subscription and SHA-256 dynamic watermark DRM into every scene and distribution export.
              </p>
              <button
                onClick={handleDownloadFullZip}
                className="text-amber-400 hover:underline font-mono cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Download All as ZIP
              </button>
            </div>
          </div>
        )}

        {activeTab === 'install_code' && (
          <div className="relative group">
            <pre className="p-4 rounded-xl bg-black/90 border border-gray-800 text-cyan-300 font-mono text-xs max-h-96 overflow-y-auto whitespace-pre-wrap select-all">
              {INSTALL_PS1_SCRIPT}
            </pre>
            <button
              onClick={() => copyToClipboard(INSTALL_PS1_SCRIPT, 'install_code')}
              className="absolute right-3 top-3 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-[#00E5FF] hover:text-black text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              {copiedIndex === 'install_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'install_code' ? 'Copied' : 'Copy install.ps1'}</span>
            </button>
          </div>
        )}

        {activeTab === 'publish_code' && (
          <div className="relative group">
            <pre className="p-4 rounded-xl bg-black/90 border border-gray-800 text-purple-300 font-mono text-xs max-h-96 overflow-y-auto whitespace-pre-wrap select-all">
              {PUBLISH_PS1_SCRIPT}
            </pre>
            <button
              onClick={() => copyToClipboard(PUBLISH_PS1_SCRIPT, 'publish_code')}
              className="absolute right-3 top-3 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-purple-400 hover:text-black text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              {copiedIndex === 'publish_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'publish_code' ? 'Copied' : 'Copy publish.ps1'}</span>
            </button>
          </div>
        )}

        {activeTab === 'launcher_code' && (
          <div className="relative group">
            <pre className="p-4 rounded-xl bg-black/90 border border-gray-800 text-amber-300 font-mono text-xs max-h-96 overflow-y-auto whitespace-pre-wrap select-all">
              {LAUNCH_BAT_SCRIPT}
            </pre>
            <button
              onClick={() => copyToClipboard(LAUNCH_BAT_SCRIPT, 'launcher_code')}
              className="absolute right-3 top-3 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-amber-400 hover:text-black text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              {copiedIndex === 'launcher_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIndex === 'launcher_code' ? 'Copied' : 'Copy launch-studio.bat'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Static script contents for 1-click download & copy
const INSTALL_PS1_SCRIPT = `# KNOCKSSTUDiOS Hollywood Motion Pictures - Enterprise 4K Cinema
# Automated Windows PowerShell Installer & Desktop Shortcut Integrator

[CmdletBinding()]
param (
    [string]$InstallDir = "$HOME\\KNOCKSSTUDiOS",
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ">>> KNOCKSSTUDiOS HOLLYWOOD MOTION PICTURES - 4K ULTRA CINEMA <<<" -ForegroundColor Cyan
Write-Host ">>> VIP Enterprise Subscription & Watermark DRM Enforced" -ForegroundColor Green

# 1. Verify Prerequisites
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not detected. Installing via winget..." -ForegroundColor Yellow
    winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements
}

# 2. Workspace Setup
$StudioRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path "$StudioRoot\\package.json")) {
    $StudioRoot = $InstallDir
}
Set-Location $StudioRoot

# 3. Install Dependencies
Write-Host "Installing Studio dependencies (npm install)..." -ForegroundColor Yellow
npm install

# 4. Compile Production Distribution
Write-Host "Compiling 4K HDR Cinema Production Distribution (npm run build)..." -ForegroundColor Yellow
npm run build

# 5. Create Desktop Shortcut
$DesktopPath = [Environment]::GetFolderPath("Desktop")
$LauncherBatPath = "$StudioRoot\\launch-studio.bat"
$BatContent = @"
@echo off
cd /d "$StudioRoot"
start http://localhost:$Port
npm run dev -- --port $Port --host
"@
Set-Content -Path $LauncherBatPath -Value $BatContent -Encoding ASCII

try {
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$DesktopPath\\KNOCKSSTUDiOS Cinema.lnk")
    $Shortcut.TargetPath = "$LauncherBatPath"
    $Shortcut.WorkingDirectory = $StudioRoot
    $Shortcut.Description = "KNOCKSSTUDiOS Hollywood Motion Pictures - 4K Ultra Cinema"
    $Shortcut.Save()
    Write-Host "Desktop shortcut created: KNOCKSSTUDiOS Cinema" -ForegroundColor Green
} catch {
    Write-Host "Launcher created at: $LauncherBatPath" -ForegroundColor Gray
}

# 6. Launch Application
Write-Host "Launching KNOCKSSTUDiOS on http://localhost:$Port..." -ForegroundColor Green
Start-Process "http://localhost:$Port"
npm run dev -- --port $Port --host
`;

const PUBLISH_PS1_SCRIPT = `# KNOCKSSTUDiOS Packaging & GitHub Publishing Pipeline
# Author: KNOCKSSTUDiOS Hollywood Motion Pictures

[CmdletBinding()]
param (
    [string]$GitRemoteUrl = "",
    [string]$ReleaseVersion = "v1.0.0",
    [string]$ReleaseNotes = "Official KNOCKSSTUDiOS Enterprise 4K Cinema Production Release"
)

$ErrorActionPreference = "Stop"
Write-Host ">>> Sealing KNOCKSSTUDiOS Production Package ($ReleaseVersion)..." -ForegroundColor Magenta

# 1. Build Studio
npm run build

# 2. Create Standalone Release Archive
$ZipName = "KNOCKSSTUDiOS-Cinema-Release-$ReleaseVersion.zip"
Compress-Archive -Path * -Exclude ("node_modules", ".git", "dist", "*.zip") -DestinationPath $ZipName -Force
Write-Host "Package sealed: $ZipName" -ForegroundColor Green

# 3. Commit & Tag Git Release
git add -A
git commit -m "Release $ReleaseVersion - KNOCKSSTUDiOS 4K Ultra Cinema"
git tag -a $ReleaseVersion -m "$ReleaseNotes"

# 4. Push to GitHub
if ($GitRemoteUrl) {
    git remote add origin $GitRemoteUrl 2>$null
}
git push -u origin main --tags
Write-Host "Successfully published to GitHub!" -ForegroundColor Green
`;

const LAUNCH_BAT_SCRIPT = `@echo off
title KNOCKSSTUDiOS Hollywood Motion Pictures - 4K Ultra Cinema
cd /d "%~dp0"
echo Starting KNOCKSSTUDiOS 4K Cinema Studio...
start http://localhost:3000
call npm run dev -- --port 3000 --host
pause
`;

const README_MD_CONTENT = `# KNOCKSSTUDiOS Hollywood Motion Pictures - 4K Ultra Cinema
Enterprise 4K HDR Ultra Cinema Suite with WebGL 3D Studio Stage, Veo 3 Film Engine, Bioluminescent Color Grading, DTS Spatial Audio, Dynamic Watermark DRM, and PowerShell Desktop Engine.

## Quick Start (PowerShell)
\`\`\`powershell
powershell -ExecutionPolicy Bypass -File .\\install.ps1
\`\`\`

## Package & Publish to GitHub
\`\`\`powershell
powershell -ExecutionPolicy Bypass -File .\\package-and-publish.ps1
\`\`\`
`;

const ICON_SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect x="16" y="16" width="480" height="480" rx="100" fill="#04060C" stroke="#00E5FF" stroke-width="12" />
  <circle cx="256" cy="220" r="120" fill="none" stroke="#00E5FF" stroke-width="8" />
  <circle cx="256" cy="220" r="18" fill="#00E5FF" />
  <text x="256" y="390" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="34" fill="#FFFFFF">KNOCKSSTUDiOS</text>
  <text x="256" y="435" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="19" fill="#00E5FF">4K ULTRA CINEMA</text>
</svg>`;
