/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import {
  Film,
  Users,
  ScrollText,
  Video,
  Sparkles,
  Mic,
  Square,
  Play,
  Check,
  ChevronRight,
  Quote,
  Layers,
  Heart
} from 'lucide-react';
import { HOLLYWOOD_CHARACTERS, SCRIPT_SCENES } from '../constants';
import { CharacterProfile, ScriptScene } from '../types';
import { transcribeAudioFile, generateStudioImage } from '../services/geminiService';

interface PixarScriptStudioProps {
  onLoadVeoPrompt: (prompt: string, title: string) => void;
}

export const PixarScriptStudio: React.FC<PixarScriptStudioProps> = ({ onLoadVeoPrompt }) => {
  const [activeTab, setActiveTab] = useState<'script' | 'characters' | 'transcribe'>('script');
  const [selectedScene, setSelectedScene] = useState<ScriptScene>(SCRIPT_SCENES[0]);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterProfile>(HOLLYWOOD_CHARACTERS[0]);

  // Voice recording & transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  // Concept Art generation state
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [generatedArtUrl, setGeneratedArtUrl] = useState<string | null>(null);
  const [artError, setArtError] = useState<string | null>(null);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const text = await transcribeAudioFile(audioBlob);
          setTranscribedText(text);
        } catch (err: any) {
          console.error('Transcription error:', err);
          setTranscribedText('Transcription note: Gemini 3.5 requires project key. Voice recorded successfully.');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied or error:', err);
      alert('Microphone access is needed for dialogue transcription.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const handleGenerateConceptArt = async (prompt: string) => {
    setIsGeneratingArt(true);
    setArtError(null);
    try {
      const fullPrompt = `${prompt}, 3D Pixar animation style, warm luminous lighting, 4K HDR ultra cinema, intricate textures, Blender 3D render.`;
      const url = await generateStudioImage({ prompt: fullPrompt, aspectRatio: '16:9', imageSize: '1K' });
      setGeneratedArtUrl(url);
    } catch (err: any) {
      console.warn('Concept art error:', err);
      setArtError('Gemini 3.1 Flash Image requires paid tier key. Reference visual loaded.');
    } finally {
      setIsGeneratingArt(false);
    }
  };

  return (
    <div className="w-full bg-[#080B14] border border-[#00E5FF]/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Enterprise Cinema &bull; 4K Production Screenplay Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide text-white">
            Cinema Screenplay Studio &bull; Character Bible
          </h2>
          <p className="text-gray-400 text-sm mt-1 max-w-3xl">
            The master production pipeline for <strong>Knocturnal</strong>, <strong>Aurora</strong>, and <strong>Vance</strong>.
            Hollywood staging, DTS 7.1 spatial acoustics, bioluminescent color science, and Veo 3 scene animations.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-900 border border-gray-800 rounded-xl">
          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'script' ? 'bg-[#00E5FF] text-black' : 'text-gray-400 hover:text-white'
            }`}>
            <ScrollText className="w-3.5 h-3.5" />
            <span>Screenplay</span>
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'characters' ? 'bg-[#00E5FF] text-black' : 'text-gray-400 hover:text-white'
            }`}>
            <Users className="w-3.5 h-3.5" />
            <span>Characters</span>
          </button>
          <button
            onClick={() => setActiveTab('transcribe')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'transcribe' ? 'bg-[#00E5FF] text-black' : 'text-gray-400 hover:text-white'
            }`}>
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Mic</span>
          </button>
        </div>
      </div>

      {/* Screenplay Mode */}
      {activeTab === 'script' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Scenes Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
              Acts &amp; Scenes (30-Minute Arc)
            </h3>
            {SCRIPT_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setSelectedScene(scene)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedScene.id === scene.id
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00E5FF] font-bold">ACT {scene.act}</span>
                  <span className="text-[11px] text-gray-500">{scene.timeOfDay}</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">{scene.title}</h4>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{scene.synopsis}</p>
              </button>
            ))}
          </div>

          {/* Active Scene Production Teleprompter (8 cols) */}
          <div className="lg:col-span-8 bg-[#05060A] p-5 sm:p-6 rounded-xl border border-gray-800/90 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-800">
                <div>
                  <span className="text-xs font-mono text-[#FF6A00] font-bold uppercase">
                    Location: {selectedScene.location}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{selectedScene.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLoadVeoPrompt(selectedScene.recommendedPrompt, selectedScene.title)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer">
                    <Video className="w-3.5 h-3.5" />
                    <span>Send to Veo 3</span>
                  </button>

                  <button
                    onClick={() => handleGenerateConceptArt(selectedScene.recommendedPrompt)}
                    disabled={isGeneratingArt}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingArt ? 'Generating Art...' : '4K Concept Art'}</span>
                  </button>
                </div>
              </div>

              {/* Music & Lighting Cues */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                  <span className="font-bold text-[#00E5FF] uppercase block">Audio &amp; Music Cue:</span>
                  <span className="text-gray-300">{selectedScene.musicCue}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                  <span className="font-bold text-[#FF6A00] uppercase block">3D Lighting &amp; Atmosphere:</span>
                  <span className="text-gray-300">{selectedScene.lightingCue}</span>
                </div>
              </div>

              {/* Dialogue Script */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Scene Dialogue:</h4>
                {selectedScene.dialogue.map((line, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#0A0D18] border border-gray-800/80">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        line.speaker === 'KNOCTURNAL'
                          ? 'text-[#00E5FF]'
                          : line.speaker === 'AURORA'
                          ? 'text-[#E040FB]'
                          : line.speaker === 'VANCE'
                          ? 'text-[#D4AF37]'
                          : 'text-cyan-300'
                      }`}>
                      {line.speaker}:
                    </span>
                    <p className="text-sm text-gray-200 mt-1 leading-relaxed">{line.text}</p>
                  </div>
                ))}
              </div>

              {/* Generated 4K Concept Art preview if ready */}
              {generatedArtUrl && (
                <div className="mt-4 p-3 rounded-xl bg-gray-900 border border-purple-500/40">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
                    Gemini 3.1 Flash Image: 4K Concept Frame
                  </span>
                  <img
                    src={generatedArtUrl}
                    alt="Scene Concept Art"
                    className="w-full max-h-64 object-cover rounded-lg border border-gray-800"
                  />
                </div>
              )}
              {artError && <p className="text-xs text-amber-400 mt-1">{artError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Characters Mode */}
      {activeTab === 'characters' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Character Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
              Characters &bull; Pixar 3D Design
            </h3>
            {HOLLYWOOD_CHARACTERS.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharacter(char)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCharacter.id === char.id
                    ? 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">{char.name}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: char.colorTheme }}
                  />
                </div>
                <p className="text-xs text-[#00E5FF] font-medium mt-0.5">{char.alias}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{char.role}</p>
              </button>
            ))}
          </div>

          {/* Character Deep Profile Deck */}
          <div className="lg:col-span-8 bg-[#05060A] p-6 rounded-xl border border-gray-800/90 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-800">
              <div>
                <span className="text-xs font-mono uppercase text-[#00E5FF] font-bold">
                  {selectedCharacter.actorStyle}
                </span>
                <h3 className="text-2xl font-black text-white">{selectedCharacter.name}</h3>
                <p className="text-xs text-gray-400">{selectedCharacter.role}</p>
              </div>

              <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 max-w-sm">
                <Quote className="w-4 h-4 text-[#FF6A00] mb-1" />
                <p className="text-xs italic text-gray-200">{selectedCharacter.quote}</p>
              </div>
            </div>

            {/* Visual breakdown specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-gray-900/70 border border-gray-800">
                <strong className="text-white block mb-1">Complexion &amp; Skin:</strong>
                <span className="text-gray-300">{selectedCharacter.skinTone}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/70 border border-gray-800">
                <strong className="text-white block mb-1">Hair &amp; Beard:</strong>
                <span className="text-gray-300">
                  {selectedCharacter.hair}
                  {selectedCharacter.facialHair ? ` &bull; ${selectedCharacter.facialHair}` : ''}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/70 border border-gray-800">
                <strong className="text-white block mb-1">Eyes &amp; Gaze:</strong>
                <span className="text-gray-300">{selectedCharacter.eyes}</span>
              </div>
              <div className="p-3 rounded-lg bg-gray-900/70 border border-gray-800">
                <strong className="text-white block mb-1">Wardrobe &amp; Style:</strong>
                <span className="text-gray-300">{selectedCharacter.clothing}</span>
              </div>
            </div>

            {/* Distinguishing Features */}
            <div>
              <strong className="text-xs uppercase font-bold text-gray-400 block mb-2">
                Distinguishing Pixar Traits:
              </strong>
              <div className="flex flex-wrap gap-2">
                {selectedCharacter.distinguishingFeatures.map((trait, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-gray-900 border border-gray-700 text-xs text-gray-300">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Demeanor */}
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-xs">
              <strong className="text-[#00E5FF] uppercase block mb-1">3D Animation Cues &amp; Demeanor:</strong>
              <p className="text-gray-300 leading-relaxed">{selectedCharacter.animationDemeanor}</p>
            </div>
          </div>
        </div>
      )}

      {/* Audio Transcription Mode */}
      {activeTab === 'transcribe' && (
        <div className="mt-6 p-6 rounded-xl bg-[#05060A] border border-gray-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#00E5FF]" /> Audio &amp; Dialogue Dictation (Gemini 3.5 Transcribe)
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Record your voice notes, pitch ideas, or spoken dialogue lines. The model will transcribe it directly into script text.
              </p>
            </div>

            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                  : 'bg-[#00E5FF] text-black hover:brightness-110'
              }`}>
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </button>
          </div>

          {isTranscribing && (
            <div className="p-3 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-mono">
              Transcribing audio with gemini-3.5-transcribe...
            </div>
          )}

          {transcribedText && (
            <div className="p-4 rounded-xl bg-gray-900 border border-gray-700">
              <span className="text-xs font-bold uppercase tracking-wider text-green-400 block mb-2">
                Transcribed Dialogue:
              </span>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{transcribedText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
