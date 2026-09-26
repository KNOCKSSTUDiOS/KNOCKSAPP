/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { Video } from '../types';
import {
  Film,
  Sparkles,
  Calendar,
  User,
  Tag,
  CheckCircle,
  Clapperboard,
  Save,
  ArrowRight,
  Shield,
  Layers,
  Sliders
} from 'lucide-react';
import { StudioBrandName } from './icons';

interface EditVideoPageProps {
  video: Video;
  onSave: (updatedVideo: Video) => void;
  onSaveMetadata?: (updatedVideo: Video) => void;
  onCancel: () => void;
}

const GENRE_PRESETS = [
  'Sci-Fi / Cyberpunk',
  'Animation / Pixar 3D',
  'Stop-Motion Claymation',
  'Hollywood Action Thriller',
  'Dramatic Cinema',
  'Nature & Wildlife 4K',
  'Neo-Noir Mystery',
  'Live Musical Performance',
  'Fantasy & Adventure',
  'Abstract Theatrical'
];

const DIRECTOR_PRESETS = [
  'Guillermo Tamayo',
  'Denis Villeneuve',
  'Christopher Nolan',
  'Hayao Miyazaki',
  'Pete Docter',
  'Greta Gerwig',
  'KNOCKSSTUDiOS Creative Director'
];

const RATING_PRESETS = ['G', 'PG', 'PG-13', 'R', 'TV-MA', '4K THEATRICAL MASTER'];

