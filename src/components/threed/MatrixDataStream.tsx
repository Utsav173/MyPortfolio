"use client";

import React from "react";
import * as THREE from "three";
import ThreeCanvas from "./ThreeCanvas";

const MATRIX_CONFIG = {
  characters: {
    // Defines the character sets used in the animation.
    // gujarati: "અઆઇઈઉઊઋએઐઓઔકખગઘચછજઝઞટઠડઢણતથદધનપફબભમયરલવશષસહળક્ષજ્ઞ", // Gujarati characters.
    // devanagari:
    //   "ॐनमस्तेस्वागतम्कार्यम्प्रोग्रामिंग्भाषासंस्कृतम्ज्ञानविज्ञानम्", // Devanagari characters.
    programmatic: "01{}[]()<>/\\+-*%&=!?|:;#@$._", // Code-like symbols and numbers.
  },
  font: {
    // Font settings for rendering characters to the texture atlas.
    size: 32, // Base font size in pixels.
    renderScale: 1, // Multiplier for font size during atlas rendering (e.g., 2 for 2x resolution on atlas).
    // stack:
    //   "var(--font-geist-mono), var(--font-noto-gujarati), var(--font-noto-devanagari), monospace", // CSS font-family stack.
    stack: "var(--font-geist-mono), monospace",
    color: "#FFFFFF", // Color of characters on the atlas (usually white, final color applied in shader).
  },
  atlas: {
    // Settings for the character texture atlas.
    charsPerRow: 8, // Number of characters to render in each row of the atlas.
  },
  scene: {
    // General scene parameters.
    glyphCount: 150, // Total number of glyphs (falling characters/streams) to render.
    maxDepth: 30.0, // Maximum Z-depth (distance from camera) for glyphs.
    falloffDepth: 20.0, // Z-depth at which glyphs start to fade out completely.
    streamHeight: 15.0, // The virtual height of a single falling stream of characters before it repeats.
    sceneWidth: 28, // The width of the 3D space where glyphs are distributed horizontally.
  },
  animation: {
    // Animation-related parameters.
    baseEvolutionRate: 1.5, // Base speed at which characters cycle/change to new characters.
    activationEvolutionBoost: 5.0, // Additional character cycle speed when mouse is near (added to baseEvolutionRate).
    leaderEvolutionBoost: 2.0, // Additional character cycle speed for 'leader' characters (brightest ones at the stream head).
    globalRotationSpeed: 0.2, // Speed of the subtle global Y-axis rotation of the entire scene.
    globalRotationAmplitude: 0.03, // Maximum angle (in radians, roughly) of the global Y-axis rotation.
    mouseFollowSpeed: 0.08, // How quickly the shader's mouse position smoothly follows the actual cursor (0-1, higher is faster).
    streamSpeedMultiplier: 0.035, // Global multiplier for the falling speed of all streams.
  },
  glyph: {
    // Properties for individual glyphs.
    baseSizeRange: {
      // Range for the initial size of glyphs.
      min: 6.0, // Minimum base size.
      max: 16.0, // Maximum base size.
    },
    streamSpeedRange: {
      // Range for the speed of individual streams (multiplied by global streamSpeedMultiplier).
      min: 0.4, // Minimum individual stream speed factor.
      max: 1.4, // Maximum individual stream speed factor.
    },
    colorVariation: 0.3, // Amount of random variation (0-1) when deriving glyph color from primary/accent.
    hueShift: {
      // Range for random hue shift applied to glyph colors.
      min: -0.05, // Minimum hue shift (0-1 scale, e.g., -0.05 is a slight shift).
      max: 0.05, // Maximum hue shift.
    },
    lightnessShift: {
      // Range for random lightness shift applied to glyph colors.
      min: -0.15, // Minimum lightness shift (0-1 scale).
      max: 0.05, // Maximum lightness shift.
    },
  },
  effects: {
    // Visual effects parameters.
    leaderThreshold: 0.95, // Point in the stream (normalized 0-1 from tail to head) where a character becomes a "leader".
    sizeActivationMultiplier: 1.5, // Multiplier for glyph size when activated by mouse.
    sizeLeaderMultiplier: 0.8, // Multiplier for glyph size when it's a leader character (can be <1 to make leaders smaller but brighter).
    alphaBase: 0.5, // Base opacity for glyphs.
    alphaLeaderBoost: 0.5, // Additional opacity for leader characters.
    alphaActivationBoost: 0.3, // Additional opacity when glyph is activated by mouse.
    alphaRange: {
      // Clamp final alpha value to this range.
      min: 0.3, // Minimum final alpha.
      max: 0.95, // Maximum final alpha.
    },
    flickerProbability: 0.98, // Probability (0-1) that a glyph *won't* flicker in a given frame (closer to 1 means less flicker).
    flickerAlphaMultiplier: 0.7, // Alpha multiplier applied during a flicker (e.g., 0.7 makes it 70% of its current alpha).
    flickerTimeScale: 0.1, // Speed/scale of the noise function used for flickering, affecting flicker rate.
  },
  mouse: {
    // Mouse interaction parameters.
    influenceRadius: 0.2, // Radius (in Normalized Device Coordinates, -1 to 1) around the mouse where glyphs are affected.
    pushStrength: 0.7, // How strongly glyphs are pushed away from the mouse.
    pushFalloffFactor: 0.7, // Controls how quickly the push strength diminishes with distance from the mouse (within influenceRadius).
  },
  camera: {
    // Camera settings.
    fov: 70, // Field of View of the perspective camera (in degrees).
    near: 0.1, // Near clipping plane.
    position: { x: 0, y: 0, z: 2.5 }, // Initial X, Y, Z position of the camera.
    fovDivisor: 2.0, // Used in vertex shader for point size calculation, helps scale points appropriately with FOV and distance.
  },
  colors: {
    // Color definitions and fallbacks.
    primaryFallback: 0x0077ff, // Fallback primary color for glyphs if CSS var `--primary` is not found (hexadecimal).
    accentFallback: 0x00ff99, // Fallback accent color (mixed with primary) if CSS var `--accent` is not found.
    leaderFallback: 0xffffff, // Fallback color for leader characters if CSS var `--primary-foreground` is not found.
    activationColorMultiplier: 1.2, // Multiplier for the accent color when a glyph is activated by the mouse.
  },
  performance: {
    // Performance-related settings.
    maxPixelRatio: 2, // Maximum device pixel ratio to use (e.g., 2 limits to 2x DPI, good for performance on high-res screens).
  },
};

