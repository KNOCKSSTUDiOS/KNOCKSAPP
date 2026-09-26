/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from './types';

/** Base URL for static files. */
const staticFilesUrl =
  'https://www.gstatic.com/aistudio/starter-apps/veo3-gallery/';

/** Videos for the gallery. */
export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: "Stop Motion: Fluffy Characters' Culinary Disaster",
    genre: 'Animation / Pixar 3D',
    director: 'Pete Docter',
    releaseDate: '2026-11-20',
    rating: 'G',
    videoUrl:
      staticFilesUrl + 'Stop_Motion_Fluffy_Characters__Culinary_Disaster.mp4',
    description: `Fluffy Characters Stop Motion: Inside a brightly colored, cozy kitchen made of felt and yarn. Professor Nibbles, a plump, fluffy hamster with oversized glasses, nervously stirs a bubbling pot on a miniature stove, muttering, "Just a little more... 'essence of savory,' as the recipe calls for." The camera is a mid-shot, capturing his frantic stirring. Suddenly, the pot emits a loud "POP!" followed by a comical "whoosh" sound, and a geyser of iridescent green slime erupts, covering the entire kitchen. Professor Nibbles shrieks, "Oh, dear! Not again!" and scurries away, leaving a trail of tiny, panicked squeaks.`,
  },
  {
    id: '2',
    title: "Claymation: Robot's Existential Crisis",
    genre: 'Stop-Motion Claymation',
    director: 'Guillermo Tamayo',
    releaseDate: '2026-12-15',
    rating: 'PG',
    videoUrl: staticFilesUrl + 'Claymation_Robot_s_Existential_Crisis.mp4',
    description: `Claymation (Stop Motion): In a quirky, cluttered garage workshop, a wide shot reveals a crudely built clay robot with mismatching parts, staring forlornly at a broken wrench. The camera slowly zooms in on its face, which expresses a comical frown. A robotic, monotone voice emanates from it, "Unit 734 reports... purpose undefined. Wrench... non-functional." A whirring of internal gears is heard, followed by a sad "boop-beep" sound. An eccentric human inventor with wild, yarn hair enters the frame, looks at the robot, and cheerfully exclaims, "Nonsense, 734! Your purpose is to fetch my coffee!" The robot's eyes slowly widen as it responds, "Coffee... new directive detected. Scanning for nearest caffeine source."`,
  },
  {
    id: '3',
    title: 'Abstract Cinematic: The Mechanical Heartbeat',
    genre: 'Dramatic Cinema',
    director: 'Denis Villeneuve',
    releaseDate: '2027-03-12',
    rating: 'PG-13',
    videoUrl:
      staticFilesUrl + 'Abstract_Cinematic_The_Mechanical_Heartbeat.mp4',
    description: `The sequence begins with an extreme close-up of a single gear, slowly turning and reflecting harsh sunlight. The camera gradually pulls back in a continuous movement, revealing this is but one component of a colossal, mechanical heart half-buried in a desolate, rust-colored desert. A sweeping aerial shot establishes its enormous scale and isolation in the barren landscape. The camera descends to capture pipes hissing steam and the rhythmic thumping that echoes across the empty plains. A subtle shake effect synchronizes with each massive heartbeat. A lateral tracking shot discovers tiny, robed figures scurrying across the metallic surface. The camera follows one such figure in a detailed tracking shot as they perform meticulous maintenance, polishing brass valves and tightening immense bolts. A complex movement circles the entire structure, capturing different maintenance teams working in precarious positions across its rusted exterior. The final shot begins tight on the meticulous work of one tiny figure before executing a dramatic pull-out that reveals the true scale of the heart and the minuscule size of its caretakers, tending to the vital organ of an unseen, sleeping giant that extends beyond the frame.`,
  },
  {
    id: '4',
    title: 'Characters Intense Talking',
    videoUrl: staticFilesUrl + 'Characters_intense_talking.mp4',
    description: `A tense silence fills a dimly lit, upscale restaurant where a composed woman and a tired man sit opposite each other. She slowly sips wine, then states, "We both know why we're here, David. It's time to be honest," as faint chatter murmurs distantly. He sighs, his gaze flickering before meeting hers as he replies, "Honesty? After all this time, Sarah, what's left of it?" A palpable tension hangs, broken only by a subtle air conditioning hum, as her unblinking eyes hold his.`,
  },
  {
    id: '5',
    title: "Live Performance: Soulful Singer's Ballad",
    videoUrl: staticFilesUrl + 'Live_Performance_Soulful_Singer_s_Ballad.mp4',
    description: `A dramatic Low-Angle Tracking Shot pulls back slowly from a Black vocalist, bathed in warm, intimate stage lights in a smoky jazz club at night. Their eyes are closed in serene focus as they sing a powerful, uplifting note, microphone held close. The camera recedes, giving them space to fill the frame with their voice. "Let the rhythm lift your soul... set it free!" A soft, resonant bass line and gentle piano chords provide a harmonious backdrop, punctuated by the faint clink of glasses and hushed applause from the audience.`,
  },
  {
    id: '6',
    title: 'Nature Monkeys',
    videoUrl: staticFilesUrl + 'Nature_Monkeys.mp4',
    description: `A gentle close-up on two small, brown macaque monkeys perched on a moss-covered branch in a vibrant, misty rainforest. One monkey tenderly grooms the other's fur, making soft "chittering" and "purring" sounds. The camera slowly zooms in further as they lean inand gaze at each other, followed by a soft, content "coo" from one of them. The background is a soft, blurred tapestry of lush green foliage and faint mist. The ambient sounds of the rainforest, including distant bird calls, insect chirps, and the gentle drip of water, are subtly present.`,
  },
  {
    id: '7',
    title: 'Video Game Trailer: Sci-Fi Urban Chase',
    videoUrl: staticFilesUrl + 'Video_Game_Trailer_Sci_Fi_Urban_Chasemp4.mp4',
    description: `A fast-tracking POV shot through a grimy, neon-lit cyberpunk alleyway at night. Rain slicks the pavement, reflecting the glow of holographic advertisements. The sound of rapid, pounding footsteps and heavy breathing dominates the audio. Suddenly, the camera whips around to a lateral tracking shot following a nimble protagonist (a woman in a hooded jacket) as she leaps over discarded crates, pursued by two heavily armored security drones. Laser fire zaps past, accompanied by sharp "pew-pew" SFX and the whirring of the drones. High-energy, pulsating electronic music drives the action forward. She dives through a narrow opening; the camera follows seamlessly, ending with a shaky cam effect as she lands, panting.`,
  },
  {
    id: '8',
    title: 'Animals in Nature: Bear and River',
    videoUrl: staticFilesUrl + 'Animals_in_Nature_Bear_and_River.mp4',
    description: `A wide shot of a pristine, fast-flowing mountain river at dusk, surrounded by dense pine forest. The camera slowly zooms in to reveal a large, majestic grizzly bear standing knee-deep in the rapids, expertly swiping at salmon. The rushing water sound is prominent, accompanied by the occasional splash as the bear moves. The bear lets out a low, content grumble after catching a fish, then slowly wades to the bank to eat its catch. Faint chirping of unseen birds and distant cicadas fill the background.`,
  },
  {
    id: '9',
    title: 'Kyoto Serenity From Scene to Postcard',
    videoUrl: staticFilesUrl + 'Kyoto_Serenity_From_Scene_to_Postcard.mp4',
    description: `Soft morning light bathes a serene path in Kyoto, lined with ancient, gnarled cherry trees whose delicate pink petals drift gently to the ground. A small herd of wild sika deer, with gentle eyes and velvety antlers, gracefully wanders among the trees, occasionally nibbling on fallen blossoms. A slow, gliding tracking shot follows one particularly elegant deer as it lowers its head to nibble. The only sounds are the soft rustle of leaves, the gentle "pitter-patter" of falling petals, and the occasional soft "sniff" and "munching" from the deer. Faint, distant temple bells chime, adding to the tranquil atmosphere. As the deer lifts its head, looking directly at the camera with calm curiosity, the camera begins a slow, deliberate pull-out. The vibrant scene subtly softens and flattens, its colors shifting to a slightly desaturated, illustrative style, as a crisp, white border gradually appears around the frame, framing the now-static image. The ambient sounds gently fade away, replaced by the soft, distant, single chime of a koto string, holding its note. Overlaid neatly in a classic, elegant font, the words "Kyoto, Japan - Spring Serenity" appear at the bottom of the postcard.`,
  },
  {
    id: '10',
    title: 'Fluffy Characters Picnic in a Mushroom Forest',
    videoUrl:
      staticFilesUrl + 'Fluffy_Characters_Picnic_in_a_Mushroom_Forest.mp4',
    description: `Fluffy Characters Stop Motion: A bright, whimsical forest clearing where oversized, colorful mushrooms grow. Two adorable, fluffy squirrel-like creatures with big, curious eyes are having a picnic. One, wearing a tiny knitted scarf, attempts to open a jar of "Nutty Spread," making frustrated, soft "grunts" and tiny "panting" sounds. The camera is a mid-shot, then slowly zooms in on the struggling jar. The other, an even fluffier creature with a flower behind its ear, giggles softly, then says in a sweet, high-pitched voice, "Need a paw, Squiggle?" A gentle, melodic flute tune plays throughout.`,
  },
  {
    id: '11',
    title: 'Cyberpunk Metropolis: Neon District 4K',
    videoUrl: staticFilesUrl + 'Characters_intense_talking.mp4',
    aspectRatio: '16:9',
    category: 'Enterprise Cinema',
    tag: '4K Ultra HDR',
    description: `Enterprise 4K Cinema Production: Late night dystopian city with volumetric rain and towering bioluminescent holographic billboards. Two cinema operatives in tactical graphene suits discuss master transmission protocols under high-contrast sodium amber and cyan lighting. 4K HDR ultra cinema render, Rec.2020 wide color gamut.`,
  },
  {
    id: '12',
    title: 'Bioluminescent Coastal Abyss: Deep Ocean 4K',
    videoUrl: staticFilesUrl + 'Live_Performance_Soulful_Singer_s_Ballad.mp4',
    aspectRatio: '16:9',
    category: 'Bioluminescent VFX',
    tag: 'Rec.2020 HDR',
    description: `Enterprise 4K Cinema Production: Deep sea explorer station illuminated by living bioluminescent cyan organisms and pulse lasers. An atmospheric female vocalist performs an ethereal cinema theme with liquid reverberation. Rendered in 4K HDR with DTS 7.1 spatial audio bed.`,
  },
  {
    id: '13',
    title: 'Robot Chrome Transformation: KNOCKSSTUDiOS',
    videoUrl: staticFilesUrl + 'Abstract_Cinematic_The_Mechanical_Heartbeat.mp4',
    aspectRatio: '16:9',
    category: 'Studio Ident',
    tag: 'Liquid Metal VFX',
    description: `Worn bipedal robot rises from dark junkyard dust, struck by brilliant white light. Instantly transforms into dazzling, iridescent pink chrome—walking powerfully toward a flickering 'KNOCKSSTUDiOS' logo. Full screen rainbow smoke erupts. 3D fully rendered.`,
  }
];

