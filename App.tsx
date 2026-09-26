/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { EditVideoPage } from './components/EditVideoPage';
import { ErrorModal } from './components/ErrorModal';
import { SavingProgressPage } from './components/SavingProgressPage';
import { VideoGrid } from './components/VideoGrid';
import { VideoPlayer } from './components/VideoPlayer';
import { Studio3DStage } from './components/Studio3DStage';
import { PowerShellDashboard } from './components/PowerShellDashboard';
import { ColorGradingSuite } from './components/ColorGradingSuite';
import { SpatialAudioSuite } from './components/SpatialAudioSuite';
import { PixarScriptStudio } from './components/PixarScriptStudio';
import { VeoVideoStudio } from './components/VeoVideoStudio';
import { ConceptArtImageStudio } from './components/ConceptArtImageStudio';
import { LiveVoiceStudio } from './components/LiveVoiceStudio';
import { HollywoodChatbot } from './components/HollywoodChatbot';
import { StudioAnalytics } from './components/StudioAnalytics';
import { WatermarkProtectionSuite } from './components/WatermarkProtectionSuite';
import { GoogleDriveStudioManager } from './components/GoogleDriveStudioManager';
import { AppIconSuite } from './components/AppIconSuite';
import { ImportExportSuite } from './components/ImportExportSuite';
import { EnterpriseAccountModal } from './components/EnterpriseAccountModal';
import { SocialMediaSuite } from './components/SocialMediaSuite';
import { StudioBrandName } from './components/icons';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

import {
  MOCK_VIDEOS,
  COLOR_GRADING_PRESETS,
  DEFAULT_WATERMARK_CONFIG,
  DEFAULT_ANALYTICS_DATA,
  DEFAULT_GDRIVE_SYNC_STATE,
} from './constants';
import {
  Video,
  ColorGradingConfig,
  WatermarkConfig,
  StudioAnalyticsData,
  GoogleDriveSyncState,
} from './types';
import { generateVeoVideo } from './services/geminiService';

import {
  Film,
  Video as VideoIcon,
  Download,
  Upload,
  Share2,
  User,
  Palette,
  Volume2,
  Heart,
  Bot,
  Sparkles,
  SlidersHorizontal,
  ExternalLink,
  Activity,
  Cloud,
  ShieldCheck,
  Image as ImageIcon,
  Menu,
  ChevronDown,
  CheckCircle,
  Play,
  RotateCcw,
  FileText,
  Terminal,
  Radio
} from 'lucide-react';

