import React, { useState, useEffect } from 'react';
import { StudioAnalyticsData } from '../types';
import { StudioBrandName } from './icons';
import {
  Activity,
  Cpu,
  Film,
  HardDrive,
  Volume2,
  Cloud,
  CheckCircle2,
  Clock,
  Download,
  RefreshCw,
  Zap,
  TrendingUp,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface StudioAnalyticsProps {
  data: StudioAnalyticsData;
  onRefresh?: () => void;
}

export const StudioAnalytics: React.FC<StudioAnalyticsProps> = ({ data, onRefresh }) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isLivePolling, setIsLivePolling] = useState<boolean>(true);
  const [pulseCount, setPulseCount] = useState<number>(0);
  const [events, setEvents] = useState(data.liveEvents);

  useEffect(() => {
    if (!isLivePolling) return;
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLivePolling]);

  const handleExportCSV = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total 4K Scenes Rendered', data.totalScenesRendered],
      ['Total 4K Footage (Minutes)', data.total4KMinutes],
      ['GPU Compute Hours (DX12)', data.gpuComputeHours],
      ['Average Veo 3 Latency (Sec)', data.averageVeoLatencySec],
      ['Rec.2020 Bitrate (Mbps)', data.activeRec2020BitrateMbps],
      ['DTS 7.1 Audio Stems Exported', data.dtsAudioStemsExported],
      ['Google Drive Backups Synced', data.gdriveBackupsSynced],
      ['Render Pass Efficiency', `${data.enterpriseMasterStats.renderPassEfficiency}%`],
      ['Color Grade Integrity', `${data.enterpriseMasterStats.colorGradeIntegrity}%`],
      ['DTS Bitstream Accuracy', `${data.enterpriseMasterStats.dtsBitstreamAccuracy}%`],
      ['HDR Peak Luminance', `${data.enterpriseMasterStats.hdrPeakLuminanceNits} Nits`],
      ['AV1 Hardware Encoding FPS', data.enterpriseMasterStats.av1HardwareEncodingFps],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `knocksstudios_enterprise_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `knocksstudios_enterprise_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredEvents = activeFilter === 'ALL'
    ? events
    : events.filter(e => e.category === activeFilter);

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="p-5 rounded-2xl bg-[#080C16] border border-[#00E5FF]/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide text-white flex items-center gap-2">
                <span>Real-Time Studio Telemetry</span>
                <span className="text-xs font-sans font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE 60 FPS
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl">
              Enterprise telemetry monitor for <StudioBrandName className="text-white text-xs" /> 4K Ultra Cinema pipeline, Veo 3 cluster workloads, DTS 7.1 audio stems, and ★ WINDOWS RUST NATIVE ★ master metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsLivePolling(!isLivePolling)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isLivePolling
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLivePolling ? 'animate-spin' : ''}`} />
              <span>{isLivePolling ? 'Live Polling (1s)' : 'Polling Paused'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry JSON</span>
            </button>
          </div>
        </div>

        {/* Live Hardware & Engine Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-gray-800/80 text-xs">
          <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00E5FF]" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Render Engine</div>
              <div className="font-bold text-white">Google Veo 3 Cluster</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Hardware Accel</div>
              <div className="font-bold text-white">DirectX 12 / Rec.2020</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Audio Master</div>
              <div className="font-bold text-white">DTS &amp; Dolby 7.1 96kHz</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Cloud Backup</div>
              <div className="font-bold text-white">Google Drive Synced</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 4K Cinema Production */}
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-gray-800 hover:border-[#00E5FF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">4K Master Scenes</span>
            <Film className="w-4 h-4 text-[#00E5FF]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-display text-white">{data.totalScenesRendered}</span>
            <span className="text-xs text-emerald-400 font-bold">+3 today</span>
          </div>
          <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
            <span>Duration:</span>
            <span className="text-white font-mono font-bold">{data.total4KMinutes} mins footage</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#00E5FF] h-full rounded-full" style={{ width: '78%' }} />
          </div>
        </div>

        {/* Card 2: GPU Render Compute */}
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-gray-800 hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">GPU Compute (DX12)</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-display text-white">{data.gpuComputeHours}</span>
            <span className="text-xs text-gray-400 font-mono">hrs compute</span>
          </div>
          <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
            <span>Avg Veo Latency:</span>
            <span className="text-emerald-400 font-mono font-bold">{data.averageVeoLatencySec}s</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '64%' }} />
          </div>
        </div>

        {/* Card 3: Rec.2020 Bitrate & HDR */}
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-gray-800 hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">Rec.2020 Bitrate</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-display text-white">{data.activeRec2020BitrateMbps}</span>
            <span className="text-xs text-gray-400 font-mono">Mbps</span>
          </div>
          <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
            <span>Color Precision:</span>
            <span className="text-amber-400 font-mono font-bold">10-Bit HDR 4:4:4</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Card 4: Audio Stems & Cloud Backups */}
        <div className="p-4 rounded-2xl bg-[#090D1A] border border-gray-800 hover:border-purple-400/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-gray-400">DTS Stems &amp; Drive</span>
            <Volume2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-display text-white">{data.dtsAudioStemsExported}</span>
            <span className="text-xs text-purple-400 font-mono">stems</span>
          </div>
          <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
            <span>GDrive Cloud Syncs:</span>
            <span className="text-white font-mono font-bold">{data.gdriveBackupsSynced} completed</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full" style={{ width: '92%' }} />
          </div>
        </div>
      </div>

      {/* Enterprise Cinema Master Pipeline Telemetry */}
      <div className="p-5 rounded-2xl bg-[#080B14] border border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide flex items-center gap-2">
              <span>Enterprise Cinema Master Pipeline Telemetry</span>
            </h3>
            <p className="text-xs text-gray-400">
              Hardware render pass efficiency, 10-bit Rec.2020 color fidelity, and DTS bitstream accuracy.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono font-bold">
            ★ WINDOWS RUST NATIVE ★
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Render Pass Efficiency */}
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Render Pass Efficiency</span>
              <span className="font-mono text-emerald-400 font-bold">{data.enterpriseMasterStats.renderPassEfficiency}%</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Multi-threaded Vulkan/DX12 GPU pipeline</div>
            <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${data.enterpriseMasterStats.renderPassEfficiency}%` }} />
            </div>
          </div>

          {/* Color Grade Integrity */}
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">Color Grade Integrity</span>
              <span className="font-mono text-[#00E5FF] font-bold">{data.enterpriseMasterStats.colorGradeIntegrity}%</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">Bioluminescent Rec.2020 3D LUT precision</div>
            <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#00E5FF] h-full rounded-full" style={{ width: `${data.enterpriseMasterStats.colorGradeIntegrity}%` }} />
            </div>
          </div>

          {/* DTS Bitstream Accuracy */}
          <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-300">DTS Bitstream Accuracy</span>
              <span className="font-mono text-amber-400 font-bold">{data.enterpriseMasterStats.dtsBitstreamAccuracy}%</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">DTS 7.1 / Dolby 96kHz lossless stems</div>
            <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${data.enterpriseMasterStats.dtsBitstreamAccuracy}%` }} />
            </div>
          </div>
        </div>

        {/* Enterprise Hardware Encoding Specs */}
        <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 w-full sm:w-1/2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">AV1 Hardware Master Encoding Rate:</span>
              <span className="font-mono font-bold text-white">
                {data.enterpriseMasterStats.av1HardwareEncodingFps} FPS Cinema Realtime
              </span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-gray-800">
              <div className="bg-[#00E5FF]" style={{ width: '85%' }} title="Hardware AV1/HEVC" />
              <div className="bg-emerald-400" style={{ width: '15%' }} title="Telemetry Headroom" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span> Rec.2020 HDR Peak: {data.enterpriseMasterStats.hdrPeakLuminanceNits} Nits</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Zero Frame Drop</span>
            </div>
          </div>

          <div className="text-right w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-800 pt-3 sm:pt-0 sm:pl-6">
            <div className="text-[10px] uppercase font-mono text-gray-400">Master Compliance</div>
            <div className="text-xs font-bold text-white font-mono mt-0.5">{data.enterpriseMasterStats.cinemaDeliveryCompliance}</div>
            <div className="text-[10px] text-gray-500">Hollywood Motion Pictures Master Standard</div>
          </div>
        </div>
      </div>

      {/* Live Studio Event Stream */}
      <div className="p-5 rounded-2xl bg-[#080B14] border border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00E5FF]" />
            <h3 className="text-base font-bold text-white font-display uppercase tracking-wider">
              Live Studio Event Stream &amp; Audit Trail
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            {['ALL', 'VEO_RENDER', 'COLOR_PASS', 'GDRIVE_SYNC', 'DTS_AUDIO', 'WATERMARK_DRM'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-[#00E5FF] text-black'
                    : 'bg-gray-800/80 text-gray-400 hover:text-white'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Events Table / List */}
        <div className="space-y-2">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3 rounded-xl bg-gray-900/70 border border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-gray-900 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  {evt.timestamp}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  evt.category === 'VEO_RENDER' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' :
                  evt.category === 'COLOR_PASS' ? 'bg-amber-500/20 text-amber-400' :
                  evt.category === 'GDRIVE_SYNC' ? 'bg-blue-500/20 text-blue-400' :
                  evt.category === 'DTS_AUDIO' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {evt.category}
                </span>
                <span className="text-gray-200 font-medium">{evt.message}</span>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">{evt.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
