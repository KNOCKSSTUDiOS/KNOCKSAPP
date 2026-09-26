/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {Video} from '../types';
import {PlayIcon} from './icons';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

/**
 * A component that renders a video card with a thumbnail, title, and play button.
 */
export const VideoCard: React.FC<VideoCardProps> = ({video, onPlay}) => {
  return (
    <button
      type="button"
      className="group w-full text-left bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-gray-500/30 transform transition-all duration-300 hover:-translate-y-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
      onClick={() => onPlay(video)}
      aria-label={`Play video: ${video.title}`}>
      <div className="relative">
        <video
          className="w-full h-48 object-cover pointer-events-none"
          src={video.videoUrl}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"></video>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayIcon className="w-16 h-16 text-white opacity-80 drop-shadow-lg group-hover:opacity-100 transform group-hover:scale-110 transition-transform" />
        </div>
      </div>
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-base font-semibold text-gray-200 truncate flex-1"
            title={video.title}>
            {video.title}
          </h3>
          {video.genre && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex-shrink-0">
              {video.genre.split('/')[0].trim()}
            </span>
          )}
        </div>
        {video.director && (
          <p className="text-[11px] font-mono text-[#00E5FF] truncate">
            Dir: {video.director}
          </p>
        )}
      </div>
    </button>
  );
};