export const HOLLYWOOD_CHARACTERS = [
  {
    id: 'knocturnal',
    name: 'KNOCTURNAL',
    alias: 'Apex Operative',
    role: 'Lead Cinema Protagonist',
    actorStyle: 'Photorealistic 3D / Enterprise Cinema',
    skinTone: 'Deep rich complexion with high-definition specular reflection',
    hair: 'Short razor-fade crop with carbon-fiber weave micro-mesh',
    facialHair: 'Sculpted tactical jawline beard',
    eyes: 'Luminous cyan iris with augmented telemetry overlay',
    distinguishingFeatures: [
      'Graphene kinetic armor with bioluminescent conduits',
      'Dual-spectrum night vision neural interface',
      'Grounded, authoritative cinematic presence',
      'Zero-latency response reflexes'
    ],
    clothing: 'Matte carbon combat duster, reinforced titanium chest rig, magnetic holster boots',
    animationDemeanor: 'Calculated, authoritative, hyper-fluid motion capture pacing.',
    backstory: 'Elite studio security commander dedicated to protecting KNOCKSSTUDiOS intellectual property and first-party cinema pipelines across the globe.',
    quote: '"We build the cinema of tomorrow on our own terms—zero third-party compromise."',
    colorTheme: '#00E5FF',
    avatarSeed: 'knocturnal-pro'
  },
  {
    id: 'aurora',
    name: 'AURORA',
    alias: 'Biolumi Sovereign',
    role: 'Cinema Co-Lead & Chief Engineer',
    actorStyle: 'High-Fidelity 3D Cinema Production Model',
    skinTone: 'Iridescent pearl porcelain with subtle bio-reactive luminescence',
    hair: 'Volumetric lavender-silver strands reacting to atmospheric magnetic fields',
    eyes: 'Dual-tone amber and ultraviolet prismatic pupils',
    distinguishingFeatures: [
      'Fluid liquid-metal gauntlets with real-time waveform monitors',
      'Acoustic spectrum visor syncing with DTS 7.1 master stems',
      'Master architect of the 4K HDR Bioluminescent color grading pass'
    ],
    clothing: 'Aerogel flight coat with dynamic fiber-optic edge illumination',
    animationDemeanor: 'Graceful, visionary, commanding command deck demeanor.',
    backstory: 'Visionary architect behind the KNOCKSSTUDiOS enterprise pipeline, calibrating 4K Rec.2020 color science and spatial acoustic depth.',
    quote: '"Color is emotion, and light is our canvas. Never dim your brilliance."',
    colorTheme: '#E040FB',
    avatarSeed: 'aurora-pro'
  },
  {
    id: 'vance',
    name: 'VANCE',
    alias: 'The Director',
    role: 'Executive Technical Director',
    actorStyle: 'Stylized 3D Hollywood Character',
    skinTone: 'Weathered warm bronze',
    hair: 'Iron gray textured sweep',
    eyes: 'Sharp hawk-like hazel optics',
    distinguishingFeatures: ['Director viewfinder pendant', 'Tactical multi-display comms cuff'],
    clothing: 'Tailored studio ballistic bomber jacket with KNOCKSSTUDiOS bullion crest',
    animationDemeanor: 'Energetic, laser-focused, decisive master craftsperson.',
    backstory: 'Legendary Hollywood director overseeing the Veo 3 generation cluster and native Windows Rust engine deployment.',
    quote: '"Action! Roll 4K HDR master, lock the watermark, and stream the stems."',
    colorTheme: '#D4AF37',
    avatarSeed: 'vance-pro'
  }
];