const SHADERS = {
  vertex: `
    attribute float baseSize;
    attribute vec3 instanceColor;
    attribute float charAtlasIndex;
    attribute float streamSpeed;
    attribute float initialPhase;

    varying vec3 vColor;
    varying float vCharAtlasIndex;
    varying float vDepth;
    varying float vActivation;
    varying float vIsLeader;

    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uPixelRatio;
    uniform float uStreamHeight;
    uniform float uMouseInfluenceRadius;
    uniform float uMousePushStrength;
    uniform float uCameraFov;
    uniform float uMaxDepth;
    uniform float uFalloffDepth;

    void main() {
      vColor = instanceColor;
      vCharAtlasIndex = charAtlasIndex;
      vec3 p = position;

      float currentY = mod(-uTime * streamSpeed * ${MATRIX_CONFIG.animation.streamSpeedMultiplier.toFixed(
        3
      )} + initialPhase, uStreamHeight);
      p.y = currentY - uStreamHeight / 2.0;

      float leaderThreshold = uStreamHeight * ${MATRIX_CONFIG.effects.leaderThreshold.toFixed(
        2
      )};
      vIsLeader = smoothstep(leaderThreshold, uStreamHeight, currentY);

      vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
      vDepth = -mvPosition.z;

      vec4 projectedPosition = projectionMatrix * mvPosition;
      vec2 screenNdc = projectedPosition.xy / projectedPosition.w;
      float distToMouse = length(screenNdc - uMouse);
      vActivation = smoothstep(uMouseInfluenceRadius, 0.0, distToMouse);

      if (distToMouse < uMouseInfluenceRadius && vActivation > 0.01) {
        vec2 dirFromMouse = normalize(screenNdc - uMouse);
        float pushFactor = vActivation * uMousePushStrength * (1.0 - smoothstep(0.0, uFalloffDepth * ${MATRIX_CONFIG.mouse.pushFalloffFactor.toFixed(
          1
        )}, vDepth));
        mvPosition.xy += dirFromMouse * pushFactor;
      }

      float pointSize = baseSize * uPixelRatio;
      pointSize *= (0.4 + 0.6 * (1.0 - smoothstep(0.0, uFalloffDepth, vDepth)));
      pointSize *= (1.0 + vActivation * ${MATRIX_CONFIG.effects.sizeActivationMultiplier.toFixed(
        1
      )});
      pointSize *= (1.0 + vIsLeader * ${MATRIX_CONFIG.effects.sizeLeaderMultiplier.toFixed(
        1
      )});

      gl_PointSize = pointSize * ( (uCameraFov / ${MATRIX_CONFIG.camera.fovDivisor.toFixed(
        1
      )}) / max(1.0, -mvPosition.z) );
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragment: `
    uniform sampler2D uCharAtlas;
    uniform float uAtlasCharsPerRow;
    uniform float uTotalAtlasCharsOnAtlas;
    uniform float uTime;
    uniform vec3 uLeaderColor;
    uniform vec3 uActivationColor;
    uniform float uMaxDepth;
    uniform float uFalloffDepth;

    varying vec3 vColor;
    varying float vCharAtlasIndex;
    varying float vDepth;
    varying float vActivation;
    varying float vIsLeader;

    float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }

    void main() {
      float evolutionRate = ${MATRIX_CONFIG.animation.baseEvolutionRate.toFixed(
        1
      )} + vActivation * ${MATRIX_CONFIG.animation.activationEvolutionBoost.toFixed(
    1
  )} + vIsLeader * ${MATRIX_CONFIG.animation.leaderEvolutionBoost.toFixed(1)};
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
      finalColor = mix(finalColor, uLeaderColor, vIsLeader * 1.0);
      finalColor = mix(finalColor, uActivationColor, vActivation * 0.9);

      float alpha = charAlpha;
      alpha *= smoothstep(uFalloffDepth, uFalloffDepth * 0.2, vDepth);
      alpha *= (${MATRIX_CONFIG.effects.alphaBase.toFixed(
        1
      )} + vIsLeader * ${MATRIX_CONFIG.effects.alphaLeaderBoost.toFixed(
    1
  )} + vActivation * ${MATRIX_CONFIG.effects.alphaActivationBoost.toFixed(1)});
      alpha = clamp(alpha, ${MATRIX_CONFIG.effects.alphaRange.min.toFixed(
        2
      )}, ${MATRIX_CONFIG.effects.alphaRange.max.toFixed(2)});

      if (random(gl_PointCoord.xy + mod(uTime*${MATRIX_CONFIG.effects.flickerTimeScale.toFixed(
        1
      )} + vCharAtlasIndex, 100.0)) > ${MATRIX_CONFIG.effects.flickerProbability.toFixed(
    2
  )} && vActivation < 0.1) {
        alpha *= ${MATRIX_CONFIG.effects.flickerAlphaMultiplier.toFixed(1)};
      }

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

const createCharacterAtlas = (
  config = MATRIX_CONFIG
): { texture: THREE.CanvasTexture; fullCharSet: string } => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    canvas.width = 1;
    canvas.height = 1;
    return { texture: new THREE.CanvasTexture(canvas), fullCharSet: "" };
  }

  const fullCharSet = Array.from(
    new Set([
      // ...config.characters.gujarati,
      // ...config.characters.devanagari.replace(/\s/g, ""),
      ...config.characters.programmatic,
    ])
  ).join("");

  const numTotalChars = fullCharSet.length;
  const numRowsOnAtlas = Math.ceil(numTotalChars / config.atlas.charsPerRow);
  const charRenderSize = Math.ceil(config.font.size * config.font.renderScale);

  canvas.width = config.atlas.charsPerRow * charRenderSize;
  canvas.height = numRowsOnAtlas * charRenderSize;

  ctx.font = `${config.font.size}px ${config.font.stack}`;
  ctx.fillStyle = config.font.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < numTotalChars; i++) {
    const char = fullCharSet[i];
    const col = i % config.atlas.charsPerRow;
    const row = Math.floor(i / config.atlas.charsPerRow);
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

  return { texture, fullCharSet };
};

