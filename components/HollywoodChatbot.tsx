/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Globe,
  Film,
  RefreshCw,
  MapPin,
  Cpu,
  Mic,
  MicOff,
  ExternalLink,
  Volume2,
  Radio
} from 'lucide-react';
import { askProductionAssistant } from '../services/geminiService';
import { AudioTranscriberButton } from './AudioTranscriberButton';

interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  searchChunks?: { web?: { uri?: string; title?: string } }[];
  mapsChunks?: { maps?: { uri?: string; title?: string } }[];
}

export const HollywoodChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        'Welcome to the KNOCKSSTUDiOS Executive Cinema Hub! I am your Technical Director and Production Co-Producer. Equipped with Gemini 3.5 Flash, Gemini 3.1 Pro, and Gemini 3.1 Flash-Lite, along with real-time Google Search & Google Maps grounding and Gemini 3.5 Transcribe. How can we elevate your production slate today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'
  >('gemini-3.5-flash');
  const [groundingMode, setGroundingMode] = useState<'search' | 'maps' | 'none'>('search');

  // Real-time Live Voice Mode state
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isLiveListening, setIsLiveListening] = useState(false);
  const [liveVoiceStatus, setLiveVoiceStatus] = useState<string>('Ready to talk with gemini-3.8-live');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await askProductionAssistant(history, userMsg.content, {
        model: selectedModel,
        grounding: groundingMode,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content:
            response.text ||
            'I have processed your query. Let us continue advancing your 4K cinema master.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          searchChunks: response.searchChunks,
          mapsChunks: response.mapsChunks,
        },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: `Production Assistant Notice: ${err.message || 'Error processing response. Please ensure API access is active.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscribedInput = (text: string) => {
    setInput((prev) => (prev ? `${prev} ${text}` : text));
  };

  const quickPrompts = [
    { label: 'Scout Hollywood Studios', query: 'Find top film production studios and sound stages in Los Angeles', mode: 'maps' as const },
    { label: 'Latest 4K Color Tech', query: 'What are the newest 2026 developments in Rec.2020 HDR grading?', mode: 'search' as const },
    { label: 'Screenplay Polish (Pro)', query: 'Analyze our script dialogue between Alex and Leah for maximum emotional resonance', model: 'gemini-3.1-pro-preview' as const },
    { label: 'Quick Scene Logline', query: 'Write a punchy 1-sentence logline for a cyberpunk stop-motion film', model: 'gemini-3.1-flash-lite' as const },
  ];

  return (
    <div className="w-full bg-[#080B14] border border-[#00E5FF]/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col h-[620px]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
              <span>Hollywood AI Executive Hub</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-[#00E5FF]">
                {selectedModel}
              </span>
            </h3>
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <span>Multi-Turn Chat</span>
              <span>&bull;</span>
              {groundingMode === 'search' && (
                <span className="text-blue-400 flex items-center gap-1 font-mono text-[11px]">
                  <Globe className="w-3 h-3" /> Google Search Grounding
                </span>
              )}
              {groundingMode === 'maps' && (
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3 h-3" /> Google Maps Grounding
                </span>
              )}
              {groundingMode === 'none' && (
                <span className="text-gray-500 font-mono text-[11px]">Direct AI</span>
              )}
            </p>
          </div>
        </div>

        {/* Toolbar: Model selector & Grounding selector & Voice toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Model Switcher */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as any)}
            className="bg-gray-900 border border-gray-700 text-xs text-white rounded-lg px-2.5 py-1 font-mono focus:border-[#00E5FF] cursor-pointer"
          >
            <option value="gemini-3.5-flash">gemini-3.5-flash (General &amp; Grounded)</option>
            <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Tasks)</option>
            <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Tasks)</option>
          </select>

          {/* Grounding Mode Switcher */}
          {selectedModel === 'gemini-3.5-flash' && (
            <div className="flex items-center bg-gray-950 p-0.5 rounded-lg border border-gray-800 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setGroundingMode('search')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                  groundingMode === 'search'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Use Google Search Data"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setGroundingMode('maps')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                  groundingMode === 'maps'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Use Google Maps Data"
              >
                Maps
              </button>
              <button
                type="button"
                onClick={() => setGroundingMode('none')}
                className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                  groundingMode === 'none'
                    ? 'bg-gray-700 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Off
              </button>
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={() =>
              setMessages([
                {
                  role: 'model',
                  content: 'Chat reset. Production slate is clean. What are we building next?',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            title="Reset conversation"
            className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3.5 my-2 font-sans text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-7 h-7 rounded-lg bg-[#00E5FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Film className="w-4 h-4 text-[#00E5FF]" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#0077FF] to-[#00E5FF] text-black font-medium'
                  : 'bg-gray-900/90 border border-gray-800 text-gray-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Search Grounding Sources */}
              {msg.searchChunks && msg.searchChunks.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-gray-800/80 space-y-1">
                  <div className="text-[10px] text-blue-400 font-mono flex items-center gap-1 font-bold">
                    <Globe className="w-3 h-3" /> Grounded Search Sources:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.searchChunks.slice(0, 3).map((chunk, idx) => (
                      <a
                        key={idx}
                        href={chunk.web?.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded bg-gray-950 hover:bg-gray-800 border border-blue-500/30 text-blue-300 flex items-center gap-1 max-w-[200px] truncate"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span className="truncate">{chunk.web?.title || chunk.web?.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Maps Grounding Sources */}
              {msg.mapsChunks && msg.mapsChunks.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-gray-800/80 space-y-1">
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
                    <MapPin className="w-3 h-3" /> Grounded Google Maps Locations:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.mapsChunks.slice(0, 3).map((chunk, idx) => (
                      <a
                        key={idx}
                        href={chunk.maps?.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] px-2 py-0.5 rounded bg-gray-950 hover:bg-gray-800 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 max-w-[200px] truncate"
                      >
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="truncate">{chunk.maps?.title || 'Map Location'}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`text-[10px] mt-1.5 font-mono ${
                  msg.role === 'user' ? 'text-black/70' : 'text-gray-500'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#00E5FF] font-mono p-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>
              {groundingMode === 'maps'
                ? 'Scouting location data with Google Maps Grounding...'
                : groundingMode === 'search'
                ? 'Consulting Google Search & Cinema Engine...'
                : 'Processing with Gemini neural engine...'}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 flex-shrink-0 scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (qp.model) setSelectedModel(qp.model);
              if (qp.mode) setGroundingMode(qp.mode);
              handleSend(qp.query);
            }}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-[#00E5FF]/40 text-[11px] text-gray-300 transition-colors cursor-pointer"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar with Audio Transcription Microphone */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-800 flex-shrink-0">
        <AudioTranscriberButton
          onTranscribed={handleTranscribedInput}
          buttonLabel="Speak"
        />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Message Executive (${selectedModel})...`}
          className="flex-1 bg-[#05060A] border border-gray-800 focus:border-[#00E5FF] rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#00E5FF]"
        />

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="p-2.5 rounded-xl bg-[#00E5FF] text-black font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