export const SCRIPT_SCENES = [
  {
    id: 'scene-1',
    act: 1,
    title: 'Act 1: Orbital Relay Arrival',
    location: 'Deep Orbit Star Station & Earth Departure Bay',
    timeOfDay: 'Solar Eclipse - Earth Rim Corona',
    synopsis: 'Knocturnal boards the orbital relay to secure the studio master data drive. Volumetric thruster plumes ignite in deep space silence.',
    musicCue: 'Sub-bass drone transitioning to swelling French horns & DTS 7.1 surround brass',
    lightingCue: 'High-contrast solar backlight with deep cold void ambient reflections',
    dialogue: [
      { speaker: 'KNOCTURNAL', text: 'All encrypted telemetry secured. Master cinema files ready for Windows Rust transmission.' },
      { speaker: 'AURORA', text: 'Telemetry verified. 4K HDR bitstream locked at 128 Mbps. Clear for hyper-jump.' },
      { speaker: 'VANCE', text: 'Roll cameras. Let us make cinema history.' }
    ],
    recommendedPrompt: '4K cinema shot of a futuristic starship docking at an immense space station orbiting Earth during a solar eclipse, brilliant corona rim lighting, photorealistic HDR.'
  },
  {
    id: 'scene-2',
    act: 2,
    title: 'Act 2: The Bioluminescent Abyss',
    location: 'Sub-aquatic Crystal Trench Facility',
    timeOfDay: 'Deep Ocean Eternal Twilight',
    synopsis: 'Aurora navigates the illuminated trench as millions of bioluminescent aquatic beings react to her acoustic frequency array.',
    musicCue: 'Ethereal female vocals echoing through spatial delay beds with cello swells',
    lightingCue: 'Deep cyan and ultraviolet caustics painting the metallic hulls',
    dialogue: [
      { speaker: 'AURORA', text: 'Look at the color response. Nature already solved the bioluminescent palette millions of years ago.' },
      { speaker: 'KNOCTURNAL', text: 'It is breathtaking. Capturing 10-bit Rec.2020 raw feed now.' }
    ],
    recommendedPrompt: 'Cinematic wide angle shot of a high-tech submersible approaching a glowing underwater crystal trench, thousands of bioluminescent creatures emitting pulsing cyan and magenta light.'
  },
  {
    id: 'scene-3',
    act: 3,
    title: 'Act 3: Liquid Chrome Metamorphosis',
    location: 'KNOCKSSTUDiOS Master Stage Core',
    timeOfDay: 'Midnight Cyber Studio Apex',
    synopsis: 'The studio central reactor unlocks its ultimate liquid metal state, forming the iconic KNOCKSSTUDiOS enterprise emblem in full iridescent chrome.',
    musicCue: 'Massive orchestral crescendo with DTS 7.1 sub-harmonic impact',
    lightingCue: 'Prismatic rainbow dispersion across mirror chrome surfaces',
    dialogue: [
      { speaker: 'VANCE', text: 'Hardware accelerated performance. 100% first-party Google GenAI power.' },
      { speaker: 'KNOCTURNAL', text: 'KNOCKSSTUDiOS is live worldwide.' }
    ],
    recommendedPrompt: 'Extreme close up of molten iridescent chrome metal flowing and solidifying into a high-tech glowing cinema logo, surrounded by particle lasers and volumetric smoke, 4K HDR.'
  }
];

