/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Eye,
  Layers,
  Sparkles,
  RotateCw,
  Maximize2,
  Minimize2,
  Sliders,
  Cpu,
  Tv,
  Compass,
  Zap,
  Activity,
  Box
} from 'lucide-react';

interface Studio3DStageProps {
  activeTitle?: string;
  bioluminescenceHue?: 'cyan' | 'orange' | 'gold' | 'pink';
}

export const Studio3DStage: React.FC<Studio3DStageProps> = ({
  activeTitle = 'KNOCKSSTUDiOS',
  bioluminescenceHue = 'cyan',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [renderMode, setRenderMode] = useState<'lit' | 'wireframe' | 'nanite'>('lit');
  const [activeHue, setActiveHue] = useState<'cyan' | 'orange' | 'gold' | 'pink'>(bioluminescenceHue);
  const [isFullWindow, setIsFullWindow] = useState(false);
  const [cameraTelemetry, setCameraTelemetry] = useState({
    x: '0.00',
    y: '1.80',
    z: '8.50',
    yaw: '0.0°',
    pitch: '-8.5°',
    fps: 120,
  });
  const [showGrid, setShowGrid] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Sync activeHue if prop changes
  useEffect(() => {
    setActiveHue(bioluminescenceHue);
  }, [bioluminescenceHue]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 460;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03050a, 0.045);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 8.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.replaceChildren(renderer.domElement);

    // 2. Studio Lighting & Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        top: { value: new THREE.Color(0x0c1630) },
        mid: { value: new THREE.Color(0x04060c) },
        bot: { value: new THREE.Color(0x180902) },
      },
      vertexShader: `varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
      fragmentShader: `varying vec3 p;uniform vec3 top;uniform vec3 mid;uniform vec3 bot;void main(){float h=normalize(p).y;vec3 c=h>0.0?mix(mid,top,h):mix(mid,bot,-h);gl_FragColor=vec4(c,1.0);}`,
    });
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 32), skyMat));

    const addLightPanel = (c: number, x: number, y: number, z: number, sx: number, sy: number) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(sx, sy),
        new THREE.MeshBasicMaterial({ color: c })
      );
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      envScene.add(m);
    };

    addLightPanel(0x00e5ff, -14, 8, 8, 20, 12);
    addLightPanel(0xff6a00, 14, -4, 6, 18, 10);
    addLightPanel(0x0077ff, 0, 14, -6, 12, 8);
    addLightPanel(0xffffff, 2, 3, 14, 8, 4);
    scene.environment = pmrem.fromScene(envScene, 0.03).texture;

    // Hue mapping
    const getHexColor = (hue: string) => {
      switch (hue) {
        case 'orange':
        case 'gold':
          return 0xff8c00;
        case 'pink':
          return 0xff1493;
        case 'cyan':
        default:
          return 0x00e5ff;
      }
    };
    const keyHex = getHexColor(activeHue);

    const keyLight = new THREE.PointLight(keyHex, 320, 45);
    keyLight.position.set(6, 6, 7);

    const rimLight = new THREE.PointLight(0xff6a00, 220, 45);
    rimLight.position.set(-7, -3, -5);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(0, 8, 4);

    scene.add(keyLight, rimLight, fillLight, new THREE.AmbientLight(0x0e1422, 1.4));

    // 3. Infinite Ground Perspective Grid
    const gridGroup = new THREE.Group();

    // Large primary coordinate grid
    const mainGrid = new THREE.GridHelper(36, 36, keyHex, 0x18243c);
    mainGrid.position.y = -1.8;
    (mainGrid.material as THREE.Material).transparent = true;
    (mainGrid.material as THREE.Material).opacity = 0.55;
    gridGroup.add(mainGrid);

    // Fine inner sub-grid
    const fineGrid = new THREE.GridHelper(36, 144, 0x00e5ff, 0x0a1220);
    fineGrid.position.y = -1.79;
    (fineGrid.material as THREE.Material).transparent = true;
    (fineGrid.material as THREE.Material).opacity = 0.25;
    gridGroup.add(fineGrid);

    // Coordinate Axis lines (X in red/cyan, Z in blue)
    const axisMatX = new THREE.LineBasicMaterial({ color: keyHex, transparent: true, opacity: 0.8 });
    const axisGeoX = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-18, -1.78, 0),
      new THREE.Vector3(18, -1.78, 0),
    ]);
    const axisX = new THREE.Line(axisGeoX, axisMatX);
    gridGroup.add(axisX);

    const axisMatZ = new THREE.LineBasicMaterial({ color: 0x0077ff, transparent: true, opacity: 0.8 });
    const axisGeoZ = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.78, -18),
      new THREE.Vector3(0, -1.78, 18),
    ]);
    const axisZ = new THREE.Line(axisGeoZ, axisMatZ);
    gridGroup.add(axisZ);

    gridGroup.visible = showGrid;
    scene.add(gridGroup);

    // 4. 3D Cinema Camera Frustum Model
    const cameraRigGroup = new THREE.Group();

    const isWire = renderMode === 'wireframe';
    const isNanite = renderMode === 'nanite';

    const metallicMaterial = new THREE.MeshStandardMaterial({
      color: isNanite ? 0x00e5ff : 0x111624,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: isWire,
      envMapIntensity: 2.0,
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: isNanite ? keyHex : 0xffffff,
      metalness: 0.98,
      roughness: 0.05,
      wireframe: isWire,
      envMapIntensity: 2.5,
    });

    const glowAccentMaterial = new THREE.MeshStandardMaterial({
      color: keyHex,
      emissive: keyHex,
      emissiveIntensity: 0.6,
      wireframe: isWire,
    });

    // Camera Body Box
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.9, 1.8);
    const cameraBody = new THREE.Mesh(bodyGeo, metallicMaterial);
    cameraBody.position.set(0, 0, 0);
    cameraRigGroup.add(cameraBody);

    // Cinema Matte Box (Front)
    const matteBoxGeo = new THREE.BoxGeometry(1.6, 1.1, 0.4);
    const matteBox = new THREE.Mesh(matteBoxGeo, metallicMaterial);
    matteBox.position.set(0, 0, 1.1);
    cameraRigGroup.add(matteBox);

    // Lens Barrel Cylinder with Anamorphic Ring
    const lensGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.9, 32);
    lensGeo.rotateX(Math.PI / 2);
    const lens = new THREE.Mesh(lensGeo, chromeMaterial);
    lens.position.set(0, 0, 0.65);
    cameraRigGroup.add(lens);

    // Glowing Focus Ring
    const ringGeo = new THREE.TorusGeometry(0.5, 0.04, 16, 48);
    const focusRing = new THREE.Mesh(ringGeo, glowAccentMaterial);
    focusRing.position.set(0, 0, 0.8);
    cameraRigGroup.add(focusRing);

    // Top Handle
    const handleGeo = new THREE.BoxGeometry(0.25, 0.18, 1.2);
    const handle = new THREE.Mesh(handleGeo, metallicMaterial);
    handle.position.set(0, 0.62, -0.1);
    cameraRigGroup.add(handle);

    // Hollywood Viewfinder / Monitor
    const monitorArmGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 12);
    const arm = new THREE.Mesh(monitorArmGeo, metallicMaterial);
    arm.position.set(-0.9, 0.3, 0.2);
    arm.rotateZ(Math.PI / 3);
    cameraRigGroup.add(arm);

    const screenGeo = new THREE.BoxGeometry(0.08, 0.65, 0.9);
    const screen = new THREE.Mesh(screenGeo, glowAccentMaterial);
    screen.position.set(-1.15, 0.45, 0.2);
    cameraRigGroup.add(screen);

    // Optical Cinema Light Ray Frustum Cone projecting from lens
    const frustumGeo = new THREE.ConeGeometry(2.4, 4.2, 4, 1, true);
    frustumGeo.rotateX(-Math.PI / 2);
    const frustumMat = new THREE.MeshBasicMaterial({
      color: keyHex,
      wireframe: true,
      transparent: true,
      opacity: isNanite ? 0.4 : 0.16,
    });
    const frustumMesh = new THREE.Mesh(frustumGeo, frustumMat);
    frustumMesh.position.set(0, 0, 3.2);
    cameraRigGroup.add(frustumMesh);

    // Interlocking Dual Torus Studio Emblem floating above camera
    const emblemGroup = new THREE.Group();
    const emblemTorusGeo = new THREE.TorusGeometry(0.65, 0.12, 24, 64);
    const torusA = new THREE.Mesh(emblemTorusGeo, chromeMaterial);
    const torusB = new THREE.Mesh(emblemTorusGeo, chromeMaterial);
    torusB.rotation.x = Math.PI / 2;
    torusB.position.x = 0.45;
    emblemGroup.add(torusA, torusB);
    emblemGroup.position.set(-0.22, 1.4, 0);
    cameraRigGroup.add(emblemGroup);

    // 5. Volumetric Floating Coordinate Nodes & Particles (Zero Empty Space)
    const nodeCount = 120;
    const nodeGeo = new THREE.BufferGeometry();
    const nodePos = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      nodePos[i * 3] = (Math.random() - 0.5) * 16;
      nodePos[i * 3 + 1] = (Math.random() - 0.2) * 8 - 1.0;
      nodePos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: keyHex,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    });
    const nodeParticles = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodeParticles);

    // Surrounding Bounding Box (Stage Actor Gizmo)
    const bboxGeo = new THREE.BoxGeometry(4.2, 3.4, 5.0);
    const bboxMat = new THREE.MeshBasicMaterial({
      color: keyHex,
      wireframe: true,
      transparent: true,
      opacity: isWire ? 0.35 : 0.12,
    });
    const bboxMesh = new THREE.Mesh(bboxGeo, bboxMat);
    bboxMesh.position.set(0, 0.4, 1.0);
    cameraRigGroup.add(bboxMesh);

    scene.add(cameraRigGroup);

    // 6. Interactive Mouse Navigation & Orbit Controls
    let targetYaw = 0.2;
    let targetPitch = 0.08;
    let currentYaw = 0.2;
    let currentPitch = 0.08;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        targetYaw += dx * 0.006;
        targetPitch = Math.max(-0.4, Math.min(0.6, targetPitch + dy * 0.006));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        // Gentle tilt parallax
        const rect = container.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetYaw = nx * 0.6;
        targetPitch = ny * 0.35;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || 460;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // FPS Calculation
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        const measuredFps = Math.round((frameCount * 1000) / (now - lastFpsTime));
        setCameraTelemetry((prev) => ({
          ...prev,
          fps: Math.min(120, measuredFps),
        }));
        frameCount = 0;
        lastFpsTime = now;
      }

      // Smooth camera orientation
      if (isAutoRotate && !isDragging) {
        targetYaw += dt * 0.25;
      }

      currentYaw = THREE.MathUtils.lerp(currentYaw, targetYaw, 0.08);
      currentPitch = THREE.MathUtils.lerp(currentPitch, targetPitch, 0.08);

      const radius = 8.5;
      const camX = Math.sin(currentYaw) * radius;
      const camZ = Math.cos(currentYaw) * radius;
      const camY = 1.8 + Math.sin(currentPitch) * 4.0;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0.2, 0);

      // Camera model gentle floating & emblem rotation
      cameraRigGroup.position.y = Math.sin(elapsed * 1.8) * 0.08;
      emblemGroup.rotation.y += dt * 0.8;
      emblemGroup.rotation.z = Math.sin(elapsed) * 0.15;
      nodeParticles.rotation.y -= dt * 0.08;

      // Telemetry update throttling
      if (frameCount % 10 === 0) {
        setCameraTelemetry((prev) => ({
          ...prev,
          x: camX.toFixed(2),
          y: camY.toFixed(2),
          z: camZ.toFixed(2),
          yaw: `${((currentYaw * 180) / Math.PI % 360).toFixed(1)}°`,
          pitch: `${((-currentPitch * 180) / Math.PI).toFixed(1)}°`,
        }));
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      pmrem.dispose();
      skyMat.dispose();
    };
  }, [activeHue, renderMode, showGrid, isAutoRotate, isFullWindow]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#030509] border border-[#00E5FF]/25 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col select-none group">
      {/* VIEWPORT TOP TELEMETRY BAR */}
      <div className="relative z-30 px-3 sm:px-4 py-2 bg-[#060912]/95 border-b border-gray-800/90 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* Left: Viewport Modes */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[#00E5FF] font-bold">
            <Tv className="w-3 h-3 text-[#00E5FF]" />
            <span>[PERSPECTIVE]</span>
          </div>

          {/* Render Mode Selectors */}
          <div className="flex items-center bg-gray-950/80 p-0.5 rounded border border-gray-800 text-[11px]">
            <button
              onClick={() => setRenderMode('lit')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                renderMode === 'lit' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              LIT HDR
            </button>
            <button
              onClick={() => setRenderMode('wireframe')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                renderMode === 'wireframe' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              WIREFRAME
            </button>
            <button
              onClick={() => setRenderMode('nanite')}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                renderMode === 'nanite' ? 'bg-[#00E5FF] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              NANITE
            </button>
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-0.5 rounded text-[11px] border transition-all cursor-pointer ${
              showGrid
                ? 'bg-gray-800 border-[#00E5FF]/40 text-[#00E5FF]'
                : 'bg-gray-950 border-gray-800 text-gray-500'
            }`}
          >
            GRID: {showGrid ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-2 py-0.5 rounded text-[11px] border transition-all cursor-pointer ${
              isAutoRotate
                ? 'bg-gray-800 border-[#00E5FF]/40 text-[#00E5FF]'
                : 'bg-gray-950 border-gray-800 text-gray-500'
            }`}
          >
            ORBIT: {isAutoRotate ? 'AUTO' : 'DRAG'}
          </button>

          {/* Full Window / Elastic WebGL Stage Toggle */}
          <button
            onClick={() => setIsFullWindow(!isFullWindow)}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] border transition-all cursor-pointer ${
              isFullWindow
                ? 'bg-[#00E5FF] text-black border-[#00E5FF] font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'bg-gray-900 border-gray-800 text-[#00E5FF] hover:bg-gray-800'
            }`}
            title="Toggle Elastic Full Window Cinema Viewport"
          >
            {isFullWindow ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            <span>{isFullWindow ? 'STANDARD VIEW' : 'FULL WINDOW STAGE'}</span>
          </button>
        </div>

        {/* Right: Engine Telemetry & Active Status Badge */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="hidden md:flex items-center gap-1.5 text-gray-400">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>VULKAN/DX12</span>
            <span className="text-gray-600">&bull;</span>
            <span className="text-emerald-400 font-bold">{cameraTelemetry.fps} FPS</span>
          </div>

          {/* Active Cinema Pipeline Badge */}
          <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 font-bold tracking-wider text-[10px] uppercase shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            CINEMA PIPELINE ACTIVE
          </div>
        </div>
      </div>

      {/* 3D WEBGL VIEWPORT CANVAS - ELASTIC RESIZABLE */}
      <div className={`relative w-full transition-all duration-500 ease-out cursor-grab active:cursor-grabbing overflow-hidden ${
        isFullWindow ? 'h-[580px] sm:h-[660px]' : 'h-72 sm:h-80 md:h-[400px]'
      }`}>
        {/* Background Digital Horizon & Cyber Grid Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_30%,rgba(0,229,255,0.06),rgba(0,0,0,0.9))] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c132210_1px,transparent_1px),linear-gradient(to_bottom,#0c132210_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* WebGL Canvas Container */}
        <div ref={mountRef} className="absolute inset-0 z-0 w-full h-full" />

        {/* Center Screen Theatrical Title Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#030610]/80 border border-[#00E5FF]/30 backdrop-blur-md text-[#00E5FF] text-[11px] uppercase tracking-widest font-mono font-bold mb-2 shadow-[0_0_20px_rgba(0,229,255,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping" />
            4K HDR CINEMA 3D STAGE &bull; DIRECTX / VULKAN
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider uppercase font-display bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,229,255,0.45)]">
            {activeTitle}
          </h1>

          <p className="text-gray-300 font-semibold tracking-widest uppercase text-xs sm:text-sm mt-2 flex items-center justify-center gap-2 drop-shadow">
            <span>Hollywood Motion Pictures</span>
            <span className="text-[#00E5FF]">&bull;</span>
            <span className="text-gray-400">35mm T1.5 Anamorphic</span>
          </p>

          <div className="mt-3 inline-block px-3 py-1 rounded-lg bg-black/40 border border-gray-800/80 text-[10px] text-gray-400 font-mono">
            Drag mouse to orbit camera &bull; Scroll to zoom &bull; Click modes to inspect
          </div>
        </div>

        {/* Unreal Engine Viewport Corner Crosshairs */}
        <div className="absolute top-4 left-4 pointer-events-none text-gray-600 font-mono text-[10px]">
          + [X: -100, Y: +100]
        </div>
        <div className="absolute top-4 right-4 pointer-events-none text-gray-600 font-mono text-[10px]">
          + [X: +100, Y: +100]
        </div>
        <div className="absolute bottom-4 left-4 pointer-events-none text-gray-600 font-mono text-[10px]">
          + [X: -100, Y: -100]
        </div>
        <div className="absolute bottom-4 right-4 pointer-events-none text-gray-600 font-mono text-[10px]">
          + [X: +100, Y: -100]
        </div>
      </div>

      {/* UNREAL ENGINE / EGUI BOTTOM STATUS & CAMERA COORDINATES BAR */}
      <div className="relative z-30 px-3 sm:px-4 py-2 bg-[#060912]/95 border-t border-gray-800/90 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-400">
        {/* Real-time Camera Telemetry */}
        <div className="flex items-center gap-2.5 text-[11px]">
          <span className="text-gray-500 font-bold">CAM:</span>
          <span>X: <strong className="text-white">{cameraTelemetry.x}</strong></span>
          <span>Y: <strong className="text-white">{cameraTelemetry.y}</strong></span>
          <span>Z: <strong className="text-white">{cameraTelemetry.z}</strong></span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="hidden sm:inline">YAW: <strong className="text-[#00E5FF]">{cameraTelemetry.yaw}</strong></span>
          <span className="hidden sm:inline">PITCH: <strong className="text-[#00E5FF]">{cameraTelemetry.pitch}</strong></span>
        </div>

        {/* Bioluminescent Hue Palette Swatches */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500">LUT HUE:</span>
          {[
            { id: 'cyan', color: 'bg-[#00E5FF]' },
            { id: 'orange', color: 'bg-[#FF8C00]' },
            { id: 'pink', color: 'bg-[#FF1493]' },
          ].map((h) => (
            <button
              key={h.id}
              onClick={() => setActiveHue(h.id as any)}
              className={`w-3.5 h-3.5 rounded-full ${h.color} border transition-all cursor-pointer ${
                activeHue === h.id ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'border-transparent opacity-60'
              }`}
              title={`Switch Hue to ${h.id}`}
            />
          ))}
        </div>

        {/* Theatrical SMPTE & Color Space */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="text-cyan-400 font-bold">REC.2020 10-BIT</span>
          <span className="text-gray-600">&bull;</span>
          <span className="text-amber-400">SMPTE 01:24:19:04</span>
        </div>
      </div>
    </div>
  );
};
