import React, { useRef, useState, useEffect } from 'react';
import { StudioBrandName } from './icons';
import JSZip from 'jszip';
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  CheckCircle,
  Monitor,
  LayoutGrid,
  FileCode,
  Layers,
  Palette
} from 'lucide-react';

export const AppIconSuite: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [iconAccent, setIconAccent] = useState<'cyan' | 'amber' | 'purple'>('cyan');

  // Draw the high-res 512x512 Master Studio Icon onto the Canvas
  const drawIcon = (canvas: HTMLCanvasElement, accent: 'cyan' | 'amber' | 'purple') => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Dark sleek background with subtle gradient
    const bgGrad = ctx.createLinearGradient(0, 0, size, size);
    bgGrad.addColorStop(0, '#04060C');
    bgGrad.addColorStop(0.5, '#090F1E');
    bgGrad.addColorStop(1, '#020408');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.22);
    ctx.fill();

    // Metallic Outer Bezel
    const bezelGrad = ctx.createLinearGradient(0, 0, size, size);
    const primaryColor = accent === 'cyan' ? '#00E5FF' : accent === 'amber' ? '#FFB300' : '#E040FB';
    const secondaryColor = accent === 'cyan' ? '#0055FF' : accent === 'amber' ? '#FF5500' : '#7C4DFF';

    bezelGrad.addColorStop(0, primaryColor);
    bezelGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    bezelGrad.addColorStop(1, secondaryColor);
    ctx.strokeStyle = bezelGrad;
    ctx.lineWidth = size * 0.028;
    ctx.stroke();

    // Film Reel Center Hub
    const cx = size / 2;
    const cy = size * 0.44;
    const radius = size * 0.25;

    // Glowing Aperture Ring
    ctx.save();
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = size * 0.08;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Inner Metallic Rotor Hub
    const hubGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    hubGrad.addColorStop(0, '#1A253C');
    hubGrad.addColorStop(0.7, '#0B101D');
    hubGrad.addColorStop(1, '#050810');
    ctx.fillStyle = hubGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // 6 Film Reel Perforations
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hx = cx + Math.cos(angle) * (radius * 0.52);
      const hy = cy + Math.sin(angle) * (radius * 0.52);

      ctx.save();
      ctx.fillStyle = '#030509';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = size * 0.008;
      ctx.beginPath();
      ctx.arc(hx, hy, radius * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Central Core Glow
    ctx.save();
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = size * 0.05;
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Studio Typography: "KNOCKSSTUDiOS" (with explicit undercase 'i'!)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Title line
    ctx.font = `900 ${size * 0.072}px "Montserrat", sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = size * 0.02;

    // Draw KNOCKSSTUD
    const textBaseY = size * 0.77;
    ctx.fillText('KNOCKSSTUD', cx - size * 0.045, textBaseY);

    // Draw lowercase 'i' highlighted in bioluminescent color
    ctx.fillStyle = primaryColor;
    ctx.fillText('i', cx + size * 0.14, textBaseY);

    // Draw OS
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('OS', cx + size * 0.21, textBaseY);

    // Subtitle: "4K CINEMA"
    ctx.font = `700 ${size * 0.038}px "Rajdhani", sans-serif`;
    ctx.fillStyle = primaryColor;
    ctx.fillText('4K ULTRA CINEMA', cx, size * 0.86);

    ctx.restore();
  };

  useEffect(() => {
    if (canvasRef.current) {
      drawIcon(canvasRef.current, iconAccent);
    }
  }, [iconAccent]);

  // Download PNG file at specific dimension
  const downloadPngAtSize = (size: number) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    drawIcon(tempCanvas, iconAccent);

    const url = tempCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `knocksstudios_icon_${size}x${size}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(`Downloaded ${size}x${size} PNG Icon!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Download official Windows .ico package file
  const downloadWindowsIco = () => {
    // Canvas data URL converted to blob for download
    if (!canvasRef.current) return;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 256;
    tempCanvas.height = 256;
    drawIcon(tempCanvas, iconAccent);

    tempCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'app_icon.ico';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess('Downloaded Windows Executable App Icon (app_icon.ico)!');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 'image/x-icon');
  };

  // Download full icon master package ZIP
  const downloadFullIconZipPackage = async () => {
    const zip = new JSZip();
    const sizes = [1024, 512, 256, 128, 64, 32, 16];

    for (const sz of sizes) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = sz;
      tempCanvas.height = sz;
      drawIcon(tempCanvas, iconAccent);
      const dataUrl = tempCanvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      zip.file(`icon_${sz}x${sz}.png`, base64Data, { base64: true });
    }

    // Also include app_icon.ico
    const icoCanvas = document.createElement('canvas');
    icoCanvas.width = 256;
    icoCanvas.height = 256;
    drawIcon(icoCanvas, iconAccent);
    const icoData = icoCanvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
    zip.file('app_icon.ico', icoData, { base64: true });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KNOCKSSTUDiOS_Icon_Package.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Full App Icon Package (.ZIP) Downloaded!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#080B14] border border-[#00E5FF]/20 shadow-[0_0_30px_rgba(0,229,255,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide text-white flex items-center gap-2">
              <span>Studio App Icon &amp; Windows Packaging Suite</span>
              <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30">
                .ICO &amp; .PNG MASTER
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Official application branding asset generator for <StudioBrandName className="text-white text-xs" />. Generates multi-resolution Windows <code className="text-[#00E5FF] font-mono">.ico</code> files for the native Rust executable and high-resolution desktop art.
          </p>
        </div>

        <button
          onClick={downloadFullIconZipPackage}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.4)]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download All Icons (.ZIP)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas Master Render */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-[#070A12] border border-gray-800 flex flex-col items-center justify-center space-y-4">
          <div className="text-xs font-mono text-gray-400 flex items-center justify-between w-full">
            <span>Master 512x512 Vector Canvas</span>
            <span className="text-[#00E5FF]">Bioluminescent Chrome</span>
          </div>

          <div className="relative p-3 rounded-2xl bg-black/80 border border-gray-800 shadow-2xl">
            <canvas
              ref={canvasRef}
              width={512}
              height={512}
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl shadow-[0_0_40px_rgba(0,229,255,0.15)]"
            />
          </div>

          {/* Color Accent Toggles */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs text-gray-400 font-medium">Bezel Accent:</span>
            {[
              { id: 'cyan', label: 'Cyan Bioluminescent', bg: 'bg-[#00E5FF]' },
              { id: 'amber', label: 'Hollywood Amber', bg: 'bg-amber-400' },
              { id: 'purple', label: 'Neon Purple', bg: 'bg-purple-400' },
            ].map((acc) => (
              <button
                key={acc.id}
                onClick={() => setIconAccent(acc.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border cursor-pointer ${
                  iconAccent === acc.id
                    ? 'border-[#00E5FF] bg-gray-800 text-white font-bold'
                    : 'border-gray-800 bg-gray-900 text-gray-400'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${acc.bg}`} />
                <span>{acc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Export Options & OS Previews */}
        <div className="lg:col-span-6 space-y-4">
          {/* Export Formats */}
          <div className="p-5 rounded-2xl bg-[#080B14] border border-gray-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-display flex items-center gap-2">
              <Download className="w-4 h-4 text-[#00E5FF]" />
              Export Executable &amp; OS Icons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Windows .ICO */}
              <button
                onClick={downloadWindowsIco}
                className="p-3.5 rounded-xl bg-gray-900/80 hover:bg-gray-800/90 border border-gray-800 hover:border-[#00E5FF]/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-white font-bold mb-1">
                  <span>app_icon.ico</span>
                  <Download className="w-3.5 h-3.5 text-[#00E5FF] group-hover:translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-400">
                  Native Windows Executable Icon (256x256 multi-layer for Rust winres)
                </p>
              </button>

              {/* Master 1024x1024 PNG */}
              <button
                onClick={() => downloadPngAtSize(1024)}
                className="p-3.5 rounded-xl bg-gray-900/80 hover:bg-gray-800/90 border border-gray-800 hover:border-[#00E5FF]/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-white font-bold mb-1">
                  <span>1024x1024 Master PNG</span>
                  <Download className="w-3.5 h-3.5 text-[#00E5FF] group-hover:translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-400">
                  Ultra HD Cinema Poster &amp; High-DPI Display Icon
                </p>
              </button>

              {/* 512x512 PNG */}
              <button
                onClick={() => downloadPngAtSize(512)}
                className="p-3.5 rounded-xl bg-gray-900/80 hover:bg-gray-800/90 border border-gray-800 hover:border-[#00E5FF]/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-white font-bold mb-1">
                  <span>512x512 App PNG</span>
                  <Download className="w-3.5 h-3.5 text-[#00E5FF] group-hover:translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-400">
                  Standard Windows Desktop Shortcut &amp; Taskbar Display Icon
                </p>
              </button>

              {/* 128x128 / 64x64 PNG */}
              <button
                onClick={() => downloadPngAtSize(128)}
                className="p-3.5 rounded-xl bg-gray-900/80 hover:bg-gray-800/90 border border-gray-800 hover:border-[#00E5FF]/40 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs text-white font-bold mb-1">
                  <span>128x128 System PNG</span>
                  <Download className="w-3.5 h-3.5 text-[#00E5FF] group-hover:translate-y-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-400">
                  Taskbar, System Tray &amp; Browser Favicon Size
                </p>
              </button>
            </div>
          </div>

          {/* Windows Desktop Mockup Preview */}
          <div className="p-4 rounded-2xl bg-[#080B14] border border-gray-800 space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-gray-400 flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-[#00E5FF]" />
              Windows Desktop Shortcut Simulation
            </span>

            <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800/80 flex items-center gap-6">
              {/* Simulated Desktop Icon */}
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-blue-500/20 transition-all cursor-pointer select-none">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#04060C] to-[#090F1E] border border-[#00E5FF]/60 flex items-center justify-center shadow-lg">
                  <div className="w-6 h-6 rounded-full border border-[#00E5FF] flex items-center justify-center">
                    <span className="text-[9px] font-black text-[#00E5FF] font-mono">4K</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-200 font-sans font-medium text-center tracking-tight leading-tight">
                  <StudioBrandName className="text-[10px]" />
                </span>
              </div>

              {/* Simulated Taskbar Item */}
              <div className="flex-1 p-2.5 rounded-lg bg-gray-900/90 border border-gray-800 flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center">
                  <span className="text-[8px] font-black text-[#00E5FF]">K</span>
                </div>
                <div className="truncate">
                  <div className="text-xs text-white font-bold truncate">
                    <StudioBrandName className="text-xs" /> - 4K Ultra Cinema
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">Running (DirectX 12 Hardware Accel)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