export const COLOR_GRADING_PRESETS = [
  {
    presetName: 'Bioluminescent Ultra Cinema',
    lut: 'biolumi-cyan' as const,
    brightness: 1.05,
    contrast: 1.28,
    saturation: 1.35,
    bioluminescence: 0.85,
    anamorphicFlare: true,
    filmGrain: 0.18,
    vignette: 0.45,
    bloom: 0.65,
    aspectRatioMatte: '2.39:1' as const,
    description: 'Neon cyan, electric teal & sunset orange palette tuned for 4K HDR nighttime scenes.'
  },
  {
    presetName: 'Pixar Warmth & Golden Hour',
    lut: 'pixar-warm' as const,
    brightness: 1.12,
    contrast: 1.18,
    saturation: 1.25,
    bioluminescence: 0.35,
    anamorphicFlare: false,
    filmGrain: 0.08,
    vignette: 0.25,
    bloom: 0.45,
    aspectRatioMatte: '16:9' as const,
    description: 'Rich amber skin tones, soft yarn textures and cozy golden illumination.'
  },
  {
    presetName: 'Cyber Neon 3D (Pink Chrome)',
    lut: 'cyber-neon' as const,
    brightness: 1.0,
    contrast: 1.4,
    saturation: 1.5,
    bioluminescence: 1.0,
    anamorphicFlare: true,
    filmGrain: 0.22,
    vignette: 0.55,
    bloom: 0.9,
    aspectRatioMatte: '2.39:1' as const,
    description: 'Iridescent pink chrome, rainbow smoke and high-voltage studio VFX.'
  },
  {
    presetName: 'Melancholic Piano & Night Rain',
    lut: 'melancholy-bw' as const,
    brightness: 0.95,
    contrast: 1.35,
    saturation: 0.2,
    bioluminescence: 0.4,
    anamorphicFlare: true,
    filmGrain: 0.35,
    vignette: 0.65,
    bloom: 0.3,
    aspectRatioMatte: '2.39:1' as const,
    description: 'Desaturated mood for emotional reflection, teardrops, and quiet acoustic nights.'
  }
];

