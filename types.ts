/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Interface defining the structure of a video object, including its ID, URL,
 * title, and description.
 */
export interface Video {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  prompt?: string;
  genre?: string;
  releaseDate?: string;
  director?: string;
  producer?: string;
  rating?: string;
  aspectRatio?: '16:9' | '9:16';
  category?: string;
  tag?: string;
  createdAt?: string;
  thumbnailUrl?: string;
  isAiGenerated?: boolean;
}

export interface CharacterProfile {
  id: string;
  name: string;
  alias?: string;
  role: string;
  actorStyle: string;
  skinTone: string;
  hair: string;
  facialHair?: string;
  eyes: string;
  distinguishingFeatures: string[];
  clothing: string;
  animationDemeanor: string;
  backstory: string;
  quote: string;
  colorTheme: string;
  avatarSeed: string;
}

export interface ScriptScene {
  id: string;
  act: number;
  title: string;
  location: string;
  timeOfDay: string;
  synopsis: string;
  dialogue: {
    speaker: string;
    text: string;
    actionNote?: string;
  }[];
  musicCue: string;
  lightingCue: string;
  recommendedPrompt: string;
}

export interface ColorGradingConfig {
  presetName: string;
  brightness: number;
  contrast: number;
  saturation: number;
  bioluminescence: number;
  anamorphicFlare: boolean;
  filmGrain: number;
  vignette: number;
  bloom: number;
  aspectRatioMatte: '2.39:1' | '16:9' | '9:16' | '4:3' | 'none';
  lut: 'biolumi-cyan' | 'pixar-warm' | 'sunset-amber' | 'cyber-neon' | 'hdr-cinema' | 'melancholy-bw' | 'standard';
}

export interface WindowsRustPackageFile {
  name: string;
  path: string;
  description: string;
  type: 'rust' | 'batch' | 'toml' | 'json' | 'markdown' | 'icon';
  content: string;
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  position: 'center-diagonal' | 'bottom-right' | 'top-left' | 'grid-tiled' | 'bottom-bar';
  opacity: number;
  fontSize: number;
  color: 'cyan' | 'white' | 'amber' | 'slate';
  showTimecode: boolean;
  showFingerprint: boolean;
  fingerprintId: string;
  drmProtection: boolean;
  aspectRatioMatte: boolean;
}

export interface StudioAnalyticsData {
  totalScenesRendered: number;
  total4KMinutes: number;
  gpuComputeHours: number;
  averageVeoLatencySec: number;
  activeRec2020BitrateMbps: number;
  dtsAudioStemsExported: number;
  gdriveBackupsSynced: number;
  enterpriseMasterStats: {
    renderPassEfficiency: number;
    colorGradeIntegrity: number;
    dtsBitstreamAccuracy: number;
    hdrPeakLuminanceNits: number;
    av1HardwareEncodingFps: number;
    cinemaDeliveryCompliance: string;
  };
  liveEvents: Array<{
    id: string;
    timestamp: string;
    category: 'VEO_RENDER' | 'COLOR_PASS' | 'DTS_AUDIO' | 'GDRIVE_SYNC' | 'WATERMARK_DRM';
    message: string;
    status: 'SUCCESS' | 'ACTIVE' | 'SYNCED';
  }>;
}

export interface EnterpriseUserProfile {
  email: string;
  name: string;
  licenseTier: string;
  organization: string;
  sessionStatus: 'ACTIVE_PRO' | 'OFFLINE' | 'SYNCING';
  apiKeyConfigured: boolean;
  cloudStorageAllocatedGb: number;
  cloudStorageUsedGb: number;
}

export interface GoogleDriveSyncState {
  isConnected: boolean;
  lastBackupTime: string | null;
  totalBackedUpMb: number;
  autoSync: boolean;
  syncIntervalMinutes: number;
  folderTarget: string;
  pendingFilesCount: number;
}

