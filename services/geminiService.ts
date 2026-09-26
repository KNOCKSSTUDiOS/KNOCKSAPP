/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI, Modality } from '@google/genai';

// Official recommended models according to Google GenAI guidelines & user requirements
export const VEO_MODEL = 'veo-3.1-fast-generate-preview';
export const IMAGE_MODEL = 'gemini-3.1-flash-image-preview';
export const LYRIA_CLIP_MODEL = 'lyria-3-clip-preview';
export const LYRIA_PRO_MODEL = 'lyria-3-pro-preview';
export const TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';
export const CHAT_FLASH_MODEL = 'gemini-3.5-flash';
export const CHAT_PRO_MODEL = 'gemini-3.1-pro-preview';
export const CHAT_LITE_MODEL = 'gemini-3.1-flash-lite';
export const LIVE_MODEL = 'gemini-3.8-live';

/**
 * Helper to obtain the GoogleGenAI instance safely with telemetry header.
 */
export function getGenAIClient(): GoogleGenAI {
  const apiKey =
    (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) ||
    (typeof window !== 'undefined' && ((window as any).GEMINI_API_KEY || (window as any).process?.env?.GEMINI_API_KEY)) ||
    '';

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Convert Blob to Base64 string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      const base64 = url.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate Veo 3 Video from text prompt or starting image (Image-to-Video)
 * Model: veo-3.1-fast-generate-preview
 * Supports aspect ratio '16:9' (landscape) or '9:16' (portrait)
 */
export async function generateVeoVideo(options: {
  prompt: string;
  imageBlob?: Blob;
  aspectRatio?: '16:9' | '9:16';
  onStatusUpdate?: (status: string) => void;
}): Promise<string> {
  const ai = getGenAIClient();
  const aspectRatio = options.aspectRatio || '16:9';
  options.onStatusUpdate?.('Initializing Veo 3 high-speed cinematic pipeline (veo-3.1-fast-generate-preview)...');

  let payload: any = {
    model: VEO_MODEL,
    prompt: options.prompt,
    config: {
      numberOfVideos: 1,
      aspectRatio,
    },
  };

  if (options.imageBlob) {
    options.onStatusUpdate?.('Encoding input photo reference into video canvas (Image-to-Video)...');
    const imageBase64 = await blobToBase64(options.imageBlob);
    payload.image = {
      imageBytes: imageBase64,
      mimeType: options.imageBlob.type || 'image/png',
    };
  }

  options.onStatusUpdate?.('Submitting Veo 3 render task...');
  let operation = await ai.models.generateVideos(payload);

  let attempts = 0;
  while (!operation.done) {
    attempts++;
    options.onStatusUpdate?.(`Rendering 4K frames with Veo 3 neural engine... (${attempts * 6}s elapsed)`);
    await new Promise((resolve) => setTimeout(resolve, 6000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  if (!operation.response?.generatedVideos || operation.response.generatedVideos.length === 0) {
    throw new Error('Veo 3 generation completed without return video stream.');
  }

  options.onStatusUpdate?.('Downloading completed 4K Cinema MP4 stream...');
  const genVideo = operation.response.generatedVideos[0];
  const downloadUri = decodeURIComponent(genVideo.video.uri);
  const apiKey =
    (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) || '';
  const separator = downloadUri.includes('?') ? '&' : '?';
  const finalFetchUrl = apiKey ? `${downloadUri}${separator}key=${apiKey}` : downloadUri;

  const res = await fetch(finalFetchUrl);
  if (!res.ok) {
    throw new Error(`Failed to download generated video: ${res.status} ${res.statusText}`);
  }
  const blob = await res.blob();
  const b64 = await blobToBase64(blob);
  return `data:video/mp4;base64,${b64}`;
}

/**
 * Generate or Edit Image using gemini-3.1-flash-image-preview
 * Supports text prompt creation or editing existing image with text instructions
 */
export async function generateStudioImage(options: {
  prompt: string;
  sourceImageBlob?: Blob;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  imageSize?: '1K' | '2K' | '4K';
}): Promise<string> {
  const ai = getGenAIClient();
  const aspectRatio = options.aspectRatio || '16:9';

  let parts: any[] = [];
  if (options.sourceImageBlob) {
    const b64 = await blobToBase64(options.sourceImageBlob);
    parts.push({
      inlineData: {
        data: b64,
        mimeType: options.sourceImageBlob.type || 'image/png',
      },
    });
  }
  parts.push({ text: options.prompt });

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio,
      },
    },
  });

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('No image candidates generated.');
  }

  for (const part of candidates[0].content.parts) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType || 'image/png';
      return `data:${mime};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Image generation completed but no inline image data was returned.');
}

/**
 * Transcribe Audio using gemini-3.5-transcribe
 * Takes audio blob from microphone and returns accurate transcription
 */
export async function transcribeAudioFile(audioBlob: Blob): Promise<string> {
  const ai = getGenAIClient();
  const b64 = await blobToBase64(audioBlob);

  const audioPart = {
    inlineData: {
      mimeType: audioBlob.type || 'audio/webm',
      data: b64,
    },
  };

  const response = await ai.models.generateContent({
    model: TRANSCRIBE_MODEL,
    contents: {
      parts: [
        audioPart,
        {
          text: 'Accurately transcribe all spoken dialogue, voice notes, and instructions from this recording. Return only the transcription without metadata.',
        },
      ],
    },
  });

  return response.text?.trim() || '(No speech detected in recording)';
}

/**
 * Generate Music using Lyria 3
 * Model: lyria-3-clip-preview (up to 30s) or lyria-3-pro-preview (full-length tracks)
 */
export async function generateLyriaMusic(
  prompt: string,
  mode: 'clip' | 'pro' = 'clip'
): Promise<string> {
  const ai = getGenAIClient();
  const modelToUse = mode === 'pro' ? LYRIA_PRO_MODEL : LYRIA_CLIP_MODEL;

  const responseStream = await ai.models.generateContentStream({
    model: modelToUse,
    contents: prompt,
    config: {
      responseModalities: [Modality.AUDIO],
    },
  });

  let audioBase64 = '';
  let mimeType = 'audio/wav';

  for await (const chunk of responseStream) {
    const parts = chunk.candidates?.[0]?.content?.parts;
    if (!parts) continue;
    for (const part of parts) {
      if (part.inlineData?.data) {
        if (!audioBase64 && part.inlineData.mimeType) {
          mimeType = part.inlineData.mimeType;
        }
        audioBase64 += part.inlineData.data;
      }
    }
  }

  if (!audioBase64) {
    throw new Error('No audio returned from Lyria model.');
  }

  return `data:${mimeType};base64,${audioBase64}`;
}

/**
 * Hollywood Production Assistant Chat
 * Supports:
 * - Multi-turn conversation history
 * - Model selection: gemini-3.5-flash (general), gemini-3.1-pro-preview (complex tasks), gemini-3.1-flash-lite (fast)
 * - Search Grounding (googleSearch) using gemini-3.5-flash
 * - Maps Grounding (googleMaps) using gemini-3.5-flash
 */
export async function askProductionAssistant(
  history: { role: 'user' | 'model'; content: string }[],
  userMessage: string,
  options?: {
    model?: 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
    grounding?: 'search' | 'maps' | 'none';
    systemInstruction?: string;
  }
): Promise<{ text: string; searchChunks?: any[]; mapsChunks?: any[] }> {
  const ai = getGenAIClient();
  const selectedModel = options?.model || CHAT_FLASH_MODEL;
  const grounding = options?.grounding || 'search';

  const contents = [
    ...history.map((h) => ({
      role: h.role,
      parts: [{ text: h.content }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  const config: any = {
    systemInstruction:
      options?.systemInstruction ||
      'You are the lead Hollywood Producer and Executive Technical Director at KNOCKSSTUDiOS. You assist with enterprise 4K HDR Ultra Cinema production, Veo 3 neural video generation, Bioluminescent Color grading (Rec.2020 palettes), DTS 7.1 / Dolby Digital spatial audio design, 3D Blender/WebGL stage choreography, location scouting, and cinematic screenplays. Respond with professional cinematic insight, precision, and enterprise leadership.',
  };

  // Configure Grounding Tools (only on supported flash model)
  if (selectedModel === CHAT_FLASH_MODEL) {
    if (grounding === 'search') {
      config.tools = [{ googleSearch: {} }];
    } else if (grounding === 'maps') {
      config.tools = [{ googleMaps: {} }];
    }
  }

  const response = await ai.models.generateContent({
    model: selectedModel,
    contents,
    config,
  });

  const searchChunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(
      (c: any) => c.web?.uri || c.web?.title
    ) || [];

  const mapsChunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(
      (c: any) => c.maps?.uri || c.maps?.title || c.maps?.placeId
    ) || [];

  return {
    text: response.text || '',
    searchChunks,
    mapsChunks,
  };
}
