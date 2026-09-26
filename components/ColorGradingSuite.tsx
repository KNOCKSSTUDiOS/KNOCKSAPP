/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Sliders, Sparkles, Eye, Film, Sun, Palette, Zap } from 'lucide-react';
import { COLOR_GRADING_PRESETS } from '../constants';
import { ColorGradingConfig } from '../types';

interface ColorGradingSuiteProps {
  config: ColorGradingConfig;
  onChange: (updated: ColorGradingConfig) => void;
}

export const ColorGradingSuite: React.FC<ColorGradingSuiteProps> = ({ config, onChange }) => {
  const handleApplyPreset = (presetName: string) => {
    const found = COLOR_GRADING_PRESETS.find((p) => p.presetName === presetName);
    if (found) {
      onChange({
        ...config,
        presetName: found.presetName,
        lut: found.lut,
        brightness: found.brightness,
        contrast: found.contrast,
        saturation: found.saturation,
        bioluminescence: found.bioluminescence,
        anamorphicFlare: found.anamorphicFlare,
        filmGrain: found.filmGrain,
        vignette: found.vignette,
        bloom: found.bloom,
        aspectRatioMatte: found.aspectRatioMatte,
      });
    }
  };

  return (
    <div className="w-full bg-[#080B14] border border-[#00E5FF]/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>4K HDR Ultra Cinema Color Grading &bull; Bioluminescent VFX</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide text-white">
            Bioluminescent Cinema Color Suite
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Real-time optical grading: Bioluminescent Cyan/Teal glow, Pixar warm undertones, 35mm grain, anamorphic flares and HDR curve.
          </p>
        </div>

        {/* Current LUT Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 border border-gray-700">
          <Sparkles className="w-4 h-4 text-[#00E5FF]" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
            LUT: {config.presetName}
          </span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {COLOR_GRADING_PRESETS.map((preset) => (
          <button
            key={preset.presetName}
            onClick={() => handleApplyPreset(preset.presetName)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              config.presetName === preset.presetName
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {preset.presetName.split(' ')[0]}
              </span>
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    preset.lut === 'biolumi-cyan'
                      ? '#00E5FF'
                      : preset.lut === 'pixar-warm'
                      ? '#FF6A00'
                      : preset.lut === 'cyber-neon'
                      ? '#FF1493'
                      : '#778899',
                }}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{preset.description}</p>
          </button>
        ))}
      </div>

      {/* Interactive Controls & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-4 bg-[#05060A] p-5 rounded-xl border border-gray-800/80">
          {/* Bioluminescence */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#00E5FF] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Bioluminescent Emission
              </span>
              <span className="font-mono text-gray-400">{Math.round(config.bioluminescence * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.bioluminescence}
              onChange={(e) => onChange({ ...config, bioluminescence: parseFloat(e.target.value) })}
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>

          {/* HDR Contrast */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> 4K HDR Contrast
              </span>
              <span className="font-mono text-gray-400">{config.contrast.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.8"
              step="0.05"
              value={config.contrast}
              onChange={(e) => onChange({ ...config, contrast: parseFloat(e.target.value) })}
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" /> Color Saturation
              </span>
              <span className="font-mono text-gray-400">{Math.round(config.saturation * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={config.saturation}
              onChange={(e) => onChange({ ...config, saturation: parseFloat(e.target.value) })}
              className="w-full accent-[#FF6A00] cursor-pointer"
            />
          </div>

          {/* Bloom & Glow */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Optical Bloom &amp; Diffusion
              </span>
              <span className="font-mono text-gray-400">{Math.round(config.bloom * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.bloom}
              onChange={(e) => onChange({ ...config, bloom: parseFloat(e.target.value) })}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          {/* Aspect Ratio Matte Selection */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-800">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" /> Cinema Aspect Ratio Matte:
            </span>
            <div className="flex items-center gap-1.5">
              {(['2.39:1', '16:9', '9:16', 'none'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => onChange({ ...config, aspectRatioMatte: ratio })}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                    config.aspectRatioMatte === ratio
                      ? 'bg-[#00E5FF] text-black font-bold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}>
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Cinema Preview Monitor (5 cols) */}
        <div className="lg:col-span-5 bg-black rounded-xl p-3 border border-gray-800 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-2 text-[11px] font-mono text-gray-400 uppercase">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#00E5FF]" /> Live 4K HDR Monitor
            </span>
            <span className="text-emerald-400">Rec.2020 &bull; 10-Bit</span>
          </div>

          <div
            className="relative w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center bg-[#070A12]"
            style={{
              filter: `contrast(${config.contrast}) saturate(${config.saturation}) brightness(${config.brightness})`,
            }}>
            {/* Matte bars if 2.39:1 */}
            {config.aspectRatioMatte === '2.39:1' && (
              <>
                <div className="absolute top-0 left-0 right-0 h-[12%] bg-black z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-black z-20 pointer-events-none" />
              </>
            )}

            {/* Simulated 3D Cinema Frame */}
            <div
              className="w-full h-full relative flex items-center justify-center p-6 text-center"
              style={{
                boxShadow: `inset 0 0 ${config.vignette * 100}px rgba(0,0,0,0.85)`,
                background:
                  config.lut === 'biolumi-cyan'
                    ? 'radial-gradient(ellipse at 50% 50%, rgba(0,229,255,0.22), rgba(0,119,255,0.15) 50%, #030408 90%)'
                    : config.lut === 'pixar-warm'
                    ? 'radial-gradient(ellipse at 50% 50%, rgba(255,106,0,0.25), rgba(212,175,55,0.15) 50%, #030408 90%)'
                    : config.lut === 'cyber-neon'
                    ? 'radial-gradient(ellipse at 50% 50%, rgba(255,20,147,0.3), rgba(0,229,255,0.2) 50%, #030408 90%)'
                    : 'radial-gradient(ellipse at 50% 50%, rgba(120,120,130,0.18), #030408 90%)',
              }}>
              <div className="space-y-1">
                <p className="text-[#00E5FF] font-bold text-xs uppercase tracking-widest glow-cyan">
                  KNOCKSSTUDiOS VFX CORE
                </p>
                <h3 className="text-white text-lg font-black tracking-wide font-display">
                  Enterprise 4K Ultra Cinema Master
                </h3>
                <p className="text-gray-300 text-xs font-mono">
                  Bioluminescent Intensity: {Math.round(config.bioluminescence * 100)}%
                </p>
              </div>

              {/* Anamorphic streak */}
              {config.anamorphicFlare && (
                <div
                  className="absolute inset-x-0 h-0.5 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.8) 50%, transparent 100%)',
                    boxShadow: '0 0 16px rgba(0,229,255,0.9)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