const getThemeColors = (config = MATRIX_CONFIG) => {
  let primaryColor = new THREE.Color(config.colors.primaryFallback);
  let accentColor = new THREE.Color(config.colors.accentFallback);
  let leaderColor = new THREE.Color(config.colors.leaderFallback);

  if (typeof window !== "undefined") {
    const styles = getComputedStyle(document.documentElement);
    try {
      const primaryVar = styles.getPropertyValue("--primary").trim();
      if (primaryVar) primaryColor.set(primaryVar);
    } catch (e) {}
    try {
      const accentVar = styles.getPropertyValue("--accent").trim();
      if (accentVar) accentColor.set(accentVar);
    } catch (e) {}
    try {
      const fgVar = styles.getPropertyValue("--primary-foreground").trim();
      if (fgVar) leaderColor.set(fgVar);
    } catch (e) {}
  }
  return { primaryColor, accentColor, leaderColor };
};

const generateGlyphData = (
  config = MATRIX_CONFIG,
  fullCharSet: string,
  colors: ReturnType<typeof getThemeColors>
) => {
  const count = config.scene.glyphCount;

  const positions = new Float32Array(count * 3);
  const charAtlasIndices = new Float32Array(count);
  const streamSpeeds = new Float32Array(count);
  const initialPhases = new Float32Array(count);
  const instanceColors = new Float32Array(count * 3);
  const baseSizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    positions[i3] = THREE.MathUtils.randFloatSpread(config.scene.sceneWidth);
    positions[i3 + 1] = 0;
    positions[i3 + 2] = THREE.MathUtils.randFloat(
      -config.scene.maxDepth * 0.9,
      -1
    );

    charAtlasIndices[i] = Math.floor(Math.random() * fullCharSet.length);
    streamSpeeds[i] = THREE.MathUtils.randFloat(
      config.glyph.streamSpeedRange.min,
      config.glyph.streamSpeedRange.max
    );
    initialPhases[i] = Math.random() * config.scene.streamHeight;
    baseSizes[i] = THREE.MathUtils.randFloat(
      config.glyph.baseSizeRange.min,
      config.glyph.baseSizeRange.max
    );

    const baseColor = colors.primaryColor.clone();
    baseColor.lerp(
      colors.accentColor,
      Math.random() * config.glyph.colorVariation
    );
    baseColor.offsetHSL(
      0,
      THREE.MathUtils.randFloat(
        config.glyph.hueShift.min,
        config.glyph.hueShift.max
      ),
      THREE.MathUtils.randFloat(
        config.glyph.lightnessShift.min,
        config.glyph.lightnessShift.max
      )
    );

    instanceColors[i3] = baseColor.r;
    instanceColors[i3 + 1] = baseColor.g;
    instanceColors[i3 + 2] = baseColor.b;
  }

  return {
    positions,
    charAtlasIndices,
    streamSpeeds,
    initialPhases,
    instanceColors,
    baseSizes,
  };
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
  const currentConfig = { ...MATRIX_CONFIG };
  const colors = getThemeColors(currentConfig);
  const { texture: charAtlas, fullCharSet } =
    createCharacterAtlas(currentConfig);
  const glyphData = generateGlyphData(currentConfig, fullCharSet, colors);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(glyphData.positions, 3)
  );
  geometry.setAttribute(
    "charAtlasIndex",
    new THREE.BufferAttribute(glyphData.charAtlasIndices, 1)
  );
  geometry.setAttribute(
    "streamSpeed",
    new THREE.BufferAttribute(glyphData.streamSpeeds, 1)
  );
  geometry.setAttribute(
    "initialPhase",
    new THREE.BufferAttribute(glyphData.initialPhases, 1)
  );
  geometry.setAttribute(
    "instanceColor",
    new THREE.BufferAttribute(glyphData.instanceColors, 3)
  );
  geometry.setAttribute(
    "baseSize",
    new THREE.BufferAttribute(glyphData.baseSizes, 1)
  );

  const material = new THREE.ShaderMaterial({
    vertexShader: SHADERS.vertex,
    fragmentShader: SHADERS.fragment,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(
                window.devicePixelRatio,
                currentConfig.performance.maxPixelRatio
              )
            : 1,
      },
      uCharAtlas: { value: charAtlas },
      uAtlasCharsPerRow: { value: currentConfig.atlas.charsPerRow },
      uTotalAtlasCharsOnAtlas: { value: fullCharSet.length },
      uStreamHeight: { value: currentConfig.scene.streamHeight },
      uMouseInfluenceRadius: { value: currentConfig.mouse.influenceRadius },
      uMousePushStrength: { value: currentConfig.mouse.pushStrength },
      uCameraFov: { value: currentConfig.camera.fov },
      uMaxDepth: { value: currentConfig.scene.maxDepth },
      uFalloffDepth: { value: currentConfig.scene.falloffDepth },
      uLeaderColor: { value: colors.leaderColor },
      uActivationColor: {
        value: colors.accentColor
          .clone()
          .multiplyScalar(currentConfig.colors.activationColorMultiplier),
      },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.position.set(
      currentConfig.camera.position.x,
      currentConfig.camera.position.y,
      currentConfig.camera.position.z
    );
    camera.lookAt(0, 0, 0);
    camera.fov = currentConfig.camera.fov;
    camera.near = currentConfig.camera.near;
    camera.far = currentConfig.scene.falloffDepth + 2;
    camera.updateProjectionMatrix();
    material.uniforms.uCameraFov.value = camera.fov;
  }

  const clock = new THREE.Clock();
  const currentMouseNdc = new THREE.Vector2(10, 10);
  const targetMouseNdc = new THREE.Vector2(10, 10);

  const mouseMoveListener = (event: MouseEvent) => {
    const rect = parent.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    targetMouseNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    targetMouseNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const mouseLeaveListener = () => {
    targetMouseNdc.set(10, 10);
  };

  const resizeListener = () => {
    if (typeof window !== "undefined") {
      material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio,
        currentConfig.performance.maxPixelRatio
      );
    }
    if (camera instanceof THREE.PerspectiveCamera) {
      material.uniforms.uCameraFov.value = camera.fov;
    }
  };

  parent.addEventListener("mousemove", mouseMoveListener);
  parent.addEventListener("mouseleave", mouseLeaveListener);
  if (typeof window !== "undefined") {
    window.addEventListener("resize", resizeListener);
  }

  const update = () => {
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    currentMouseNdc.lerp(
      targetMouseNdc,
      currentConfig.animation.mouseFollowSpeed
    );
    material.uniforms.uMouse.value.copy(currentMouseNdc);

    points.rotation.y =
      Math.sin(elapsedTime * currentConfig.animation.globalRotationSpeed) *
      currentConfig.animation.globalRotationAmplitude;
  };

  const cleanup = () => {
    parent.removeEventListener("mousemove", mouseMoveListener);
    parent.removeEventListener("mouseleave", mouseLeaveListener);
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", resizeListener);
    }
    geometry.dispose();
    material.dispose();
    charAtlas.dispose();
    if (scene.children.includes(points)) scene.remove(points);
  };

  return { update, cleanup };
};

const MatrixDataStream: React.FC<{
  className?: string;
  configOverrides?: Partial<typeof MATRIX_CONFIG>;
}> = React.memo(({ className, configOverrides }) => {
  React.useMemo(() => {
    if (configOverrides) {
      Object.assign(MATRIX_CONFIG, configOverrides);
    }
  }, [configOverrides]);

  return (
    <ThreeCanvas
      sketch={DataStreamSketchFactory}
      className={className || "absolute inset-0 -z-10"}
      cameraType="perspective"
      cameraProps={{
        fov: MATRIX_CONFIG.camera.fov,
        near: MATRIX_CONFIG.camera.near,
        far: MATRIX_CONFIG.scene.falloffDepth + 2,
        position: MATRIX_CONFIG.camera.position,
      }}
    />
  );
});

MatrixDataStream.displayName = "MatrixDataStream";

export default MatrixDataStream;
export { MATRIX_CONFIG };
