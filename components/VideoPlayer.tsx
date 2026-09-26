/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Video, ColorGradingConfig, WatermarkConfig } from '../types';
import { PencilSquareIcon, XMarkIcon, StudioBrandName } from './icons';
import { Sparkles, Film, Disc, ShieldCheck, Clock, Lock } from 'lucide-react';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
  onEdit: (video: Video) => void;
  gradingConfig?: ColorGradingConfig;
  watermarkConfig?: WatermarkConfig;
}

/**
 * A component that renders a video player with controls, description, and edit button.
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onClose,
  onEdit,
  gradingConfig,
  watermarkConfig,
}) => {
  const [applyGrading, setApplyGrading] = useState(true);
  const [watermarkActive, setWatermarkActive] = useState(watermarkConfig?.enabled ?? true);
  const [timecodeStr, setTimecodeStr] = useState('01:24:18:12');

  // Live ticking timecode for playback burn-in
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

  const filterStyle =
    applyGrading && gradingConfig
      ? `contrast(${gradingConfig.contrast}) saturate(${gradingConfig.saturation}) brightness(${gradingConfig.brightness})`
      : 'none';

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in p-2 sm:p-4 backdrop-blur-md"
      onClick={onClose}
      aria-modal="true"
      role="dialog">
      <div
        className="bg-[#080B14] border border-[#00E5FF]/30 rounded-2xl shadow-2xl w-full max-w-5xl relative overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          if (watermarkConfig?.drmProtection) {
            e.preventDefault();
          }
        }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#05060A]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
            <StudioBrandName className="text-xs text-white" suffix="4K Ultra Cinema Player" />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 font-mono">
              DTS 7.1 / Dolby Cinema
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Watermark Toggle */}
            <button
              onClick={() => setWatermarkActive(!watermarkActive)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                watermarkActive
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-gray-800 text-gray-400'
              }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{watermarkActive ? 'Watermark: ON' : 'Watermark: OFF'}</span>
            </button>

            {gradingConfig && (
              <button
                onClick={() => setApplyGrading(!applyGrading)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  applyGrading
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                    : 'bg-gray-800 text-gray-400'
                }`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{applyGrading ? `LUT: ${gradingConfig.presetName}` : 'Bypass Grade'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Close video player">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="flex-shrink-0 p-2 sm:p-4 bg-black flex items-center justify-center relative select-none">
          <div className="w-full relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
            {/* Aspect Ratio Matte Overlay if 2.39:1 */}
            {applyGrading && (gradingConfig?.aspectRatioMatte === '2.39:1' || watermarkConfig?.aspectRatioMatte) && (
              <>
                <div className="absolute top-0 inset-x-0 h-[12%] bg-black z-30 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-[12%] bg-black z-30 pointer-events-none" />
              </>
            )}

            <video
              key={video.id}
              className="w-full h-full object-contain"
              style={{ filter: filterStyle }}
              src={video.videoUrl}
              controls
              autoPlay
              loop
              aria-label={video.title}
            />

            {/* DYNAMIC WATERMARK OVERLAY */}
            {watermarkActive && watermarkConfig && (
              <div
                className="absolute inset-0 pointer-events-none z-25 overflow-hidden flex items-center justify-center"
                style={{ opacity: watermarkConfig.opacity / 100 }}>
                {watermarkConfig.position === 'center-diagonal' && (
                  <div className="transform -rotate-25 text-center whitespace-nowrap">
                    <div
                      className={`font-black font-mono tracking-widest uppercase ${
                        watermarkConfig.color === 'cyan' ? 'text-[#00E5FF]' :
                        watermarkConfig.color === 'amber' ? 'text-amber-400' :
                        watermarkConfig.color === 'slate' ? 'text-gray-400' : 'text-white'
                      }`}
                      style={{ fontSize: `${watermarkConfig.fontSize * 1.5}px` }}>
                      {watermarkConfig.text}
                    </div>
                    {watermarkConfig.showFingerprint && (
                      <div className="text-[10px] font-mono text-gray-400 mt-1">
                        {watermarkConfig.fingerprintId}
                      </div>
                    )}
                  </div>
                )}

                {watermarkConfig.position === 'bottom-right' && (
                  <div className="absolute bottom-4 right-4 text-right bg-black/60 px-3 py-1.5 rounded border border-gray-800 backdrop-blur-sm">
                    <div
                      className={`font-black font-mono ${
                        watermarkConfig.color === 'cyan' ? 'text-[#00E5FF]' :
                        watermarkConfig.color === 'amber' ? 'text-amber-400' :
                        watermarkConfig.color === 'slate' ? 'text-gray-400' : 'text-white'
                      }`}
                      style={{ fontSize: `${watermarkConfig.fontSize}px` }}>
                      {watermarkConfig.text}
                    </div>
                    {watermarkConfig.showFingerprint && (
                      <div className="text-[9px] font-mono text-gray-400">
                        {watermarkConfig.fingerprintId}
                      </div>
                    )}
                  </div>
                )}

                {watermarkConfig.position === 'top-left' && (
                  <div className="absolute top-4 left-4 text-left bg-black/60 px-3 py-1.5 rounded border border-gray-800 backdrop-blur-sm">
                    <div
                      className={`font-black font-mono ${
                        watermarkConfig.color === 'cyan' ? 'text-[#00E5FF]' :
                        watermarkConfig.color === 'amber' ? 'text-amber-400' :
                        watermarkConfig.color === 'slate' ? 'text-gray-400' : 'text-white'
                      }`}
                      style={{ fontSize: `${watermarkConfig.fontSize}px` }}>
                      {watermarkConfig.text}
                    </div>
                  </div>
                )}

                {watermarkConfig.position === 'bottom-bar' && (
                  <div className="absolute bottom-3 inset-x-3 bg-black/80 px-4 py-1.5 rounded border border-gray-800 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#00E5FF]">{watermarkConfig.text}</span>
                    {watermarkConfig.showFingerprint && (
                      <span className="text-[10px] text-gray-400">{watermarkConfig.fingerprintId}</span>
                    )}
                  </div>
                )}

                {watermarkConfig.position === 'grid-tiled' && (
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-6 gap-6 items-center justify-items-center">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="transform -rotate-15 text-center">
                        <div className="font-black font-mono text-xs text-[#00E5FF]">
                          {watermarkConfig.text}
                        </div>
                        <div className="text-[8px] font-mono text-gray-500">
                          {watermarkConfig.fingerprintId}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Timecode Burn-in */}
                {watermarkConfig.showTimecode && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded bg-black/85 border border-gray-800 text-white font-mono text-xs font-bold tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#00E5FF] animate-pulse" />
                    <span>{timecodeStr}</span>
                  </div>
                )}
              </div>
            )}

            {/* Anamorphic Flare Streak simulation */}
            {applyGrading && gradingConfig?.anamorphicFlare && (
              <div
                className="absolute inset-x-0 top-1/2 h-0.5 pointer-events-none z-20"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.4) 50%, transparent 100%)',
                }}
              />
            )}
          </div>
        </div>

        {/* Bottom Metadata & Controls */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto bg-[#070912]">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {video.title}
                </h3>
                {video.genre && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-semibold">
                    {video.genre}
                  </span>
                )}
                {video.rating && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                    {video.rating}
                  </span>
                )}
              </div>

              {video.director && (
                <div className="text-xs text-[#00E5FF] font-semibold flex items-center gap-1.5 font-mono">
                  <span>Directed by {video.director}</span>
                  {video.releaseDate && (
                    <>
                      <span className="text-gray-600">&bull;</span>
                      <span className="text-gray-400">Release: {video.releaseDate}</span>
                    </>
                  )}
                </div>
              )}

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-gray-500">
                <span className="text-[#00E5FF]">Veo 3 4K HDR</span>
                <span>&bull;</span>
                <span className="text-amber-400">Enterprise Cinema Master</span>
                <span>&bull;</span>
                <span>Stereo &amp; DTS 7.1 Audio Stream</span>
                {watermarkConfig?.drmProtection && (
                  <>
                    <span>&bull;</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> DRM Protected
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => onEdit(video)}
              className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-[#00E5FF] to-[#0077FF] text-black font-bold py-2.5 px-4 rounded-xl hover:brightness-110 transition-all text-xs uppercase tracking-wider cursor-pointer">
              <PencilSquareIcon className="w-4 h-4" />
              <span>Edit &amp; Metadata</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

