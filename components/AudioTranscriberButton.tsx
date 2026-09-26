/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef } from 'react';
import { Mic, MicOff, RefreshCw, Sparkles } from 'lucide-react';
import { transcribeAudioFile } from '../services/geminiService';

interface AudioTranscriberButtonProps {
  onTranscribed: (text: string) => void;
  className?: string;
  buttonLabel?: string;
}

export const AudioTranscriberButton: React.FC<AudioTranscriberButtonProps> = ({
  onTranscribed,
  className = '',
  buttonLabel,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        setIsTranscribing(true);
        try {
          const transcribedText = await transcribeAudioFile(audioBlob);
          if (transcribedText) {
            onTranscribed(transcribedText);
          }
        } catch (err) {
          console.error('Transcription error:', err);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone permission required for audio transcription (gemini-3.5-transcribe).');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (isTranscribing) {
    return (
      <div
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-mono animate-pulse ${className}`}
        title="Transcribing with gemini-3.5-transcribe..."
      >
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Transcribing (gemini-3.5-transcribe)...</span>
      </div>
    );
  }

  if (isRecording) {
    return (
      <button
        type="button"
        onClick={handleStopRecording}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono animate-pulse cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)] ${className}`}
        title="Recording live... Click to stop and transcribe"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
        <MicOff className="w-3.5 h-3.5" />
        <span>Stop &amp; Transcribe</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleStartRecording}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700 hover:border-[#00E5FF]/50 text-gray-300 hover:text-[#00E5FF] text-xs font-semibold transition-all cursor-pointer ${className}`}
      title="Speak your prompt or message (gemini-3.5-transcribe)"
    >
      <Mic className="w-3.5 h-3.5 text-[#00E5FF]" />
      <span>{buttonLabel || 'Voice Input'}</span>
    </button>
  );
};
