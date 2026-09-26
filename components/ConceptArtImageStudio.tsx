/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Upload,
  Download,
  Film,
  Play,
  RefreshCw,
  Sliders,
  CheckCircle,
  Ratio,
  Layers,
  Wand2,
  Trash2
} from 'lucide-react';
import { generateStudioImage, generateVeoVideo, blobToBase64 } from '../services/geminiService';
import { Video as VideoType } from '../types';

interface ConceptArtImageStudioProps {
  onSendToVeo?: (imageBlob: Blob, prompt: string) => void;
  onVideoCreated?: (newVideo: VideoType) => void;
}

export const ConceptArtImageStudio: React.FC<ConceptArtImageStudioProps> = ({
  onSendToVeo,
  onVideoCreated,
}) => {
  const [prompt, setPrompt] = useState(
    'Bioluminescent 4K cinema concept art: An ethereal futuristic neon observatory overlooking an infinite cosmic nebula, anamorphic lens flare, deep cyan and amber palette, photorealistic lighting.'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1' | '9:16' | '4:3' | '3:4'>('16:9');
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnimatingToVeo, setIsAnimatingToVeo] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceImage(file);
      const url = URL.createObjectURL(file);
      setSourcePreviewUrl(url);
    }
  };

  const handleClearSource = () => {
    setSourceImage(null);
    if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl);
    setSourcePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setStatusMsg(
      sourceImage
        ? 'Editing image with gemini-3.1-flash-image-preview...'
        : 'Synthesizing 4K concept art with gemini-3.1-flash-image-preview...'
    );

    try {
      const dataUrl = await generateStudioImage({
        prompt: prompt.trim(),
        sourceImageBlob: sourceImage || undefined,
        aspectRatio,
      });

      setGeneratedImageUrl(dataUrl);
      setStatusMsg('Image successfully generated!');
    } catch (err: any) {
      console.error('Image gen error:', err);
      setErrorMsg(err.message || 'Image generation failed. Check API key and quota.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Animate the generated or uploaded image into Veo 3 Video using veo-3.1-fast-generate-preview
  const handleAnimateImageToVideo = async () => {
    if (!generatedImageUrl && !sourcePreviewUrl) return;

    setIsAnimatingToVeo(true);
    setStatusMsg('Preparing image canvas for Veo 3 video generation (veo-3.1-fast-generate-preview)...');
    setErrorMsg(null);

    try {
      // Convert current image to Blob
      const targetUrl = generatedImageUrl || sourcePreviewUrl!;
      const res = await fetch(targetUrl);
      const blob = await res.blob();

      if (onSendToVeo) {
        onSendToVeo(blob, prompt);
      } else {
        const videoSrc = await generateVeoVideo({
          prompt: `Cinematic camera push-in and dynamic atmospheric movement: ${prompt}`,
          imageBlob: blob,
          aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
          onStatusUpdate: (s) => setStatusMsg(s),
        });

        if (onVideoCreated) {
          const newVideo: VideoType = {
            id: crypto.randomUUID(),
            title: `Veo 3 Motion: ${prompt.slice(0, 30)}...`,
            description: prompt,
            videoUrl: videoSrc,
            aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
            category: 'Veo 3 Cinema',
            isAiGenerated: true,
            createdAt: new Date().toLocaleTimeString(),
          };
          onVideoCreated(newVideo);
          setStatusMsg('Veo 3 video generated and added to your Cinema Showcase!');
        }
      }
    } catch (err: any) {
      console.error('Animate image to video error:', err);
      setErrorMsg(err.message || 'Failed to animate image with Veo 3.');
    } finally {
      setIsAnimatingToVeo(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `KNOCKSSTUDiOS_Concept_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-[#080B14] border border-[#00E5FF]/25 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">
              gemini-3.1-flash-image-preview
            </span>
            <span className="text-gray-500 font-mono text-xs">&bull;</span>
            <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] text-[10px] font-mono font-bold uppercase">
              Animate into Veo 3 (veo-3.1-fast-generate-preview)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide font-display text-white">
            4K Concept Art &amp; Image-to-Video Studio
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Create high-fidelity cinematic concept art, edit existing photos with text instructions, and animate them directly into 4K Veo 3 motion pictures.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Prompt */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 font-mono flex items-center justify-between">
              <span>Text Prompt / Edit Instructions</span>
              <span className="text-purple-400 font-normal text-[10px]">gemini-3.1-flash-image-preview</span>
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe scene lighting, environment, mood, characters, or edits..."
              className="w-full bg-black/70 border border-gray-700 focus:border-purple-400 rounded-xl p-3 text-sm text-gray-200 leading-relaxed transition-all font-sans"
            />
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-5 gap-1.5 font-mono text-xs">
              {(['16:9', '1:1', '9:16', '4:3', '3:4'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                    aspectRatio === ratio
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                      : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Reference / Edit Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 font-mono flex items-center justify-between">
              <span>Source / Reference Photo (Optional)</span>
              {sourceImage && (
                <button
                  onClick={handleClearSource}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </label>

            {!sourcePreviewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-700 hover:border-purple-400 rounded-xl p-4 text-center cursor-pointer transition-all bg-black/40 hover:bg-purple-950/10 flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5 text-purple-400" />
                <div className="text-xs text-gray-300 font-semibold">Upload photo to edit or animate</div>
                <div className="text-[10px] text-gray-500 font-mono">PNG, JPG, WEBP up to 20MB</div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-purple-500/40 max-h-36 bg-black flex items-center justify-center">
                <img src={sourcePreviewUrl} alt="Source Reference" className="max-h-36 object-contain" />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-purple-300 border border-purple-500/40">
                  Ready for AI Editing / Veo Animation
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleGenerateImage}
              disabled={isGenerating || isAnimatingToVeo}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Wand2 className="w-4 h-4 text-white" />
              )}
              <span>
                {isGenerating
                  ? 'Generating Image...'
                  : sourceImage
                  ? 'Edit Image with Prompt'
                  : 'Generate 4K Concept Art'}
              </span>
            </button>

            {(generatedImageUrl || sourcePreviewUrl) && (
              <button
                onClick={handleAnimateImageToVideo}
                disabled={isAnimatingToVeo || isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0077FF] hover:brightness-110 active:scale-95 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] cursor-pointer disabled:opacity-50"
              >
                {isAnimatingToVeo ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Film className="w-4 h-4 text-black" />
                )}
                <span>
                  {isAnimatingToVeo
                    ? 'Rendering Veo 3 Video...'
                    : 'Animate this Image into 4K Video (Veo 3)'}
                </span>
              </button>
            )}
          </div>

          {statusMsg && (
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-300 animate-fade-in flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse flex-shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-300 animate-fade-in">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Display Canvas Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between p-4 rounded-2xl bg-black/60 border border-gray-800 min-h-[380px]">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>Canvas Viewport &bull; {aspectRatio}</span>
            </span>

            {generatedImageUrl && (
              <button
                onClick={handleDownloadImage}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PNG</span>
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            {generatedImageUrl ? (
              <div className="relative group max-h-[420px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-purple-500/30">
                <img
                  src={generatedImageUrl}
                  alt="Generated 4K Art"
                  className="max-h-[420px] w-auto object-contain rounded-xl"
                />
              </div>
            ) : sourcePreviewUrl ? (
              <div className="relative group max-h-[420px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-gray-800">
                <img
                  src={sourcePreviewUrl}
                  alt="Source Photo"
                  className="max-h-[420px] w-auto object-contain rounded-xl opacity-90"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/80 border border-purple-400 text-purple-300 text-xs font-mono">
                    Ready to edit or animate
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto text-gray-700" />
                <p className="text-xs font-mono">No image rendered yet.</p>
                <p className="text-[11px] text-gray-600 max-w-xs">
                  Enter a prompt or upload an existing photo to synthesize concept art using gemini-3.1-flash-image-preview.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-800/80 text-[11px] font-mono text-gray-500 flex items-center justify-between">
            <span>Model: <strong className="text-purple-300">gemini-3.1-flash-image-preview</strong></span>
            <span>Veo Engine: <strong className="text-[#00E5FF]">veo-3.1-fast-generate-preview</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