export const EditVideoPage: React.FC<EditVideoPageProps> = ({
  video,
  onSave,
  onSaveMetadata,
  onCancel,
}) => {
  // Navigation tab within edit page
  const [activeTab, setActiveTab] = useState<'prompt' | 'metadata'>('metadata');

  // Video fields
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [genre, setGenre] = useState(video.genre || video.category || 'Dramatic Cinema');
  const [releaseDate, setReleaseDate] = useState(video.releaseDate || new Date().toISOString().split('T')[0]);
  const [director, setDirector] = useState(video.director || 'Guillermo Tamayo');
  const [producer, setProducer] = useState(video.producer || 'KNOCKSSTUDiOS Hollywood Motion Pictures');
  const [rating, setRating] = useState(video.rating || '4K THEATRICAL MASTER');

  const getUpdatedVideoObject = (): Video => ({
    ...video,
    title: title.trim() || video.title,
    description: description.trim() || video.description,
    prompt: description.trim() || video.prompt || video.description,
    genre: genre.trim(),
    category: genre.trim(),
    releaseDate: releaseDate.trim(),
    director: director.trim(),
    producer: producer.trim(),
    rating: rating.trim(),
  });

  const handleSaveOnlyMetadata = () => {
    const updated = getUpdatedVideoObject();
    if (onSaveMetadata) {
      onSaveMetadata(updated);
    } else {
      onSave(updated);
    }
  };

  const handleRemixWithVeo = () => {
    const updated = getUpdatedVideoObject();
    onSave(updated);
  };

  return (
    <div className="min-h-screen bg-[#03050A] text-gray-100 font-sans flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in relative selection:bg-[#00E5FF] selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(0,0,0,0))] pointer-events-none" />

      <div className="w-full max-w-3xl bg-[#080C18] border border-[#00E5FF]/25 p-6 sm:p-8 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] relative z-10 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-mono font-bold uppercase">
                4K Cinema Slate Editor
              </span>
              <span className="text-gray-500 font-mono text-xs">&bull;</span>
              <span className="text-gray-400 font-mono text-xs">{video.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide font-display text-white">
              Edit 4K Scene &amp; Production Slate
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <StudioBrandName className="text-sm text-gray-300" />
          </div>
        </header>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 bg-black/60 rounded-xl border border-gray-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Prompt &amp; Script</span>
          </button>

          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'metadata'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Metadata &amp; Credits</span>
          </button>
        </div>

        {/* Tab Content: Prompt & Script */}
        {activeTab === 'prompt' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label
                htmlFor="video-title"
                className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 font-mono"
              >
                Scene / Video Title
              </label>
              <input
                id="video-title"
                type="text"
                className="w-full bg-black/70 border border-gray-700 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] rounded-xl px-4 py-2.5 text-white text-sm font-semibold transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter theatrical title..."
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 font-mono"
              >
                Veo 3 Generative Cinema Prompt &amp; Script
              </label>
              <textarea
                id="description"
                rows={7}
                className="w-full bg-black/70 border border-gray-700 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] rounded-xl p-3.5 text-gray-200 text-sm leading-relaxed transition-all font-sans"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed cinematic prompt describing lighting, lens, camera motion, and action..."
                aria-label="Edit description for the video"
              />
            </div>

            <p className="text-xs text-gray-400 font-mono">
              Tip: Modify the prompt to re-render new visual passes while preserving your production credits and metadata.
            </p>
          </div>
        )}

        {/* Tab Content: Metadata */}
        {activeTab === 'metadata' && (
          <div className="space-y-5 animate-fade-in">
            {/* Live 4K Production Slate Preview Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-gray-950 via-[#070E20] to-gray-950 border border-[#00E5FF]/30 shadow-inner space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#00E5FF] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
                  THEATRICAL CLAPPER SLATE PREVIEW
                </span>
                <span className="text-amber-400">{rating}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-display">
                    {title || 'Untitled Motion Picture'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mt-0.5">
                    <span className="text-[#00E5FF] font-semibold">DIR: {director || 'Uncredited'}</span>
                    <span className="text-gray-600">&bull;</span>
                    <span className="text-purple-300">{genre || 'Cinema'}</span>
                    <span className="text-gray-600">&bull;</span>
                    <span className="text-gray-400 font-mono">{releaseDate || 'TBD'}</span>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-gray-400 border-l border-gray-800 pl-3">
                  <div className="text-white font-bold">4K REC.2020 HDR</div>
                  <div className="text-[10px] text-emerald-400">DTS 7.1 MASTER</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Director Credit */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 font-mono flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Director Credits</span>
                </label>
                <input
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  placeholder="e.g. Guillermo Tamayo"
                  className="w-full bg-black/70 border border-gray-700 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] rounded-xl px-3.5 py-2 text-sm text-white transition-all font-semibold"
                />
                {/* Director Quick Picks */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {DIRECTOR_PRESETS.slice(0, 4).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDirector(d)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                        director === d
                          ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 font-mono flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-purple-400" />
                  <span>Film Genre</span>
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g. Sci-Fi / Cyberpunk"
                  className="w-full bg-black/70 border border-gray-700 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded-xl px-3.5 py-2 text-sm text-white transition-all font-semibold"
                />
                {/* Genre Quick Picks */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {GENRE_PRESETS.slice(0, 4).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGenre(g)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                        genre === g
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Release Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Release Date / Theatrical Window</span>
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full bg-black/70 border border-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-3.5 py-2 text-sm text-white transition-all font-mono"
                />
                <div className="flex items-center gap-1.5 pt-1 text-[10px] text-gray-400 font-mono">
                  <button
                    type="button"
                    onClick={() => setReleaseDate(new Date().toISOString().split('T')[0])}
                    className="hover:text-amber-300 underline cursor-pointer"
                  >
                    Today
                  </button>
                  <span>&bull;</span>
                  <button
                    type="button"
                    onClick={() => setReleaseDate('2026-12-25')}
                    className="hover:text-amber-300 underline cursor-pointer"
                  >
                    Holiday 2026
                  </button>
                  <span>&bull;</span>
                  <button
                    type="button"
                    onClick={() => setReleaseDate('2027-07-16')}
                    className="hover:text-amber-300 underline cursor-pointer"
                  >
                    Summer 2027
                  </button>
                </div>
              </div>

              {/* Rating & Theatrical Certificate */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 font-mono flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Certification &amp; Producer</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="bg-black/70 border border-gray-700 focus:border-emerald-400 rounded-xl px-3 py-2 text-sm text-white font-mono cursor-pointer"
                  >
                    {RATING_PRESETS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={producer}
                    onChange={(e) => setProducer(e.target.value)}
                    placeholder="Producer / Studio"
                    className="flex-1 bg-black/70 border border-gray-700 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-sm text-white transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-800">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="w-full sm:w-auto flex flex-wrap items-center gap-2.5">
            {/* Quick Save Metadata (Instant without re-rendering) */}
            <button
              onClick={handleSaveOnlyMetadata}
              title="Save genre, release date, and director credits directly to this video"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-[#00E5FF]/40 text-[#00E5FF] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.15)]"
            >
              <Save className="w-4 h-4 text-[#00E5FF]" />
              <span>Save Metadata</span>
            </button>

            {/* Remix with Veo (Render new scene with prompt & metadata) */}
            <button
              onClick={handleRemixWithVeo}
              title="Render a new 4K scene with Veo 3 using prompt and credits"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0077FF] hover:brightness-110 active:scale-95 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.35)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Remix with Veo 3</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
