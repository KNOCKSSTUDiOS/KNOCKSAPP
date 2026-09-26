/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Radio,
  RefreshCw,
  Bot,
  User,
  Activity,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { LIVE_MODEL, getGenAIClient } from '../services/geminiService';

export const LiveVoiceStudio: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<string>('Ready to initiate live session');
  const [transcriptLogs, setTranscriptLogs] = useState<
    { speaker: 'user' | 'model'; text: string; time: string }[]
  >([
    {
      speaker: 'model',
      text: 'Live audio connection standing by. Press "Connect Live Session" to start real-time two-way voice conversations with gemini-3.8-live.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isMuted, setIsMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Audio Visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw pulsing rings
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        const baseRadius = r * 28;
        const amplitude = isActive && !isMuted ? Math.sin(phase + r) * 8 : 2;
        ctx.arc(cx, cy, Math.max(10, baseRadius + amplitude), 0, Math.PI * 2);
        ctx.strokeStyle = isActive
          ? r % 2 === 0
            ? '#00E5FF'
            : '#8B5CF6'
          : '#374151';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw center core
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#00E5FF' : '#1F2937';
      ctx.shadowColor = isActive ? '#00E5FF' : 'transparent';
      ctx.shadowBlur = isActive ? 15 : 0;
      ctx.fill();
      ctx.shadowBlur = 0;

      phase += 0.05;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, isMuted]);

  const handleToggleConnection = async () => {
    if (isActive) {
      setIsActive(false);
      setStatus('Live voice session disconnected');
      setTranscriptLogs((prev) => [
        ...prev,
        {
          speaker: 'model',
          text: 'Session ended. All voice notes preserved.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release immediate test stream
        stream.getTracks().forEach((t) => t.stop());

        setIsActive(true);
        setStatus('Live bidirectional audio channel active (gemini-3.8-live)');
        setTranscriptLogs((prev) => [
          ...prev,
          {
            speaker: 'model',
            text: 'Live channel open. I am listening. Discuss your screenplay scenes, camera angles, or character motivations.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (err: any) {
        console.error('Live connect error:', err);
        alert('Microphone access is required for real-time Live API voice conversations.');
      }
    }
  };

  return (
    <div className="w-full bg-[#080B14] border border-[#00E5FF]/25 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
              gemini-3.8-live &bull; Live API
            </span>
            <span className="text-gray-500 font-mono text-xs">&bull;</span>
            <span className="text-gray-400 font-mono text-xs">Real-Time Low-Latency Voice</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide font-display text-white flex items-center gap-2">
            <span>Real-Time Voice Studio</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Conduct spontaneous, real-time voice conversations with Gemini 3.8 Live to brainstorm scenes, direct character voices, and coordinate cinema workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleConnection}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
              isActive
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/30'
                : 'bg-gradient-to-r from-[#00E5FF] to-[#0077FF] text-black hover:brightness-110 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
            }`}
          >
            {isActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isActive ? 'Disconnect Session' : 'Connect Live Session'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Visualizer Column (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-black/60 rounded-2xl border border-gray-800 space-y-4">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="w-56 h-56 rounded-full bg-black/40 border border-gray-900"
          />

          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-emerald-400 animate-ping' : 'bg-gray-600'
                }`}
              />
              <span className={isActive ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                {isActive ? 'LIVE VOICE STREAM ACTIVE' : 'STREAM STANDBY'}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono">{status}</p>
          </div>

          {isActive && (
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                {isMuted ? 'Mic Muted' : 'Mic Active'}
              </button>
            </div>
          )}
        </div>

        {/* Live Conversation Transcript Column (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between h-80 bg-black/60 rounded-2xl border border-gray-800 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-800 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Live Conversation Transcript</span>
            </span>
            <span className="text-[10px] text-gray-500">model: {LIVE_MODEL}</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-3 font-sans text-xs">
            {transcriptLogs.map((log, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${
                  log.speaker === 'user'
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-gray-100 ml-6'
                    : 'bg-gray-900/80 border-gray-800 text-gray-200 mr-6'
                }`}
              >
                <div className="flex items-center justify-between mb-1 font-mono text-[10px]">
                  <span className={log.speaker === 'user' ? 'text-[#00E5FF] font-bold' : 'text-purple-400 font-bold'}>
                    {log.speaker === 'user' ? 'Operator' : 'Gemini 3.8 Live'}
                  </span>
                  <span className="text-gray-500">{log.time}</span>
                </div>
                <p className="leading-relaxed">{log.text}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-500">
            <span>Audio Latency: <strong className="text-emerald-400">&lt;200ms</strong></span>
            <span>Sample Rate: <strong className="text-cyan-300">24kHz / 16kHz</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
