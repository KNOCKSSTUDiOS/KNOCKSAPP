/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import {
  Share2,
  ExternalLink,
  Copy,
  Check,
  X,
  Play,
  Video,
  Send,
  Smartphone,
  Globe,
  Sparkles
} from 'lucide-react';
import { StudioBrandName } from './icons';

interface SocialMediaSuiteProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const SocialMediaSuite: React.FC<SocialMediaSuiteProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!isOpen) return null;

  const cinemaScreenerLink = 'https://knocksstudios.com/screener/master-4k-enterprise';
  const defaultCaption = `🎬 Fresh 4K HDR Ultra Cinema Master from KNOCKSSTUDiOS Hollywood Motion Pictures!\nEngineered with Windows Native Architecture & Google GenAI Veo 3.1. Pure 4K cinema master grade.\n#KNOCKSSTUDiOS #4KHDR #VFX #WindowsApp #CinemaMaster #Veo3`;

  const channels = [
    {
      id: 'youtube',
      name: 'YouTube Studio 4K HDR',
      desc: 'Publish in full 3840x2160 Rec.2020 10-Bit with 5.1/7.1 audio',
      url: 'https://studio.youtube.com',
      badge: '4K HDR Rec.2020',
      icon: Play,
      color: 'text-red-500',
    },
    {
      id: 'vimeo',
      name: 'Vimeo Pro Enterprise',
      desc: 'Lossless theatrical screener reviews & password DRM protection',
      url: 'https://vimeo.com/upload',
      badge: 'Lossless Master',
      icon: Video,
      color: 'text-blue-400',
    },
    {
      id: 'x',
      name: 'X (Twitter) Media Studio',
      desc: 'High-bitrate cinema trailers and technical director devlogs',
      url: 'https://studio.twitter.com',
      badge: 'Pro Publisher',
      icon: Send,
      color: 'text-sky-400',
    },
    {
      id: 'reels',
      name: 'Instagram Reels & TikTok',
      desc: '9:16 vertical cinema crops and behind-the-scenes VFX shorts',
      url: 'https://instagram.com',
      badge: 'Mobile 9:16',
      icon: Smartphone,
      color: 'text-pink-400',
    },
    {
      id: 'imdb',
      name: 'IMDb Pro / LinkedIn Media',
      desc: 'Studio executive credits, technical director portfolio showcase',
      url: 'https://pro.imdb.com',
      badge: 'Production Credits',
      icon: Globe,
      color: 'text-amber-400',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cinemaScreenerLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onShowToast('Theatrical Screener URL copied!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(defaultCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
      onShowToast('Social media caption copied to clipboard!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-xl bg-[#090D18] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#060810]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
                <span>Social Medias &amp; 4K Distribution</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 font-mono">
                  ENTERPRISE
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Direct export pathways to YouTube Studio, Vimeo Pro, X, and mobile video platforms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Screener Link Box */}
          <div className="p-3.5 rounded-xl bg-[#05070E] border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
              <span>Direct 4K Theatrical Screener Link</span>
              <span className="text-emerald-400 text-[10px] font-mono">WATERMARKED</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-950 p-2 rounded-lg border border-gray-800">
              <input
                type="text"
                readOnly
                value={cinemaScreenerLink}
                className="flex-1 bg-transparent text-xs text-gray-300 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded bg-[#00E5FF] text-black font-bold text-xs hover:brightness-110 flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Channels Grid */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Connected Publishing Portals
            </div>
            <div className="space-y-2">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <a
                    key={ch.id}
                    href={ch.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800/80 hover:border-gray-700 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-950 border border-gray-800 ${ch.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{ch.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                            {ch.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400">{ch.desc}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Social Caption Generator */}
          <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
              <span>Ready-to-Post Cinema Devlog Caption</span>
              <button
                onClick={handleCopyCaption}
                className="text-xs text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer font-mono"
              >
                {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
              </button>
            </div>
            <div className="text-[11px] text-gray-300 font-mono bg-[#05070E] p-2.5 rounded-lg border border-gray-900 whitespace-pre-line leading-relaxed">
              {defaultCaption}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-800 bg-[#060810] flex items-center justify-between text-xs text-gray-500">
          <StudioBrandName className="text-xs text-white" />
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