export const WINDOWS_RUST_PACKAGE_FILES = [
  {
    name: 'Cargo.toml',
    path: 'Cargo.toml',
    description: 'Rust Package Configuration for 4K Ultra Cinema Windows Native App',
    type: 'toml' as const,
    content: `[package]
name = "knocksstudios-cinema"
version = "1.0.0"
edition = "2021"
authors = ["KNOCKSSTUDiOS <hollywoodimaging.studio>"]
description = "KNOCKSSTUDiOS Hollywood Motion Pictures - 4K HDR Ultra Cinema Windows Native Studio Package"
license = "Proprietary"

[dependencies]
# Native Desktop Windowing & Hardware-accelerated WebView
tao = "0.29"
wry = "0.45"

# Async Runtime & HTTP Client (First-Party Google GenAI Direct IPC)
tokio = { version = "1.38", features = ["full"] }
reqwest = { version = "0.12", features = ["json", "stream"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Windows OS Native APIs (DirectX, HDR, Window Styling, Tray)
[target.'cfg(windows)'.dependencies]
windows = { version = "0.58", features = [
    "Win32_UI_WindowsAndMessaging",
    "Win32_Graphics_Gdi",
    "Win32_System_SystemInformation",
    "Win32_System_Threading"
] }

[build-dependencies]
winres = "0.1"

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true
`
  },
  {
    name: 'main.rs',
    path: 'src/main.rs',
    description: 'Rust Native Windows Entry Point with 4K HDR Hardware Acceleration & Google GenAI Bridge',
    type: 'rust' as const,
    content: `// KNOCKSSTUDiOS Hollywood Motion Pictures - Windows Native Studio App
// 4K Ultra Cinema 3D/2D Engine & Google GenAI First-Party Bridge
// Production Release - Standalone Desktop Execution

#![windows_subsystem = "windows"]

use std::sync::Arc;
use tao::{
    dpi::LogicalSize,
    event::{Event, StartCause, WindowEvent},
    event_loop::{ControlFlow, EventLoop},
    window::{Icon, WindowBuilder},
};
use wry::{WebView, WebViewBuilder};

const STUDIO_TITLE: &str = "KNOCKSSTUDiOS | Hollywood MOTiON Pictures - 4K Ultra Cinema";
const DEFAULT_STUDIO_URL: &str = "https://ais-pre-bbkvyukdnyc225tafw6xrj-187094173481.us-west2.run.app";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!(">>> Starting KNOCKSSTUDiOS Windows Native Studio Runtime...");
    println!(">>> Initializing 4K HDR Ultra Cinema & Dolby DTS Spatial Pipeline...");

    let event_loop = EventLoop::new();

    // Configure 4K Cinema Window with native Windows sizing
    let window = WindowBuilder::new()
        .with_title(STUDIO_TITLE)
        .with_inner_size(LogicalSize::new(1600.0, 960.0))
        .with_min_inner_size(LogicalSize::new(1024.0, 720.0))
        .with_decorations(true)
        .with_resizable(true)
        .with_maximized(false)
        .build(&event_loop)?;

    // Configure WebView with Windows WebView2 Hardware Acceleration
    let webview = WebViewBuilder::new(&window)
        .with_url(DEFAULT_STUDIO_URL)
        .with_devtools(true)
        .with_initialization_script(r#"
            window.__KNOCKSSTUDIOS_WINDOWS_NATIVE__ = {
                version: "1.0.0",
                platform: "windows-x86_64-rust",
                hdrEnabled: true,
                dtsSurround: true
            };
            console.log("[Rust Native] KNOCKSSTUDiOS Windows runtime connected.");
        "#)
        .with_ipc_handler(|msg| {
            println!("[Rust IPC] Message received from Studio UI: {}", msg);
            // Handle studio commands directly in Rust (e.g. file export, local video render)
        })
        .build()?;

    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        match event {
            Event::NewEvents(StartCause::Init) => {
                println!(">>> KNOCKSSTUDiOS Windows Application initialized.");
            }
            Event::WindowEvent {
                event: WindowEvent::CloseRequested,
                ..
            } => {
                println!(">>> Shutting down KNOCKSSTUDiOS studio window.");
                *control_flow = ControlFlow::Exit;
            }
            _ => (),
        }
    });
}
`
  },
  {
    name: 'launch-knocksstudios.bat',
    path: 'launch-knocksstudios.bat',
    description: 'Windows Instant Launcher Batch Script (Supports Rust Binary & Web Standalone)',
    type: 'batch' as const,
    content: `@echo off
rem =========================================================================
rem KNOCKSSTUDiOS | Hollywood MOTiON Pictures - Windows Launcher
rem 4K HDR Ultra Cinema 3D/2D Studio & Veo 3 Video Generator
rem =========================================================================

setlocal EnableDelayedExpansion
setlocal EnableExtensions

title KNOCKSSTUDiOS - Hollywood Motion Pictures [Windows Engine]
color 0B

echo.
echo  ================================================================
echo   KNOCKSSTUDiOS - HOLLYWOOD MOTION PICTURES [4K ULTRA CINEMA]
echo   Engine: Windows Native 64-Bit Desktop Package
echo   Hardware Acceleration: DirectX 12 / Vulkan / Dolby DTS
echo  ================================================================
echo.

rem Check for pre-compiled Rust Native Executable
if exist "target\\release\\knocksstudios-cinema.exe" (
    echo [OK] Found compiled Rust Windows native executable!
    echo [RUN] Launching target\\release\\knocksstudios-cinema.exe ...
    start "" "target\\release\\knocksstudios-cinema.exe" %*
    exit /b 0
)

rem Check for cargo in PATH to run with Rust
where cargo >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [INFO] Rust Cargo detected in system PATH.
    echo [RUN] Launching via: cargo run --release ...
    start "" cargo run --release
    exit /b 0
)

rem Fallback to Windows Native Web Engine App Kiosk
echo [FALLBACK] Rust binary not found in root, launching high-performance Windows WebView...
set STUDIO_URL=https://ais-pre-bbkvyukdnyc225tafw6xrj-187094173481.us-west2.run.app

where msedge >nul 2>&1
if %ERRORLEVEL% equ 0 (
    start msedge --app="%STUDIO_URL%" --enable-gpu-rasterization --enable-zero-copy --ignore-gpu-blocklist
    exit /b 0
)

start "" "%STUDIO_URL%"
exit /b 0
`
  },
  {
    name: 'install-rust-windows.cmd',
    path: 'install-rust-windows.cmd',
    description: 'One-Click Automated Windows Setup & Cargo Build Script',
    type: 'batch' as const,
    content: `@echo off
rem Automated Rust Toolchain & Studio Compiler for Windows
setlocal EnableDelayedExpansion

echo.
echo ==============================================================
echo  KNOCKSSTUDiOS - Automated Windows Rust Package Builder
echo ==============================================================
echo.

where rustc >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] Rust toolchain not detected on your Windows machine.
    echo [*] Downloading rustup-init.exe from official rust-lang.org...
    powershell -Command "Invoke-WebRequest -Uri 'https://win.rustup.rs/x86_64' -OutFile 'rustup-init.exe'"
    if exist "rustup-init.exe" (
        echo [*] Running rustup installer...
        start /wait rustup-init.exe -y
        del rustup-init.exe
        set "PATH=%USERPROFILE%\\.cargo\\bin;%PATH%"
    ) else (
        echo [ERROR] Failed to download rustup. Please install from https://rustup.rs
        pause
        exit /b 1
    )
)

echo [OK] Rust compiler verified:
rustc --version
cargo --version

echo.
echo [*] Compiling KNOCKSSTUDiOS 4K Cinema Native Executable (Release Mode)...
cargo build --release

if %ERRORLEVEL% equ 0 (
    echo.
    echo [SUCCESS] Windows native executable compiled: target\\release\\knocksstudios-cinema.exe
    echo [RUN] Launching now...
    start "" "target\\release\\knocksstudios-cinema.exe"
) else (
    echo [ERROR] Build encountered an issue. Make sure Visual Studio C++ Build Tools are installed.
)

pause
`
  },
  {
    name: 'build.rs',
    path: 'build.rs',
    description: 'Windows Manifest & Icon Compiler',
    type: 'rust' as const,
    content: `fn main() {
    #[cfg(windows)]
    {
        let mut res = winres::WindowsResource::new();
        res.set("FileDescription", "KNOCKSSTUDiOS Hollywood Motion Pictures Studio");
        res.set("ProductName", "KNOCKSSTUDiOS 4K Cinema");
        res.set("LegalCopyright", "Copyright (C) 2026 KNOCKSSTUDiOS");
        if let Err(e) = res.compile() {
            eprintln!("Warning: Failed to compile Windows resource: {}", e);
        }
    }
}
`
  }
];

