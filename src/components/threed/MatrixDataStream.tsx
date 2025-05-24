"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import * as THREE from "three";
import ThreeCanvas from "./ThreeCanvas";

// Vertex Shader
const dataStreamVertexShader = `
  attribute float baseSize; // Renamed from charIndex to avoid confusion, this is per-glyph base size
  attribute vec3 instanceColor; 
  attribute float charAtlasIndex; // Actual index into the character atlas
  attribute float streamSpeed;
  attribute float initialPhase;

  varying vec3 vColor;
  varying float vCharAtlasIndex; // Pass this to fragment
  varying float vDepth;
  varying float vActivation;
  varying float vIsLeader;

  uniform float uTime;
  uniform vec2 uMouse; // Normalized, -1 to 1 from parent component
  uniform float uPixelRatio;
  uniform float uStreamHeight;
  uniform float uMouseInfluenceRadius;
  uniform float uMousePushStrength;
  uniform float uCameraFov; 
  uniform float uMaxDepth; // Furthest point for glyphs
  uniform float uFalloffDepth; // Depth where falloff starts becoming significant

  void main() {
    vColor = instanceColor;
    vCharAtlasIndex = charAtlasIndex; // Use the correct attribute
    vec3 p = position;

    float currentY = mod(-uTime * streamSpeed * 0.035 + initialPhase, uStreamHeight);
    p.y = currentY - uStreamHeight / 2.0; 

    float leaderThreshold = uStreamHeight * 0.95; 
    vIsLeader = smoothstep(leaderThreshold, uStreamHeight, currentY);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mvPosition.z;

    vec4 projectedPosition = projectionMatrix * mvPosition;
    vec2 screenNdc = projectedPosition.xy / projectedPosition.w;
    float distToMouse = length(screenNdc - uMouse);
    vActivation = smoothstep(uMouseInfluenceRadius, 0.0, distToMouse);

    if (distToMouse < uMouseInfluenceRadius && vActivation > 0.01) { // Added vActivation check
      vec2 dirFromMouse = normalize(screenNdc - uMouse);
      float pushFactor = vActivation * uMousePushStrength * (1.0 - smoothstep(0.0, uFalloffDepth * 0.7, vDepth)); 
      mvPosition.xy += dirFromMouse * pushFactor;
    }
    
    float pointSize = baseSize * uPixelRatio; 
    pointSize *= (1.0 - smoothstep(0.0, uFalloffDepth, vDepth)); 
    pointSize *= (1.0 + vActivation * 1.5); 
    pointSize *= (1.0 + vIsLeader * 0.8); 
    
    gl_PointSize = pointSize * ( (uCameraFov / 2.0) / max(1.0, -mvPosition.z) ); 
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment Shader
const dataStreamFragmentShader = `
  uniform sampler2D uCharAtlas;
  uniform float uAtlasCharsPerRow;
  uniform float uTotalAtlasCharsOnAtlas; // Renamed for clarity
  uniform float uTime;
  uniform vec3 uLeaderColor;
  uniform vec3 uActivationColor;
  uniform float uMaxDepth; // Matching vertex shader
  uniform float uFalloffDepth;

  varying vec3 vColor;      
  varying float vCharAtlasIndex; // Use this from vertex shader
  varying float vDepth;
  varying float vActivation; 
  varying float vIsLeader;   

  float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

  void main() {
    float evolutionRate = 1.5 + vActivation * 5.0 + vIsLeader * 2.0;
    // Use vCharAtlasIndex as the base for evolution
    float currentShaderAtlasIndex = mod(floor(vCharAtlasIndex + uTime * evolutionRate + vDepth * 0.1), uTotalAtlasCharsOnAtlas);

    float charCol = mod(currentShaderAtlasIndex, uAtlasCharsPerRow);
    float charRow = floor(currentShaderAtlasIndex / uAtlasCharsPerRow);
    float atlasCellWidth = 1.0 / uAtlasCharsPerRow;
    float atlasTotalRows = ceil(uTotalAtlasCharsOnAtlas / uAtlasCharsPerRow);
    float atlasCellHeight = 1.0 / atlasTotalRows;

    vec2 uv = vec2(
      (charCol + gl_PointCoord.x) * atlasCellWidth,
      1.0 - ((charRow + (1.0 - gl_PointCoord.y)) * atlasCellHeight) 
    );

    float charAlpha = texture2D(uCharAtlas, uv).r; 

    if (charAlpha < 0.1) discard; 

    vec3 finalColor = vColor;
    finalColor = mix(finalColor, uLeaderColor, vIsLeader * 0.8); 
    finalColor = mix(finalColor, uActivationColor, vActivation * 0.7);

    float alpha = charAlpha;
    alpha *= smoothstep(uFalloffDepth, uFalloffDepth * 0.2, vDepth); 
    alpha *= (0.5 + vIsLeader * 0.5 + vActivation * 0.3); 
    alpha = clamp(alpha, 0.05, 0.95);

    if (random(gl_PointCoord.xy + mod(uTime*0.1 + vCharAtlasIndex, 100.0)) > 0.98 && vActivation < 0.1) { // Slower random flicker
      alpha *= 0.7;
    }

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const createCharacterAtlas = (
  chars: string,
  fontSize: number,
  atlasCharsPerRow: number,
  fontStack: string,
  color: string
): THREE.CanvasTexture => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get 2D context for character atlas");
    canvas.width = 1;
    canvas.height = 1;
    return new THREE.CanvasTexture(canvas);
  }

  const numTotalChars = chars.length;
  const numRowsOnAtlas = Math.ceil(numTotalChars / atlasCharsPerRow);
  const charRenderSize = Math.ceil(fontSize * 1.4);

  canvas.width = atlasCharsPerRow * charRenderSize;
  canvas.height = numRowsOnAtlas * charRenderSize;

  ctx.font = `${fontSize}px ${fontStack}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < numTotalChars; i++) {
    const char = chars[i];
    const col = i % atlasCharsPerRow;
    const row = Math.floor(i / atlasCharsPerRow);
    ctx.fillText(
      char,
      col * charRenderSize + charRenderSize / 2,
      row * charRenderSize + charRenderSize / 2
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
};

const DataStreamSketchFactory = ({
  scene,
  camera,
  parent,
}: {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  parent: HTMLElement;
}) => {
  let primaryColor = new THREE.Color(0x5d5fef);
  let accentColor = new THREE.Color(0x34d399);
  let leaderColor = new THREE.Color(0xffffff);

  if (typeof window !== "undefined") {
    const styles = getComputedStyle(document.documentElement);
    try {
      const primaryVar = styles.getPropertyValue("--primary").trim();
      if (primaryVar) primaryColor.set(primaryVar);
    } catch (e) {
      console.warn("Could not parse --primary color for matrix stream");
    }
    try {
      const accentVar = styles.getPropertyValue("--accent").trim();
      if (accentVar) accentColor.set(accentVar);
    } catch (e) {
      console.warn("Could not parse --accent color for matrix stream");
    }
    try {
      const fgVar = styles.getPropertyValue("--primary-foreground").trim();
      if (fgVar) leaderColor.set(fgVar);
    } catch (e) {
      console.warn("Could not parse --primary-foreground for matrix stream");
    }
  }

  const gujarati = "અઆઇઈઉઊઋએઐઓઔકખગઘચછજઝઞટઠડઢણતથદધનપફબભમયરલવશષસહળક્ષજ્ઞ";
  const devanagari =
    "ॐनमस्तेस्वागतम्कार्यम्प्रोग्रामिंग्भाषासंस्कृतम्ज्ञानविज्ञानम्";
  const programmatic = "01{}[]()<>/\\+-*%&=!?|:;#@$._";
  const fullCharSet = Array.from(
    new Set((gujarati + devanagari.replace(/\s/g, "") + programmatic).split(""))
  ).join("");

  const ATLAS_CHARS_PER_ROW = 16;
  const charAtlas = createCharacterAtlas(
    fullCharSet,
    64,
    ATLAS_CHARS_PER_ROW,
    "var(--font-geist-mono), var(--font-noto-gujarati), var(--font-noto-devanagari), monospace",
    "#FFFFFF"
  );

  const GLYPH_COUNT = 1200;
  const MAX_DEPTH = 18.0;
  const FALLOFF_DEPTH = 20.0;
  const STREAM_HEIGHT = 15.0;

  const positions = new Float32Array(GLYPH_COUNT * 3);
  const charAtlasIndices = new Float32Array(GLYPH_COUNT); // Renamed
  const streamSpeeds = new Float32Array(GLYPH_COUNT);
  const initialPhases = new Float32Array(GLYPH_COUNT);
  const instanceColors = new Float32Array(GLYPH_COUNT * 3);
  const baseSizes = new Float32Array(GLYPH_COUNT); // Added for vertex shader

  for (let i = 0; i < GLYPH_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = THREE.MathUtils.randFloatSpread(22);
    positions[i3 + 1] = 0;
    positions[i3 + 2] = THREE.MathUtils.randFloat(-MAX_DEPTH * 0.9, -1); // Start glyphs further back but not at 0

    charAtlasIndices[i] = Math.floor(Math.random() * fullCharSet.length);
    streamSpeeds[i] = THREE.MathUtils.randFloat(0.4, 1.4);
    initialPhases[i] = Math.random() * STREAM_HEIGHT;
    baseSizes[i] = THREE.MathUtils.randFloat(2.5, 5.5); // Size for vertex shader

    const baseColor = primaryColor.clone();
    baseColor.lerp(accentColor, Math.random() * 0.3); // Slightly vary base colors
    baseColor.offsetHSL(
      0,
      THREE.MathUtils.randFloat(-0.05, 0.05),
      THREE.MathUtils.randFloat(-0.15, 0.05)
    );
    instanceColors[i3] = baseColor.r;
    instanceColors[i3 + 1] = baseColor.g;
    instanceColors[i3 + 2] = baseColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute(
    "charAtlasIndex",
    new THREE.BufferAttribute(charAtlasIndices, 1)
  ); // Use correct name
  geometry.setAttribute(
    "streamSpeed",
    new THREE.BufferAttribute(streamSpeeds, 1)
  );
  geometry.setAttribute(
    "initialPhase",
    new THREE.BufferAttribute(initialPhases, 1)
  );
  geometry.setAttribute(
    "instanceColor",
    new THREE.BufferAttribute(instanceColors, 3)
  );
  geometry.setAttribute("baseSize", new THREE.BufferAttribute(baseSizes, 1)); // Add baseSize attribute

  const material = new THREE.ShaderMaterial({
    vertexShader: dataStreamVertexShader,
    fragmentShader: dataStreamFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
      uCharAtlas: { value: charAtlas },
      uAtlasCharsPerRow: { value: ATLAS_CHARS_PER_ROW },
      uTotalAtlasCharsOnAtlas: { value: fullCharSet.length }, // Renamed uniform for fragment shader
      uStreamHeight: { value: STREAM_HEIGHT },
      uMouseInfluenceRadius: { value: 0.25 },
      uMousePushStrength: { value: 0.6 }, // Increased push
      uCameraFov: { value: 75 }, // Default, will be updated
      uMaxDepth: { value: MAX_DEPTH },
      uFalloffDepth: { value: FALLOFF_DEPTH },
      uLeaderColor: { value: leaderColor },
      uActivationColor: { value: accentColor.clone().multiplyScalar(1.2) }, // Brighter activation
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.position.set(0, 0, 2.5);
    camera.lookAt(0, 0, 0);
    camera.fov = 70;
    camera.near = 0.1;
    camera.far = FALLOFF_DEPTH + 2;
    camera.updateProjectionMatrix();
    material.uniforms.uCameraFov.value = camera.fov;
  }

  const clock = new THREE.Clock();
  const currentMouseNdc = new THREE.Vector2(10, 10); // Start mouse "off-screen"
  const targetMouseNdc = new THREE.Vector2(10, 10);

  const mouseMoveListener = (event: MouseEvent) => {
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    targetMouseNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    targetMouseNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };
  parent.addEventListener("mousemove", mouseMoveListener);
  parent.addEventListener("mouseleave", () => {
    targetMouseNdc.set(10, 10);
  });

  const update = () => {
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    currentMouseNdc.lerp(targetMouseNdc, 0.08);
    material.uniforms.uMouse.value.copy(currentMouseNdc);

    points.rotation.y = Math.sin(elapsedTime * 0.015) * 0.03;
  };

  const resizeListener = () => {
    if (typeof window !== "undefined") {
      material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        2
      );
    }
    if (camera instanceof THREE.PerspectiveCamera) {
      material.uniforms.uCameraFov.value = camera.fov;
    }
  };
  if (typeof window !== "undefined")
    window.addEventListener("resize", resizeListener);

  const cleanup = () => {
    parent.removeEventListener("mousemove", mouseMoveListener);
    parent.removeEventListener("mouseleave", () => targetMouseNdc.set(10, 10));
    if (typeof window !== "undefined")
      window.removeEventListener("resize", resizeListener);
    geometry.dispose();
    material.dispose();
    charAtlas.dispose();
    if (scene.children.includes(points)) scene.remove(points);
  };

  return { update, cleanup };
};

const MatrixDataStream: React.FC<{ className?: string }> = React.memo(
  ({ className }) => {
    return (
      <ThreeCanvas
        sketch={DataStreamSketchFactory}
        className={className || "absolute inset-0 -z-10"} // Ensure this is behind Hero text content
        cameraType="perspective"
        cameraProps={{
          // These are initial props, sketch can override or use them
          fov: 70,
          near: 0.1,
          far: 25,
          position: { x: 0, y: 0, z: 2.5 },
        }}
      />
    );
  }
);
MatrixDataStream.displayName = "MatrixDataStream";
export default MatrixDataStream;