export const App: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [generationError, setGenerationError] = useState<string[] | null>(null);

  // Active studio module tab
  const [activeTab, setActiveTab] = useState<
    | 'gallery'
    | 'veo'
    | 'concept'
    | 'voice'
    | 'analytics'
    | 'gdrive'
    | 'watermark'
    | 'icon'
    | 'powershell'
    | 'screenplay'
    | 'color'
    | 'audio'
    | 'ai'
  >('gallery');

  // Preloaded prompt for Veo 3 generator
  const [veoPrompt, setVeoPrompt] = useState<string>('');

  // 4K HDR Bioluminescent Color Grading state
  const [colorConfig, setColorConfig] = useState<ColorGradingConfig>(COLOR_GRADING_PRESETS[0]);

  // Hollywood IP Protection & Dynamic Watermark state
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>(DEFAULT_WATERMARK_CONFIG);

  // Real-time Studio Analytics & Telemetry data
  const [analyticsData, setAnalyticsData] = useState<StudioAnalyticsData>(DEFAULT_ANALYTICS_DATA);

  // Google Drive Cloud & Desktop Sync state
  const [gdriveSyncState, setGdriveSyncState] = useState<GoogleDriveSyncState>(DEFAULT_GDRIVE_SYNC_STATE);

  // Enterprise Modals & User Identity
  const [userEmail, setUserEmail] = useState<string>('executive@knocksstudios.internal');
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [importExportModal, setImportExportModal] = useState<'export' | 'import' | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Firebase Auth & Firestore onSnapshot
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user?.email) {
        setUserEmail(user.email);
      }
    });

    const path = 'videos';
    const unsubFirestore = onSnapshot(
      collection(db, path),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteVideos: Video[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteVideos.push({
              id: docSnap.id,
              title: data.title || 'Untitled Render',
              description: data.description || data.prompt || 'Veo 3 Film Render',
              prompt: data.prompt || '',
              videoUrl: data.videoUrl || '',
              aspectRatio: (data.aspectRatio as '16:9' | '9:16') || '16:9',
              createdAt: data.createdAt || new Date().toISOString(),
            });
          });
          // Merge remote videos with local mock videos without duplicates
          setVideos((prev) => {
            const existingIds = new Set(remoteVideos.map((v) => v.id));
            const remaining = prev.filter((v) => !existingIds.has(v.id));
            return [...remoteVideos, ...remaining];
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );

    return () => {
      unsubAuth();
      unsubFirestore();
    };
  }, []);

  const handleImportProject = (importedData: any) => {
    if (importedData.colorGrading) {
      setColorConfig(importedData.colorGrading);
    }
    if (importedData.securityWatermark) {
      setWatermarkConfig(importedData.securityWatermark);
    }
    if (importedData.telemetry) {
      setAnalyticsData(importedData.telemetry);
    }
    if (importedData.user) {
      setUserEmail(importedData.user);
    }
    showToast('Enterprise project manifest successfully synchronized!');
  };

  const handlePlayVideo = (video: Video) => {
    setPlayingVideo(video);
  };

  const handleClosePlayer = () => {
    setPlayingVideo(null);
  };

  const handleStartEdit = (video: Video) => {
    setPlayingVideo(null);
    setEditingVideo(video);
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
  };

  const handleUpdateVideoMetadata = (updatedVideo: Video) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
    );
    setEditingVideo(null);
    setPlayingVideo(updatedVideo);
    showToast(`Metadata saved: "${updatedVideo.title}" (${updatedVideo.genre || 'Cinema'})!`);
  };

  const handleSaveEdit = async (originalVideo: Video) => {
    setEditingVideo(null);
    setIsSaving(true);
    setGenerationError(null);

    try {
      const promptText = originalVideo.description;
      const src = await generateVeoVideo({
        prompt: promptText,
        aspectRatio: '16:9',
      });

      const newVideo: Video = {
        id: crypto.randomUUID(),
        title: originalVideo.title.startsWith('Remix of') ? originalVideo.title : `Remix of "${originalVideo.title}"`,
        description: originalVideo.description,
        prompt: originalVideo.prompt || originalVideo.description,
        genre: originalVideo.genre,
        releaseDate: originalVideo.releaseDate,
        director: originalVideo.director,
        producer: originalVideo.producer,
        rating: originalVideo.rating,
        videoUrl: src,
        aspectRatio: '16:9',
        category: originalVideo.genre || 'Veo 3 Cinema',
        tag: '4K Ultra HDR',
        isAiGenerated: true,
        createdAt: new Date().toLocaleTimeString(),
      };

      setVideos((currentVideos) => [newVideo, ...currentVideos]);
      setAnalyticsData((prev) => ({
        ...prev,
        totalScenesRendered: prev.totalScenesRendered + 1,
        total4KMinutes: +(prev.total4KMinutes + 1.2).toFixed(1),
        liveEvents: [
          {
            id: `ev-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            category: 'VEO_RENDER',
            message: `New 4K scene rendered: "${newVideo.title}"`,
            status: 'SUCCESS',
          },
          ...prev.liveEvents,
        ],
      }));
      setPlayingVideo(newVideo);
      showToast('New 4K Scene Rendered with Veo 3!');
    } catch (error: any) {
      console.error('Video generation failed:', error);
      setGenerationError([
        'Veo 3 requires an active Google Cloud Project with Paid Tier access.',
        'Please configure your API key in Settings.',
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewVideo = (newVideo: Video) => {
    setVideos((current) => [newVideo, ...current]);
    setAnalyticsData((prev) => ({
      ...prev,
      totalScenesRendered: prev.totalScenesRendered + 1,
      total4KMinutes: +(prev.total4KMinutes + 1.0).toFixed(1),
    }));
    setActiveTab('gallery');
    setPlayingVideo(newVideo);
    showToast('New 4K video added to studio library!');
  };

  const handleLoadVeoPromptFromScript = (prompt: string) => {
    setVeoPrompt(prompt);
    setActiveTab('veo');
  };

  const handleTriggerGoogleDriveBackup = async () => {
    const backupData = {
      studio: 'KNOCKSSTUDiOS Hollywood Motion Pictures',
      exportDate: new Date().toISOString(),
      videosCount: videos.length,
      colorProfile: colorConfig.presetName,
      watermark: watermarkConfig.text,
      scenes: videos.map(v => ({ id: v.id, title: v.title, description: v.description })),
    };
    const jsonStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonStr;
    link.download = `KNOCKSSTUDiOS_GDrive_Backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAnalyticsData((prev) => ({
      ...prev,
      gdriveBackupsSynced: prev.gdriveBackupsSynced + 1,
      liveEvents: [
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          category: 'GDRIVE_SYNC',
          message: 'Full Google Drive Cloud Archive Synchronized',
          status: 'SYNCED',
        },
        ...prev.liveEvents,
      ],
    }));
    showToast('Project Master backed up to Google Drive archive!');
  };

  const handleResetGrading = () => {
    setColorConfig(COLOR_GRADING_PRESETS[0]);
    showToast('Color Grading reset to Rec.2020 Bioluminescent Default.');
  };

  if (isSaving) {
    return <SavingProgressPage />;
  }

  return (
    <div className="min-h-screen bg-[#030407] text-gray-100 font-sans selection:bg-[#00E5FF] selection:text-black relative overflow-x-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(0,0,0,0))] bg-[linear-gradient(to_right,#0c132218_1px,transparent_1px),linear-gradient(to_bottom,#0c132218_1px,transparent_1px)] bg-[size:36px_36px]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00E5FF] text-black px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Studio Brand Header Bar */}
      <header className="sticky top-0 z-40 bg-[#060810]/95 backdrop-blur-md border-b border-[#00E5FF]/20 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Studio Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#0077FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Film className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <StudioBrandName className="text-lg sm:text-xl text-white" />
                <span className="px-2 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 text-[10px] font-mono font-bold uppercase">
                  4K HDR Ultra Cinema
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                Hollywood Motion Pictures &bull; Enterprise Cinema Suite &bull; Firebase Cloud Persistence
              </p>
            </div>
          </div>

          {/* Clean Enterprise Action Center */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Import Button */}
            <button
              onClick={() => setImportExportModal('import')}
              title="Import Project Manifest or Timeline (.json / .edl)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-[#00E5FF]/40 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Import</span>
            </button>

            {/* Export Button */}
            <button
              onClick={() => setImportExportModal('export')}
              title="Export Master Project (.json) or Cinema EDL (.edl)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-[#00E5FF]/40 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Export</span>
            </button>

            {/* Social Medias Button */}
            <button
              onClick={() => setIsSocialModalOpen(true)}
              title="Publish and distribute to YouTube 4K, Vimeo Pro, X, and mobile"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-pink-500/40 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Social Medias</span>
            </button>

            {/* Enterprise Log In / Account */}
            <button
              onClick={() => setIsAccountModalOpen(true)}
              title="View & Switch Enterprise Operator Account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-emerald-500/40 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono">{firebaseUser ? (firebaseUser.displayName || 'Google Account') : 'Enterprise Account'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>4K Cinema Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('veo')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'veo'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <VideoIcon className="w-3.5 h-3.5" />
            <span>Veo 3 Film Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('concept')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'concept'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Concept &amp; Image-to-Video</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'voice'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live Voice (3.8 Live)</span>
          </button>

          <button
            onClick={() => setActiveTab('screenplay')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'screenplay'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Screenplay &amp; Bible</span>
          </button>

          <button
            onClick={() => setActiveTab('color')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'color'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color &amp; VFX</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>DTS 7.1 Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('powershell')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'powershell'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>PowerShell Dash</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Studio Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('watermark')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'watermark'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Watermarks &amp; DRM</span>
          </button>

          <button
            onClick={() => setActiveTab('icon')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'icon'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>App Icon Suite</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Executive</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Interactive 3D WebGL Liquid Metal Studio Stage */}
        <Studio3DStage
          activeTitle={
            activeTab === 'screenplay'
              ? 'ENTERPRISE CINEMA'
              : activeTab === 'powershell'
              ? 'POWERSHELL STUDIO DASH'
              : activeTab === 'concept'
              ? '4K CONCEPT & IMAGE STUDIO'
              : activeTab === 'voice'
              ? 'REAL-TIME LIVE VOICE STUDIO'
              : activeTab === 'analytics'
              ? 'STUDIO TELEMETRY'
              : activeTab === 'gdrive'
              ? 'GOOGLE DRIVE CLOUD'
              : activeTab === 'watermark'
              ? 'SECURITY & DRM'
              : 'KNOCKSSTUDiOS'
          }
          bioluminescenceHue={
            colorConfig.lut === 'biolumi-cyan'
              ? 'cyan'
              : colorConfig.lut === 'pixar-warm'
              ? 'orange'
              : 'pink'
          }
        />

        {editingVideo ? (
          <EditVideoPage
            video={editingVideo}
            onSave={handleSaveEdit}
            onSaveMetadata={handleUpdateVideoMetadata}
            onCancel={handleCancelEdit}
          />
        ) : (
          <>
            {/* TAB: 4K Cinema Gallery */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#080B14] border border-gray-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide font-display text-white">
                      4K HDR Ultra Cinema Showcase
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                      Select any scene below to preview with live 4K HDR color grading, DTS spatial audio, dynamic watermarks, or remix with Veo 3.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('veo')}
                      className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      + Generate New 4K Film
                    </button>
                  </div>
                </div>

                <VideoGrid videos={videos} onPlayVideo={handlePlayVideo} />
              </div>
            )}

            {/* TAB: Veo 3 Film Engine */}
            {activeTab === 'veo' && (
              <VeoVideoStudio
                initialPrompt={veoPrompt}
                onVideoCreated={handleAddNewVideo}
              />
            )}

            {/* TAB: 4K Concept Art & Image-to-Video Studio */}
            {activeTab === 'concept' && (
              <ConceptArtImageStudio
                onSendToVeo={(blob, prompt) => {
                  setVeoPrompt(prompt);
                  setActiveTab('veo');
                }}
                onVideoCreated={handleAddNewVideo}
              />
            )}

            {/* TAB: Real-Time Live Voice Studio */}
            {activeTab === 'voice' && <LiveVoiceStudio />}

            {/* TAB: Studio Analytics & Telemetry */}
            {activeTab === 'analytics' && (
              <StudioAnalytics
                data={analyticsData}
                onRefresh={() => {
                  setAnalyticsData(prev => ({
                    ...prev,
                    gpuComputeHours: +(prev.gpuComputeHours + 0.1).toFixed(1),
                  }));
                  showToast('Refreshed telemetry probe.');
                }}
              />
            )}

            {/* TAB: Google Drive Cloud & Desktop Sync */}
            {activeTab === 'gdrive' && (
              <GoogleDriveStudioManager
                syncState={gdriveSyncState}
                onSyncStateChange={setGdriveSyncState}
                onTriggerBackup={handleTriggerGoogleDriveBackup}
              />
            )}

            {/* TAB: Hollywood Security & Watermark Engine */}
            {activeTab === 'watermark' && (
              <WatermarkProtectionSuite
                config={watermarkConfig}
                onChange={setWatermarkConfig}
              />
            )}

            {/* TAB: Studio App Icon Suite */}
            {activeTab === 'icon' && <AppIconSuite />}

            {/* TAB: PowerShell Studio Dash & GitHub Publisher */}
            {activeTab === 'powershell' && (
              <PowerShellDashboard
                userEmail={userEmail}
                watermarkText={watermarkConfig.text}
                onOpenWatermarkTab={() => setActiveTab('watermark')}
                onOpenAccountModal={() => setIsAccountModalOpen(true)}
              />
            )}

            {/* TAB: Hearts of Journey Script & Pixar Characters */}
            {activeTab === 'screenplay' && (
              <PixarScriptStudio onLoadVeoPrompt={handleLoadVeoPromptFromScript} />
            )}

            {/* TAB: Bioluminescent Color & VFX Suite */}
            {activeTab === 'color' && (
              <ColorGradingSuite config={colorConfig} onChange={setColorConfig} />
            )}

            {/* TAB: DTS & Dolby Audio Suite */}
            {activeTab === 'audio' && <SpatialAudioSuite />}

            {/* TAB: Hollywood AI Executive Chatbot */}
            {activeTab === 'ai' && <HollywoodChatbot />}
          </>
        )}
      </main>

      {/* Video Player Modal with Color Grading Pass and Dynamic Watermark */}
      {playingVideo && (
        <VideoPlayer
          video={playingVideo}
          gradingConfig={colorConfig}
          watermarkConfig={watermarkConfig}
          onClose={handleClosePlayer}
          onEdit={handleStartEdit}
        />
      )}

      {/* Error Modal */}
      {generationError && (
        <ErrorModal
          message={generationError}
          onClose={() => setGenerationError(null)}
          onSelectKey={async () => await (window as any).aistudio?.openSelectKey()}
        />
      )}

      {/* Enterprise Import / Export Suite Modal */}
      {importExportModal && (
        <ImportExportSuite
          isOpen={true}
          mode={importExportModal}
          onClose={() => setImportExportModal(null)}
          colorConfig={colorConfig}
          watermarkConfig={watermarkConfig}
          analyticsData={analyticsData}
          onImportProject={handleImportProject}
          onDownloadWindowsPackage={() => {
            setActiveTab('rust');
            setImportExportModal(null);
          }}
        />
      )}

      {/* Enterprise Account / Log Ins Modal */}
      {isAccountModalOpen && (
        <EnterpriseAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          userEmail={userEmail}
          onUpdateEmail={(newEmail) => {
            setUserEmail(newEmail);
            showToast(`Operator identity updated: ${newEmail}`);
          }}
          onShowToast={showToast}
        />
      )}

      {/* Social Medias & Global Distribution Modal */}
      {isSocialModalOpen && (
        <SocialMediaSuite
          isOpen={isSocialModalOpen}
          onClose={() => setIsSocialModalOpen(false)}
          onShowToast={showToast}
        />
      )}

      {/* Studio Footer */}
      <footer className="mt-16 border-t border-gray-900 bg-[#030407] py-8 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-gray-400">
            <StudioBrandName className="text-sm" /> Hollywood Motion Pictures &copy; {new Date().getFullYear()} &bull; All Rights Reserved.
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Standalone Windows Native Packaging via Rust &bull; Powered by Google GenAI (Veo 3.1 &bull; Gemini 3.1 &bull; Lyria 3 &bull; Gemini 3.8) &bull; Firebase Firestore &bull; Google Drive
          </p>
        </div>
      </footer>
    </div>
  );
};