export const DEFAULT_WATERMARK_CONFIG = {
  enabled: true,
  text: 'KNOCKSSTUDiOS • PRE-RELEASE SCREENER • STRICTLY CONFIDENTIAL',
  position: 'bottom-right' as const,
  opacity: 70,
  fontSize: 13,
  color: 'cyan' as const,
  showTimecode: true,
  showFingerprint: true,
  fingerprintId: 'STUDIO-OPERATOR [0x7F4A-C108]',
  drmProtection: true,
  aspectRatioMatte: true,
};

export const DEFAULT_ANALYTICS_DATA = {
  totalScenesRendered: 19,
  total4KMinutes: 14.8,
  gpuComputeHours: 6.4,
  averageVeoLatencySec: 1.74,
  activeRec2020BitrateMbps: 128.5,
  dtsAudioStemsExported: 28,
  gdriveBackupsSynced: 12,
  enterpriseMasterStats: {
    renderPassEfficiency: 99.4,
    colorGradeIntegrity: 99.8,
    dtsBitstreamAccuracy: 100.0,
    hdrPeakLuminanceNits: 4000,
    av1HardwareEncodingFps: 120,
    cinemaDeliveryCompliance: 'DCI-P3 / Rec.2020 Tier 1',
  },
  liveEvents: [
    {
      id: 'ev-1',
      timestamp: '08:26:14',
      category: 'VEO_RENDER' as const,
      message: 'Veo 3 4K HDR Pass completed: Scene 01 (Cyberpunk Metropolis) @ 3840x2160 60fps',
      status: 'SUCCESS' as const,
    },
    {
      id: 'ev-2',
      timestamp: '08:24:02',
      category: 'COLOR_PASS' as const,
      message: 'Bioluminescent Cyan LUT applied with 35mm grain & anamorphic blue streak',
      status: 'SUCCESS' as const,
    },
    {
      id: 'ev-3',
      timestamp: '08:21:40',
      category: 'GDRIVE_SYNC' as const,
      message: 'Google Drive cloud backup synchronized: "KNOCKSSTUDiOS_Master_Project.json"',
      status: 'SYNCED' as const,
    },
    {
      id: 'ev-4',
      timestamp: '08:19:15',
      category: 'DTS_AUDIO' as const,
      message: 'DTS 7.1 Master Stem Rendered (Full Dynamic Range DCI Specification)',
      status: 'SUCCESS' as const,
    },
    {
      id: 'ev-5',
      timestamp: '08:15:00',
      category: 'WATERMARK_DRM' as const,
      message: 'Dynamic anti-piracy fingerprint verified for studio operator [0x7F4A]',
      status: 'ACTIVE' as const,
    },
  ],
};

export const DEFAULT_GDRIVE_SYNC_STATE = {
  isConnected: true,
  lastBackupTime: 'Just now',
  totalBackedUpMb: 486.2,
  autoSync: true,
  syncIntervalMinutes: 15,
  folderTarget: 'My Drive / KNOCKSSTUDiOS / Enterprise Master Productions',
  pendingFilesCount: 0,
};

