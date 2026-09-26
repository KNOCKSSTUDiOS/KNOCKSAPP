/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileCode,
  FileText,
  FolderArchive,
  Copy,
  Check,
  X,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ColorGradingConfig, WatermarkConfig, StudioAnalyticsData } from '../types';
import { StudioBrandName } from './icons';

interface ImportExportProps {
  isOpen: boolean;
  mode: 'export' | 'import';
  onClose: () => void;
  colorConfig: ColorGradingConfig;
  watermarkConfig: WatermarkConfig;
  analyticsData: StudioAnalyticsData;
  onImportProject: (importedData: any) => void;
  onDownloadWindowsPackage: () => void;
}

export const ImportExportSuite: React.FC<ImportExportProps> = ({
  isOpen,
  mode: initialMode,
  onClose,
  colorConfig,
  watermarkConfig,
  analyticsData,
  onImportProject,
  onDownloadWindowsPackage,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>(initialMode);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; time: string; action: string; type: string }>>([
    { id: '1', time: 'Just now', action: 'Project Manifest Verified', type: 'SYSTEM' },
    { id: '2', time: '5m ago', action: 'Color Grade LUT Staged (Bioluminescent Rec.2020)', type: 'COLOR' },
    { id: '3', time: '12m ago', action: 'Dynamic Fingerprint Linked (studio-operator [0x7F4A])', type: 'SECURITY' }
  ]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const currentProjectData = {
    studio: 'KNOCKSSTUDiOS Hollywood Motion Pictures Enterprise',
    engine: '★ WINDOWS RUST NATIVE ★ & Google GenAI Veo 3.1',
    exportTimestamp: new Date().toISOString(),
    user: 'executive@knocksstudios.internal',
    license: 'KNOCKSSTUDiOS Master Cinema Enterprise',
    colorGrading: colorConfig,
    securityWatermark: watermarkConfig,
    telemetry: analyticsData,
    specs: {
      resolution: '3840x2160 4K Ultra HD',
      colorGamut: 'Rec.2020 10-Bit HDR',
      audio: 'DTS 7.1 Spatial Master Stems',
      framerate: '60.000 FPS Cinema',
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(currentProjectData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KNOCKSSTUDiOS_Master_Project_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setActivityLogs(prev => [
      { id: Date.now().toString(), time: new Date().toLocaleTimeString(), action: 'Exported Master Project (.json)', type: 'EXPORT' },
      ...prev
    ]);
  };

  const handleExportEDL = () => {
    const edlContent = `TITLE: KNOCKSSTUDiOS_4K_MASTER
FCM: NON-DROP FRAME

001  AX       V     C        00:00:00:00 00:00:15:00 01:00:00:00 01:00:15:00
* FROM CLIP: CYBERPUNK_METROPOLIS_4K_HDR.MP4
* COLOR GRADE: BIOLUMINESCENT_REC2020_CYAN
* AUDIO STEM: DTS_7_1_SURROUND_BED

002  AX       V     C        00:00:00:00 00:00:22:12 01:00:15:00 01:00:37:12
* FROM CLIP: BIOLUMINESCENT_COASTAL_ABYSS_4K.MP4
* COLOR GRADE: ULTRA_CINEMA_ANAMORPHIC
* AUDIO STEM: DOLBY_SPATIAL_ORCHESTRAL

003  AX       V     C        00:00:00:00 00:00:18:00 01:00:37:12 01:00:55:12
* FROM CLIP: ROBOT_CHROME_TRANSFORMATION_KNOCKSSTUDIOS.MP4
* COLOR GRADE: IRIDESCENT_LIQUID_METAL
* AUDIO STEM: THEATRICAL_SUB_BASS_CRESCENDO
`;
    const blob = new Blob([edlContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KNOCKSSTUDiOS_Timeline_${Date.now()}.edl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setActivityLogs(prev => [
      { id: Date.now().toString(), time: new Date().toLocaleTimeString(), action: 'Exported Cinema EDL Timeline (.edl)', type: 'EXPORT' },
      ...prev
    ]);
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentProjectData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const processImportString = (rawJson: string) => {
    try {
      setImportError(null);
      const parsed = JSON.parse(rawJson);
      onImportProject(parsed);
      setActivityLogs(prev => [
        { id: Date.now().toString(), time: new Date().toLocaleTimeString(), action: 'Imported Project Manifest (.json)', type: 'IMPORT' },
        ...prev
      ]);
      setImportJsonText('');
      onClose();
    } catch (err: any) {
      setImportError('Invalid JSON format: ' + (err?.message || 'Unable to parse project manifest'));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        processImportString(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) {
        processImportString(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#090D18] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#060810]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 flex items-center justify-center">
              {activeTab === 'export' ? <Download className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                <span>Enterprise Project {activeTab === 'export' ? 'Export' : 'Import'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                  ★ WINDOWS RUST NATIVE ★
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Seamless project state transfer, cinema timelines (EDL), and configuration backup.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-800/80 bg-[#070A14]">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-[#00E5FF] text-[#00E5FF]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Suite</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-[#00E5FF] text-[#00E5FF]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Project</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'export' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Export JSON */}
                <button
                  onClick={handleExportJSON}
                  className="p-4 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-[#00E5FF]/40 text-left transition-all cursor-pointer group"
                >
                  <FileCode className="w-5 h-5 text-[#00E5FF] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Project JSON</div>
                  <p className="text-[11px] text-gray-400 mt-1">Full state, LUTs, watermark, and telemetry</p>
                  <div className="mt-3 text-[11px] font-mono text-[#00E5FF] font-semibold flex items-center gap-1">
                    <Download className="w-3 h-3" /> Download .JSON
                  </div>
                </button>

                {/* Export EDL */}
                <button
                  onClick={handleExportEDL}
                  className="p-4 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-amber-400/40 text-left transition-all cursor-pointer group"
                >
                  <FileText className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Cinema EDL</div>
                  <p className="text-[11px] text-gray-400 mt-1">SMPTE timeline for Premiere, Resolve, Final Cut</p>
                  <div className="mt-3 text-[11px] font-mono text-amber-400 font-semibold flex items-center gap-1">
                    <Download className="w-3 h-3" /> Download .EDL
                  </div>
                </button>

                {/* Windows Rust Zip */}
                <button
                  onClick={() => {
                    onDownloadWindowsPackage();
                    setActivityLogs(prev => [
                      { id: Date.now().toString(), time: new Date().toLocaleTimeString(), action: 'Triggered Windows Rust ZIP Download', type: 'RUST' },
                      ...prev
                    ]);
                  }}
                  className="p-4 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-[#FF6A00]/40 text-left transition-all cursor-pointer group"
                >
                  <FolderArchive className="w-5 h-5 text-[#FF6A00] mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Windows Package</div>
                  <p className="text-[11px] text-gray-400 mt-1">Full Rust crate, app icon &amp; launcher scripts</p>
                  <div className="mt-3 text-[11px] font-mono text-[#FF6A00] font-semibold flex items-center gap-1">
                    <Download className="w-3 h-3" /> Download .ZIP
                  </div>
                </button>
              </div>

              {/* JSON Quick Preview & Copy */}
              <div className="p-4 rounded-xl bg-[#05070E] border border-gray-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-gray-400">Current Project Manifest Preview</span>
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1 text-[#00E5FF] hover:underline font-mono text-[11px] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw JSON'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-gray-300 bg-black/50 p-3 rounded-lg max-h-36 overflow-y-auto leading-relaxed border border-gray-800/40">
                  {JSON.stringify(currentProjectData, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drag & Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 hover:border-[#00E5FF] rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-950/40 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json,.edl"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#00E5FF] mx-auto mb-2 transition-colors" />
                <div className="text-sm font-bold text-white">Click or drag &amp; drop project manifest</div>
                <p className="text-xs text-gray-400 mt-1">Accepts .json (Studio Project) or .edl (Cinema Timeline)</p>
              </div>

              {/* Manual Paste */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Or Paste Raw Project JSON:</label>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder='{"studio": "KNOCKSSTUDiOS", "colorGrading": { ... }}'
                  rows={4}
                  className="w-full bg-[#05070E] border border-gray-800 rounded-xl p-3 text-xs font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#00E5FF] resize-none"
                />
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              <button
                onClick={() => processImportString(importJsonText)}
                disabled={!importJsonText.trim()}
                className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer"
              >
                Load Project Into Studio
              </button>
            </div>
          )}

          {/* Activity / Sync Logs */}
          <div className="border-t border-gray-800/80 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" /> Studio Activity &amp; Import Logs
              </span>
              <span className="text-[10px] font-mono text-gray-500">Enterprise Audit Log</span>
            </div>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-gray-900/50 border border-gray-800/60 font-mono">
                  <span className="text-gray-300">{log.action}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{log.type}</span>
                    <span className="text-gray-500 text-[10px]">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-800 bg-[#060810] flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <StudioBrandName className="text-xs text-white" />
            <span>&bull; Enterprise Project Exchange</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
