/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Disc, Radio, Music, Waves } from 'lucide-react';
import { generateLyriaMusic, LYRIA_CLIP_MODEL, LYRIA_PRO_MODEL } from '../services/geminiService';
import { StudioBrandName } from './icons';
import { AudioTranscriberButton } from './AudioTranscriberButton';

export const SpatialAudioSuite: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isDtsSurround, setIsDtsSurround] = useState(true);
  const [volume, setVolume] = useState(0.75);
  const [isGeneratingLyria, setIsGeneratingLyria] = useState(false);
  const [lyriaAudioUrl, setLyriaAudioUrl] = useState<string | null>(null);
  const [lyriaStatus, setLyriaStatus] = useState<string | null>(null);
  const [lyriaMode, setLyriaMode] = useState<'clip' | 'pro'>('clip');
  const [lyriaPrompt, setLyriaPrompt] = useState(
    'A cinematic, raw acoustic track with fingerpicked nylon-string guitar, melancholic piano chords, deep cello, and an emotional starlit night atmosphere in 4K cinema DTS sound.'
  );

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const tracks = [
    {
      id: 'hurt-acoustic',
      title: 'KNOCKSSTUDiOS: Master Cinema Solitude (Acoustic Guitar & Melancholic Piano)',
      mood: 'Raw Emotional Acoustic & Strings',
      tempo: '68 BPM',
      description: 'Fingerpicked acoustic guitar layered with lonely upright piano chords in A minor, deep cello, and sub-bass resonance.',
      key: 'A Minor',
    },
    {
      id: 'trio-serenade',
      title: 'Enterprise Cyber Serenade: Spatial Acoustic Trio',
      mood: 'Warm Acoustic Strings & Dynamic Panning',
      tempo: '92 BPM',
      description: 'Lively acoustic trio nylon guitar rhythms and gentle harmonies calibrated for 7.1 theatrical surround.',
      key: 'G Major',
    },
    {
      id: 'balcony-stars',
      title: 'Orbital Horizon & Starlit Twilight Bed',
      mood: 'Atmospheric Ambient & Night Reverie',
      tempo: '56 BPM',
      description: 'Soft ethereal synth pads, distant city bells, cricket chirps, and gentle sub-bass hum under bright moonlit skies.',
      key: 'D Minor',
    },
    {
      id: 'dts-cinema',
      title: 'Dolby DTS 7.1 Cinema Sub-Bass Theater Sweep',
      mood: 'Ultra-Low 40Hz Surround Simulation',
      tempo: 'Freeform',
      description: 'Spatial theatrical surround panning with sub-woofer bass rumble and crisp high-frequency binaural acoustic resonance.',
      key: 'Cinema Surround',
    },
  ];

  // Initialize Web Audio synthesizer
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const gain = ctx.createGain();
      gain.gain.value = volume;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      gain.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      gainNodeRef.current = gain;
      analyserRef.current = analyser;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // Acoustic Note Pluck synthesizer simulation
  const playGuitarOrPianoNote = (freq: number, type: 'triangle' | 'sine' | 'sawtooth', duration: number, delay = 0) => {
    const ctx = audioCtxRef.current;
    const masterGain = gainNodeRef.current;
    if (!ctx || !masterGain) return;

    setTimeout(() => {
      try {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Spatial panning for DTS surround
        if (isDtsSurround && ctx.createStereoPanner) {
          const panner = ctx.createStereoPanner();
          panner.pan.value = (Math.random() - 0.5) * 1.6;
          osc.connect(noteGain);
          noteGain.connect(panner);
          panner.connect(masterGain);
        } else {
          osc.connect(noteGain);
          noteGain.connect(masterGain);
        }

        const now = ctx.currentTime;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.25, now + 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.start(now);
        osc.stop(now + duration);
      } catch (e) {
        // ignore
      }
    }, delay);
  };

  // Progression loop
  const startTrackSynthesizer = (trackIdx: number) => {
    initAudio();

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    let step = 0;
    // Johnny Cash "Hurt" inspired acoustic guitar chords: Am (A, C, E, G), C (C, E, G), D (D, F#, A)
    const amNotes = [220, 261.63, 329.63, 392.0];
    const cNotes = [261.63, 329.63, 392.0, 523.25];
    const dNotes = [293.66, 369.99, 440.0, 587.33];
    const fNotes = [174.61, 220.0, 261.63, 349.23];

    const chordList = [amNotes, cNotes, dNotes, fNotes];

    const intervalTime = trackIdx === 1 ? 400 : trackIdx === 2 ? 1200 : trackIdx === 3 ? 900 : 600;

    timerRef.current = window.setInterval(() => {
      const chord = chordList[step % chordList.length];
      const noteFreq = chord[Math.floor(Math.random() * chord.length)];

      if (trackIdx === 0) {
        // Hurt Acoustic guitar arpeggio
        playGuitarOrPianoNote(noteFreq, 'triangle', 1.8);
        if (step % 4 === 0) {
          playGuitarOrPianoNote(chord[0] / 2, 'sine', 2.4, 100); // Deep bass note
        }
      } else if (trackIdx === 1) {
        // Trio Serenade
        playGuitarOrPianoNote(noteFreq, 'triangle', 0.8);
        playGuitarOrPianoNote(chord[1], 'sawtooth', 0.6, 120);
      } else if (trackIdx === 2) {
        // Melancholic Balcony Ambient
        playGuitarOrPianoNote(noteFreq * 1.5, 'sine', 3.2);
        playGuitarOrPianoNote(chord[0], 'sine', 3.5, 200);
      } else {
        // DTS 7.1 Sub-bass theater sweep
        playGuitarOrPianoNote(45 + (step % 5) * 15, 'sine', 2.5);
        playGuitarOrPianoNote(noteFreq * 2, 'triangle', 1.2, 300);
      }

      step++;
    }, intervalTime);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startTrackSynthesizer(currentTrackIndex);
    }
  };

  const handleSelectTrack = (idx: number) => {
    setCurrentTrackIndex(idx);
    if (isPlaying) {
      startTrackSynthesizer(idx);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVol;
    }
  };

  // Lyria 3 Music Generation
  const handleGenerateLyria = async () => {
    if (!lyriaPrompt.trim()) return;
    setIsGeneratingLyria(true);
    setLyriaStatus(
      lyriaMode === 'pro'
        ? 'Calling lyria-3-pro-preview for full-length theatrical score...'
        : 'Calling lyria-3-clip-preview for 30s cinema music clip...'
    );
    try {
      const url = await generateLyriaMusic(lyriaPrompt.trim(), lyriaMode);
      setLyriaAudioUrl(url);
      setLyriaStatus(
        lyriaMode === 'pro'
          ? 'Full-length track generated successfully with lyria-3-pro-preview!'
          : 'Music clip generated successfully with lyria-3-clip-preview!'
      );
    } catch (err: any) {
      console.warn('Lyria music generation note:', err?.message || err);
      setLyriaStatus(`Lyria Note: ${err?.message || 'Paid API key required. Synthesizer mode active.'}`);
    } finally {
      setIsGeneratingLyria(false);
    }
  };

  // Audio spectrum visualizer animation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderSpectrum = () => {
      animId = requestAnimationFrame(renderSpectrum);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#0077FF');
          gradient.addColorStop(0.5, '#00E5FF');
          gradient.addColorStop(1, '#FF6A00');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
          x += barWidth;
        }
      } else {
        // Idle ambient gentle wave
        const count = 32;
        const barWidth = canvas.width / count;
        const time = Date.now() * 0.003;
        for (let i = 0; i < count; i++) {
          const h = (Math.sin(time + i * 0.3) * 0.5 + 0.5) * (isPlaying ? 28 : 10) + 4;
          ctx.fillStyle = isPlaying ? '#00E5FF' : '#1C253B';
          ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 2, h);
        }
      }
    };
    renderSpectrum();

    return () => {
      cancelAnimationFrame(animId);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="w-full bg-[#080B14] border border-[#00E5FF]/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A00]/10 text-[#FF6A00] text-xs font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>Dolby Digital &bull; DTS 7.1 Surround &bull; Lyria 3 Acoustic Score</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide text-white">
            DTS &amp; Dolby Digital Cinema Audio Suite
          </h2>
          <p className="text-gray-400 text-sm mt-1 max-w-3xl">
            Live acoustic fingerpicked guitar, melancholic piano, and spatial 3D surround soundscapes calibrated for <StudioBrandName className="text-white text-sm" /> 4K Ultra Cinema and DTS 7.1 theatrical master stems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* DTS Toggle */}
          <button
            onClick={() => setIsDtsSurround(!isDtsSurround)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              isDtsSurround
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
            }`}>
            DTS 7.1 Spatial: {isDtsSurround ? 'ON' : 'OFF'}
          </button>

          {/* Master Play Button */}
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF8C00] text-white font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,106,0,0.4)] cursor-pointer">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause Audio' : 'Play Theme'}</span>
          </button>
        </div>
      </div>

      {/* Visualizer Canvas & Track Player Info */}
      <div className="my-6 p-4 rounded-xl bg-[#05060A] border border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-1/2 space-y-2">
          <div className="flex items-center gap-2">
            <Disc className={`w-5 h-5 text-[#00E5FF] ${isPlaying ? 'animate-spin' : ''}`} />
            <h3 className="text-white font-bold text-base tracking-wide">
              {tracks[currentTrackIndex].title}
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {tracks[currentTrackIndex].description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-gray-500 font-mono">
            <span>Key: <strong className="text-gray-300">{tracks[currentTrackIndex].key}</strong></span>
            <span>&bull;</span>
            <span>Mood: <strong className="text-[#FF6A00]">{tracks[currentTrackIndex].mood}</strong></span>
            <span>&bull;</span>
            <span>Tempo: <strong className="text-cyan-300">{tracks[currentTrackIndex].tempo}</strong></span>
          </div>
        </div>

        {/* Live Audio Spectrum Canvas */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={380}
            height={64}
            className="w-full h-16 rounded-lg bg-[#030408] border border-gray-800"
          />
          <div className="w-full flex items-center justify-between mt-2 px-1 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-24 accent-[#FF6A00] cursor-pointer"
              />
            </div>
            <span className="font-mono text-[11px] text-[#00E5FF]">
              {isDtsSurround ? 'DTS 7.1 Binaural Spatial Active' : 'Stereo Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Soundtracks List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tracks.map((track, idx) => (
          <button
            key={track.id}
            onClick={() => handleSelectTrack(idx)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              currentTrackIndex === idx
                ? 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
            }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider truncate pr-2">
                Track 0{idx + 1}
              </span>
              <Music className={`w-3.5 h-3.5 ${currentTrackIndex === idx ? 'text-[#00E5FF]' : 'text-gray-500'}`} />
            </div>
            <h4 className="text-xs font-semibold text-gray-200 mt-1 line-clamp-1">{track.title}</h4>
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{track.mood}</p>
          </button>
        ))}
      </div>

      {/* Lyria 3 AI Generation Section */}
      <div className="mt-6 pt-5 border-t border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" /> Lyria 3 Neural Cinema Music Generation
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Compose custom soundtrack scores using Google Lyria models: short clips (lyria-3-clip-preview) or full-length tracks (lyria-3-pro-preview).
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 bg-black/70 p-1 rounded-xl border border-gray-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setLyriaMode('clip')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                lyriaMode === 'clip'
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Clip (30s) &bull; lyria-3-clip-preview
            </button>
            <button
              type="button"
              onClick={() => setLyriaMode('pro')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                lyriaMode === 'pro'
                  ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Full Track &bull; lyria-3-pro-preview
            </button>
          </div>
        </div>

        {/* Prompt Input & Audio Transcription */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
              Soundtrack Prompt &amp; Instrumentation
            </label>
            <AudioTranscriberButton
              onTranscribed={(text) => setLyriaPrompt((prev) => (prev ? `${prev} ${text}` : text))}
              buttonLabel="Speak Prompt"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={lyriaPrompt}
              onChange={(e) => setLyriaPrompt(e.target.value)}
              placeholder="e.g. Ambient fingerpicked guitar, melancholic piano chords, cello in DTS 7.1..."
              className="flex-1 bg-black/70 border border-gray-700 focus:border-[#00E5FF] rounded-xl px-4 py-2.5 text-xs text-white"
            />
            <button
              onClick={handleGenerateLyria}
              disabled={isGeneratingLyria || !lyriaPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0077FF] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Waves className="w-4 h-4 text-black" />
              <span>{isGeneratingLyria ? 'Composing...' : `Generate with Lyria (${lyriaMode})`}</span>
            </button>
          </div>

          {lyriaStatus && (
            <p className="text-xs text-[#00E5FF] font-mono mt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lyriaStatus}</span>
            </p>
          )}
        </div>
      </div>

      {lyriaAudioUrl && (
        <div className="mt-3 p-3 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-4">
          <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Lyria Track Ready:</span>
          <audio src={lyriaAudioUrl} controls className="h-8 flex-1" />
        </div>
      )}
    </div>
  );
};
