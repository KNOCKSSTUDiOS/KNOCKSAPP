/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef } from 'react';
import {
  Video,
  Upload,
  Sparkles,
  Play,
  Film,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Clock,
  Ratio
} from 'lucide-react';
import { generateVeoVideo } from '../services/geminiService';
import { Video as VideoType } from '../types';
import { AudioTranscriberButton } from './AudioTranscriberButton';

interface VeoVideoStudioProps {
  initialPrompt?: string;
  onVideoCreated: (newVideo: VideoType) => void;
}

export const VeoVideoStudio: React.FC<VeoVideoStudioProps> = ({
  initialPrompt = '',
  onVideoCreated,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt ||
      'Pixar 3D animation style: Late country night with bright full moon and clear starry sky. Alex, a handsome young man in a dark hoodie with neat beard and neck tattoos, stands outside a rustic garage near his broken down car, looking over at a vibrant glowing taco food stand with steam rising into the chill air. 4K HDR ultra cinema, bioluminescent teal and amber illumination.'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync initial prompt when changed from parent
  React.useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStatus('Connecting to Veo 3 neural video cluster...');

    try {
      const videoSrc = await generateVeoVideo({
        prompt: prompt.trim(),
        imageBlob: selectedImage || undefined,
        aspectRatio,
        onStatusUpdate: (status) => setGenerationStatus(status),
      });

      const newVideo: VideoType = {
        id: crypto.randomUUID(),
        title: selectedImage
          ? 'Veo 3 Image Animation &bull; 4K Motion'
          : `Veo 3: ${prompt.slice(0, 38)}...`,
        description: prompt,
        videoUrl: videoSrc,
        aspectRatio,
        category: 'Veo 3 Cinema',
        tag: '4K Ultra HDR',
        isAiGenerated: true,
        createdAt: new Date().toLocaleTimeString(),
      };

      onVideoCreated(newVideo);
      setGenerationStatus('Video successfully generated and loaded into Cinema Gallery!');
    } catch (err: any) {
      console.error('Veo generation error:', err);
      setErrorMsg(
        err?.message ||
          'Veo 3 requires an active Google Cloud Project with Paid Tier access. Check Settings > Secrets.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-[#080B14] border border-[#00E5FF]/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-2">
            <Video className="w-3.5 h-3.5" />
            <span>Veo 3 Video Generator &bull; Animate Images &bull; 4K Cinema</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide text-white">
            Veo 3 Film Production Engine
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Generate 4K HDR Ultra Cinema motion pictures from text or animate character concept art into full video.
          </p>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-2 bg-gray-900 p-1.5 rounded-xl border border-gray-800">
          <span className="text-xs text-gray-400 px-2 font-mono flex items-center gap-1">
            <Ratio className="w-3.5 h-3.5" /> Aspect:
          </span>
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              aspectRatio === '16:9' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}>
            16:9 Landscape
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              aspectRatio === '9:16' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}>
            9:16 Portrait
          </button>
        </div>
      </div>

      {/* Main Studio Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Prompt Input (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase font-bold text-gray-400 tracking-wider">
                Veo 3 Cinematic Prompt &amp; Staging Directive:
              </label>
              <AudioTranscriberButton
                onTranscribed={(text) => setPrompt((prev) => (prev ? `${prev} ${text}` : text))}
                buttonLabel="Dictate Prompt"
              />
            </div>
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the 4K scene, camera movement, Pixar characters (Alex, Leah), lighting, atmosphere..."
              className="w-full bg-[#05060A] border border-gray-800 focus:border-[#00E5FF] rounded-xl p-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E5FF] transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Quick Prompt Presets */}
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
              Enterprise Cinema Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setPrompt(
                    'Photorealistic 4K cinema shot: Knocturnal in tactical graphene combat duster scanning the holographic telemetry grid across a futuristic star station docking bay. Volumetric amber rim lighting, Rec.2020 HDR ultra cinema.'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-xs text-gray-300 transition-colors cursor-pointer">
                Orbital Relay Approach
              </button>
              <button
                onClick={() =>
                  setPrompt(
                    'Cinematic wide angle: Aurora navigating an illuminated sub-aquatic crystal trench facility surrounded by millions of bioluminescent cyan aquatic organisms, volumetric light shafts, anamorphic lens flare. 4K HDR ultra cinema.'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-xs text-gray-300 transition-colors cursor-pointer">
                Bioluminescent Abyss
              </button>
              <button
                onClick={() =>
                  setPrompt(
                    'Worn bipedal robot rises from dark junkyard dust, struck by brilliant white light. Instantly transforms into dazzling, iridescent pink chrome—walking powerfully toward a flickering "KNOCKSSTUDIOS" logo. Full screen rainbow smoke erupts. 3D fully rendered.'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-xs text-purple-300 transition-colors cursor-pointer">
                Robot Chrome Transformation
              </button>
            </div>
          </div>
        </div>

        {/* Image Reference for Animate Image to Video (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl bg-[#05060A] border border-gray-800/80">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#00E5FF]" /> Image to Video Reference
              </span>
              {selectedImage && (
                <button
                  onClick={handleRemoveImage}
                  className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer">
                  Remove
                </button>
              )}
            </div>

            {imagePreviewUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-700">
                <img src={imagePreviewUrl} alt="Upload" className="w-full h-36 object-cover" />
                <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/70 text-[10px] text-green-400 font-mono">
                  Ready to Animate
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-800 hover:border-[#00E5FF]/40 rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-900/40">
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-300">Upload Photo or Sketch</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Veo 3 will animate this into motion</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#0077FF] to-[#FF6A00] text-black font-black uppercase tracking-wider text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 cursor-pointer">
            {isGenerating ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Generating Film...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-black" />
                <span>{selectedImage ? 'Animate Image with Veo 3' : 'Generate 4K Video'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status or Error Banner */}
      {generationStatus && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
          <span>{generationStatus}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
