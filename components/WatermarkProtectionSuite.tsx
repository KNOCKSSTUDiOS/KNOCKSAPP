import React, { useState, useEffect } from 'react';
import { WatermarkConfig } from '../types';
import { StudioBrandName } from './icons';
import {
  ShieldCheck,
  Eye,
  Sliders,
  Clock,
  Fingerprint,
  Lock,
  Layers,
  Sparkles,
  CheckCircle,
  Copy,
  AlertTriangle
} from 'lucide-react';

interface WatermarkProtectionSuiteProps {
  config: WatermarkConfig;
  onChange: (newConfig: WatermarkConfig) => void;
}

export const WatermarkProtectionSuite: React.FC<WatermarkProtectionSuiteProps> = ({
  config,
  onChange,
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [timecodeStr, setTimecodeStr] = useState('01:24:18:12');

  // Live ticking timecode for preview
  useEffect(() => {
    let frame = 12;
    let sec = 18;
    let min = 24;
    const interval = setInterval(() => {
      frame++;
      if (frame >= 24) {
        frame = 0;
        sec++;
        if (sec >= 60) {
          sec = 0;
          min++;
        }
      }
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimecodeStr(`01:${pad(min)}:${pad(sec)}:${pad(frame)}`);
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  const handlePresetSelect = (presetText: string) => {
    onChange({ ...config, text: presetText });
  };

  const copyFingerprint = () => {
    navigator.clipboard.writeText(config.fingerprintId);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-[#080B14] border border-cyan-500/20 shadow-[0_0_30px_rgba(0,229,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide text-white flex items-center gap-2">
              <span>Hollywood Security &amp; Watermark Engine</span>
              <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded border ${
                config.enabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-gray-800 text-gray-400 border-gray-700'
              }`}>
                {config.enabled ? 'PROTECTION ACTIVE' : 'BYPASS MODE'}
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Screener protection, dynamic SMPTE timecode burn-in, Rec.2020 digital fingerprinting, and anti-leak watermarking for <StudioBrandName className="text-white text-xs" />.
          </p>
        </div>

        {/* Master Watermark Switch */}
        <button
          onClick={() => onChange({ ...config, enabled: !config.enabled })}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
            config.enabled
              ? 'bg-[#00E5FF] text-black hover:brightness-110 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
              : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{config.enabled ? 'Watermark Shield: ENABLED' : 'Enable Watermark'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Real-time Interactive Video Watermark Canvas Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-[#070A12] border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#00E5FF]" />
                Live 4K Cinema Viewport Preview
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                Resolution: 3840x2160 &bull; Rec.2020
              </span>
            </div>

            {/* Virtual Screen with Watermark Overlays */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-950 via-[#0A1020] to-black border border-gray-800 flex items-center justify-center select-none shadow-2xl">
              {/* Fake Scene Visual Backdrop */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00E5FF]/20 via-transparent to-transparent pointer-events-none" />
              
              <div className="text-center z-0 px-4">
                <StudioBrandName className="text-white text-lg opacity-30" />
                <p className="text-[11px] text-gray-500 mt-1 font-mono">
                  [SCENE 01: CYBERPUNK METROPOLIS &bull; 4K HDR REC.2020 MASTER]
                </p>
              </div>

              {/* 2.39:1 Cinemascope Mattes if enabled */}
              {config.aspectRatioMatte && (
                <>
                  <div className="absolute top-0 inset-x-0 h-[10%] bg-black z-10 border-b border-gray-900/60" />
                  <div className="absolute bottom-0 inset-x-0 h-[10%] bg-black z-10 border-t border-gray-900/60" />
                </>
              )}

              {/* WATERMARK OVERLAY LAYERS */}
              {config.enabled && (
                <div
                  className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
                  style={{
                    opacity: config.opacity / 100,
                  }}
                >
                  {/* Position: Center Diagonal Hollywood Screener */}
                  {config.position === 'center-diagonal' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="transform -rotate-25 text-center whitespace-nowrap">
                        <div
                          className={`font-black font-mono tracking-widest uppercase ${
                            config.color === 'cyan' ? 'text-[#00E5FF]' :
                            config.color === 'amber' ? 'text-amber-400' :
                            config.color === 'slate' ? 'text-gray-400' : 'text-white'
                          }`}
                          style={{ fontSize: `${config.fontSize * 1.4}px` }}
                        >
                          {config.text}
                        </div>
                        {config.showFingerprint && (
                          <div className="text-[10px] font-mono text-gray-400 mt-1 tracking-wider">
                            DIGITAL FINGERPRINT: {config.fingerprintId}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Position: Bottom Right Banner */}
                  {config.position === 'bottom-right' && (
                    <div className="absolute bottom-4 right-4 text-right bg-black/60 px-3 py-1.5 rounded border border-gray-800 backdrop-blur-sm">
                      <div
                        className={`font-black font-mono tracking-wide ${
                          config.color === 'cyan' ? 'text-[#00E5FF]' :
                          config.color === 'amber' ? 'text-amber-400' :
                          config.color === 'slate' ? 'text-gray-400' : 'text-white'
                        }`}
                        style={{ fontSize: `${config.fontSize}px` }}
                      >
                        {config.text}
                      </div>
                      {config.showFingerprint && (
                        <div className="text-[9px] font-mono text-gray-400">
                          {config.fingerprintId}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Position: Top Left Production Mon */}
                  {config.position === 'top-left' && (
                    <div className="absolute top-4 left-4 text-left bg-black/60 px-3 py-1.5 rounded border border-gray-800 backdrop-blur-sm">
                      <div
                        className={`font-black font-mono tracking-wide ${
                          config.color === 'cyan' ? 'text-[#00E5FF]' :
                          config.color === 'amber' ? 'text-amber-400' :
                          config.color === 'slate' ? 'text-gray-400' : 'text-white'
                        }`}
                        style={{ fontSize: `${config.fontSize}px` }}
                      >
                        {config.text}
                      </div>
                      {config.showFingerprint && (
                        <div className="text-[9px] font-mono text-gray-400">
                          {config.fingerprintId}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Position: Bottom Bar Ticker */}
                  {config.position === 'bottom-bar' && (
                    <div className="absolute bottom-3 inset-x-3 bg-black/80 px-4 py-1 rounded border border-gray-800 flex items-center justify-between text-xs font-mono">
                      <span className={`${
                        config.color === 'cyan' ? 'text-[#00E5FF]' :
                        config.color === 'amber' ? 'text-amber-400' :
                        config.color === 'slate' ? 'text-gray-400' : 'text-white'
                      } font-bold tracking-wider`}>
                        {config.text}
                      </span>
                      {config.showFingerprint && (
                        <span className="text-[10px] text-gray-400">{config.fingerprintId}</span>
                      )}
                    </div>
                  )}

                  {/* Position: Grid Tiled Multi-Watermark */}
                  {config.position === 'grid-tiled' && (
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-6 gap-6 items-center justify-items-center">
                      {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="transform -rotate-15 text-center">
                          <div
                            className={`font-black font-mono tracking-widest text-xs ${
                              config.color === 'cyan' ? 'text-[#00E5FF]' :
                              config.color === 'amber' ? 'text-amber-400' :
                              config.color === 'slate' ? 'text-gray-400' : 'text-white'
                            }`}
                          >
                            {config.text}
                          </div>
                          <div className="text-[8px] font-mono text-gray-500">
                            {config.fingerprintId}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live SMPTE Timecode Burn-in (Top Right or Bottom Left) */}
                  {config.showTimecode && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-black/80 border border-gray-800 text-white font-mono text-xs font-bold tracking-widest flex items-center gap-1.5 shadow-lg">
                      <Clock className="w-3 h-3 text-[#00E5FF] animate-pulse" />
                      <span>{timecodeStr}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Preview Specs */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 px-1 font-mono">
              <span>Pos: {config.position}</span>
              <span>Opacity: {config.opacity}%</span>
              <span>Font: {config.fontSize}px</span>
              <span>DRM Protection: {config.drmProtection ? 'Active (Context-Menu Disabled)' : 'Off'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Security & Watermark Customization Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#080B14] border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00E5FF]" />
              Watermark Configuration
            </h3>

            {/* Preset Watermark Selectors */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Quick Hollywood Presets:</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  'KNOCKSSTUDiOS • PRE-RELEASE SCREENER • STRICTLY CONFIDENTIAL',
                  'PROPERTY OF GTAMAYO • ALL RIGHTS RESERVED • DO NOT DISTRIBUTE',
                  'Rec.2020 4K HDR • TIME-STAMPED DIGITAL FINGERPRINT',
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePresetSelect(preset)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
                      config.text === preset
                        ? 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/40'
                        : 'bg-gray-900/80 text-gray-300 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Custom Watermark Text:</label>
              <input
                type="text"
                value={config.text}
                onChange={(e) => onChange({ ...config, text: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-mono text-white focus:outline-none focus:border-[#00E5FF]"
                placeholder="Enter custom watermark disclaimer..."
              />
            </div>

            {/* Position Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Watermark Position:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'center-diagonal', label: 'Center Diagonal' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'grid-tiled', label: 'Grid Tiled (Leak Proof)' },
                  { id: 'bottom-bar', label: 'Bottom Bar Ticker' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => onChange({ ...config, position: pos.id as any })}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all border cursor-pointer ${
                      config.position === pos.id
                        ? 'bg-[#00E5FF] text-black font-bold border-[#00E5FF]'
                        : 'bg-gray-900 text-gray-300 border-gray-800 hover:text-white'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders: Opacity & Font Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Opacity</span>
                  <span className="font-mono text-white font-bold">{config.opacity}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  value={config.opacity}
                  onChange={(e) => onChange({ ...config, opacity: Number(e.target.value) })}
                  className="w-full accent-[#00E5FF]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Font Size</span>
                  <span className="font-mono text-white font-bold">{config.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="28"
                  value={config.fontSize}
                  onChange={(e) => onChange({ ...config, fontSize: Number(e.target.value) })}
                  className="w-full accent-[#00E5FF]"
                />
              </div>
            </div>

            {/* Color Accent */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-medium">Watermark Color:</label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'cyan', label: 'Cyan Glow', bg: 'bg-[#00E5FF]' },
                  { id: 'amber', label: 'Warning Amber', bg: 'bg-amber-400' },
                  { id: 'white', label: 'Crisp White', bg: 'bg-white' },
                  { id: 'slate', label: 'Stealth Slate', bg: 'bg-slate-400' },
                ].map((col) => (
                  <button
                    key={col.id}
                    onClick={() => onChange({ ...config, color: col.id as any })}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                      config.color === col.id
                        ? 'border-[#00E5FF] bg-gray-800 text-white font-bold'
                        : 'border-gray-800 bg-gray-900 text-gray-400'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${col.bg}`} />
                    <span>{col.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles: Timecode, Fingerprint, DRM */}
            <div className="pt-2 border-t border-gray-800/80 space-y-2.5">
              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>SMPTE Timecode Burn-in (24 FPS)</span>
                </span>
                <input
                  type="checkbox"
                  checked={config.showTimecode}
                  onChange={(e) => onChange({ ...config, showTimecode: e.target.checked })}
                  className="accent-[#00E5FF] w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                  <span>Anti-Piracy User Fingerprint</span>
                </span>
                <input
                  type="checkbox"
                  checked={config.showFingerprint}
                  onChange={(e) => onChange({ ...config, showFingerprint: e.target.checked })}
                  className="accent-purple-400 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cinemascope 2.39:1 Mattes</span>
                </span>
                <input
                  type="checkbox"
                  checked={config.aspectRatioMatte}
                  onChange={(e) => onChange({ ...config, aspectRatioMatte: e.target.checked })}
                  className="accent-emerald-400 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Right-Click &amp; Save DRM Shield</span>
                </span>
                <input
                  type="checkbox"
                  checked={config.drmProtection}
                  onChange={(e) => onChange({ ...config, drmProtection: e.target.checked })}
                  className="accent-amber-400 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Fingerprint ID Card */}
            <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800 text-[11px] font-mono flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="text-gray-500">ID: </span>
                <span className="text-[#00E5FF]">{config.fingerprintId}</span>
              </div>
              <button
                onClick={copyFingerprint}
                className="flex items-center gap-1 text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800 cursor-pointer"
              >
                {copiedNotification ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedNotification ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
