'use client';

import React, { useRef, useMemo, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial, PerformanceMonitor } from '@react-three/drei';
import {
  SceneConfig,
  defaultSceneConfig as importedDefaultConfig,
  parseConfigColors,
  ParsedSceneConfig,
} from '@/lib/sceneConfig';
import { cn } from '@/lib/utils';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

import {
  PlaneShaderMaterial,
  RainParticleShaderMaterial,
  SplashParticleShaderMaterial,
} from './shaders';

const getKernelSize = (sizeStr?: string): KernelSize => {
  if (!sizeStr) return KernelSize.LARGE;
  switch (sizeStr.toUpperCase()) {
    case 'VERY_SMALL':
      return KernelSize.VERY_SMALL;
    case 'SMALL':
      return KernelSize.SMALL;
    case 'MEDIUM':
      return KernelSize.MEDIUM;
    case 'LARGE':
      return KernelSize.LARGE;
    case 'HUGE':
      return KernelSize.HUGE;
    default:
      return KernelSize.LARGE;
  }
};

extend({
  PlaneShaderMaterial,
  RainParticleShaderMaterial,
  SplashParticleShaderMaterial,
});

const PROGRAMMATIC_CHARS_STR = '0123456789ABCDEF!@#$%^&*()_+-=[]{};\':"\\|,.<>/?~ΣΠΔΩμλβ±≠≤≥∞∴¥€£';
const SANSKRIT_CHARS_STR = 'अआइईउऊऋएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसહઅઆઇકખગજઝટઠડદધનપફબમયરલવસહ';
const GLYPH_CHARS = (PROGRAMMATIC_CHARS_STR + SANSKRIT_CHARS_STR).split('');
const CHARS_PER_ROW = 10;
const CHAR_TEXTURE_SIZE = 64;

interface AtlasData {
  atlasTexture: THREE.Texture;
  charUVMap: Map<string, { u: number; v: number; w: number; h: number }>;
  defaultCharMap: { u: number; v: number; w: number; h: number };
  splashCharMap: { u: number; v: number; w: number; h: number };
}
const createCharacterAtlas = (): AtlasData => {
  const numRows = Math.ceil(GLYPH_CHARS.length / CHARS_PER_ROW);
  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = CHARS_PER_ROW * CHAR_TEXTURE_SIZE;
  atlasCanvas.height = numRows * CHAR_TEXTURE_SIZE;
  const context = atlasCanvas.getContext('2d');
  if (!context) throw new Error('Cannot get 2D context for atlas');
  context.fillStyle = 'white';
  context.font = `bold ${CHAR_TEXTURE_SIZE * 0.75}px monospace`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const charUVMap = new Map<string, { u: number; v: number; w: number; h: number }>();
  const cellWidthUV = 1 / CHARS_PER_ROW;
  const cellHeightUV = 1 / numRows;
  let defaultCharMap = { u: 0, v: 0, w: cellWidthUV, h: cellHeightUV };
  GLYPH_CHARS.forEach((char, index) => {
    const x = index % CHARS_PER_ROW;
    const y = Math.floor(index / CHARS_PER_ROW);
    context.fillText(
      char,
      x * CHAR_TEXTURE_SIZE + CHAR_TEXTURE_SIZE / 2,
      y * CHAR_TEXTURE_SIZE + CHAR_TEXTURE_SIZE / 2
    );
    charUVMap.set(char, {
      u: x * cellWidthUV,
      v: 1.0 - (y + 1) * cellHeightUV,
      w: cellWidthUV,
      h: cellHeightUV,
    });
  });
  if (GLYPH_CHARS.length > 0) {
    const firstChar = charUVMap.get(GLYPH_CHARS[0]);
    if (firstChar) defaultCharMap = { ...firstChar };
  }
  const splashCharMap =
    charUVMap.get('・') || charUVMap.get('.') || charUVMap.get('o') || defaultCharMap;
  const atlasTexture = new THREE.Texture(atlasCanvas);
  atlasTexture.flipY = false;
  atlasTexture.needsUpdate = true;
  atlasTexture.minFilter = THREE.LinearFilter;
  atlasTexture.magFilter = THREE.LinearFilter;
  return { atlasTexture, charUVMap, defaultCharMap, splashCharMap };
};

// ── Allocation-Free Scalar 3D Perlin Noise ──
// Per three-best-practices: render-avoid-allocations, object-pooling
// Zero new/clone calls. Pure scalar math.
const _mod289 = (x: number) => x - Math.floor(x * (1.0 / 289.0)) * 289.0;
const _permute = (x: number) => _mod289((x * 34.0 + 1.0) * x);
const _fade = (t: number) => t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
const _taylorInvSqrt = (r: number) => 1.79284291400159 - 0.85373472095314 * r;

const scalarCnoise = (px: number, py: number, pz: number): number => {
  // Floor
  const Pi0x = Math.floor(px),
    Pi0y = Math.floor(py),
    Pi0z = Math.floor(pz);
  const Pi1x = Pi0x + 1,
    Pi1y = Pi0y + 1,
    Pi1z = Pi0z + 1;
  // Mod289
  const m0x = _mod289(Pi0x),
    m0y = _mod289(Pi0y),
    m0z = _mod289(Pi0z);
  const m1x = _mod289(Pi1x),
    m1y = _mod289(Pi1y),
    m1z = _mod289(Pi1z);
  // Fract
  const Pf0x = px - Pi0x,
    Pf0y = py - Pi0y,
    Pf0z = pz - Pi0z;
  const Pf1x = Pf0x - 1,
    Pf1y = Pf0y - 1,
    Pf1z = Pf0z - 1;
  // Permutations (4 corners x 2 z-layers = 8 gradients)
  const p00 = _permute(_permute(m0x) + m0y);
  const p10 = _permute(_permute(m1x) + m0y);
  const p01 = _permute(_permute(m0x) + m1y);
  const p11 = _permute(_permute(m1x) + m1y);
  const p000 = _permute(p00 + m0z),
    p100 = _permute(p10 + m0z);
  const p010 = _permute(p01 + m0z),
    p110 = _permute(p11 + m0z);
  const p001 = _permute(p00 + m1z),
    p101 = _permute(p10 + m1z);
  const p011 = _permute(p01 + m1z),
    p111 = _permute(p11 + m1z);
  // Gradients (inline computation, no vec3 alloc)
  const inv7 = 1.0 / 7.0;
  const gCalc = (pVal: number): [number, number, number] => {
    let gx = pVal * inv7;
    // gy = fract(floor(gx) * inv7) - 0.5  (matching GLSL exactly)
    const floorGx = Math.floor(gx);
    const gyRaw = floorGx * inv7;
    let gy = gyRaw - Math.floor(gyRaw) - 0.5;
    gx = gx - Math.floor(gx); // fract(gx)
    let gz = 0.5 - Math.abs(gx) - Math.abs(gy);
    const sz = gz < 0 ? 1.0 : 0.0;
    gx -= sz * ((gx >= 0 ? 1.0 : 0.0) - 0.5);
    gy -= sz * ((gy >= 0 ? 1.0 : 0.0) - 0.5);
    // Normalize via taylorInvSqrt(dot(g,g))
    const lenSq = gx * gx + gy * gy + gz * gz;
    const invLen = lenSq > 0 ? _taylorInvSqrt(lenSq) : 0;
    return [gx * invLen, gy * invLen, gz * invLen];
  };
  const [g000x, g000y, g000z] = gCalc(p000);
  const [g100x, g100y, g100z] = gCalc(p100);
  const [g010x, g010y, g010z] = gCalc(p010);
  const [g110x, g110y, g110z] = gCalc(p110);
  const [g001x, g001y, g001z] = gCalc(p001);
  const [g101x, g101y, g101z] = gCalc(p101);
  const [g011x, g011y, g011z] = gCalc(p011);
  const [g111x, g111y, g111z] = gCalc(p111);
  // Dot products
  const n000 = g000x * Pf0x + g000y * Pf0y + g000z * Pf0z;
  const n100 = g100x * Pf1x + g100y * Pf0y + g100z * Pf0z;
  const n010 = g010x * Pf0x + g010y * Pf1y + g010z * Pf0z;
  const n110 = g110x * Pf1x + g110y * Pf1y + g110z * Pf0z;
  const n001 = g001x * Pf0x + g001y * Pf0y + g001z * Pf1z;
  const n101 = g101x * Pf1x + g101y * Pf0y + g101z * Pf1z;
  const n011 = g011x * Pf0x + g011y * Pf1y + g011z * Pf1z;
  const n111 = g111x * Pf1x + g111y * Pf1y + g111z * Pf1z;
  // Interpolation (fade)
  const fx = _fade(Pf0x),
    fy = _fade(Pf0y),
    fz = _fade(Pf0z);
  const nx00 = n000 + (n100 - n000) * fx;
  const nx10 = n010 + (n110 - n010) * fx;
  const nx01 = n001 + (n101 - n001) * fx;
  const nx11 = n011 + (n111 - n011) * fx;
  const nxy0 = nx00 + (nx10 - nx00) * fy;
  const nxy1 = nx01 + (nx11 - nx01) * fy;
  return 2.2 * (nxy0 + (nxy1 - nxy0) * fz);
};

interface CameraControls {
  xPos: number;
  yPos: number;
  zPos: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

// Per three-best-practices: render-avoid-allocations
// No object allocation — pure scalar computation.
const getPlaneHeightAt = (
  x: number,
  z: number,
  time: number,
  planeConfig: ParsedSceneConfig['plane']
): number => {
  const sin1 = Math.sin(THREE.MathUtils.degToRad((x / (planeConfig.size / 2)) * 90.0));
  const nz = -z + time * -18.0;
  const n1 = scalarCnoise(x * 0.065, 0, nz * 0.065);
  const n2 = scalarCnoise(x * 0.045, 0, nz * 0.045);
  const n3 = scalarCnoise(x * 0.28, 0, nz * 0.28);
  return (
    n1 * sin1 * planeConfig.noiseStrength.hill1 +
    n2 * sin1 * planeConfig.noiseStrength.hill2 +
    n3 * (Math.abs(sin1) * 1.7 + 0.4) * planeConfig.noiseStrength.hill3 +
    Math.pow(sin1, 2) * planeConfig.noiseStrength.overall
  );
};

const PlaneComponentR3F: React.FC<{
  themeAdjustRef: React.MutableRefObject<number>;
  planeConfig: ParsedSceneConfig['plane'];
  timeRef: React.MutableRefObject<number>;
}> = React.memo(({ themeAdjustRef, planeConfig, timeRef }) => {
  const materialRef = useRef<any>(null!);
  useFrame((_state, delta) => {
    const clamped = Math.min(delta, 0.05);
    if (materialRef.current) {
      if (materialRef.current.time !== undefined) {
        materialRef.current.time += clamped * planeConfig.timeFactor;
        timeRef.current = materialRef.current.time;
      }
      // Update theme adjust uniform
      if (materialRef.current.uniforms?.uThemeAdjust) {
        materialRef.current.uniforms.uThemeAdjust.value = themeAdjustRef.current;
      }
    }
  });

  const materialProps = useMemo(
    () => ({
      uPlaneColorDarkTheme: planeConfig.planeColorForDarkTheme,
      uPlaneColorLightTheme: planeConfig.planeColorForLightTheme,
      uGridColorDarkTheme: planeConfig.gridColorForDarkTheme,
      uGridColorLightTheme: planeConfig.gridColorForLightTheme,
      uGridLineThickness: planeConfig.gridLineThickness,
      uGridLineSpacing: planeConfig.gridLineSpacing,
      uNoiseStrengthHill1: planeConfig.noiseStrength.hill1,
      uNoiseStrengthHill2: planeConfig.noiseStrength.hill2,
      uNoiseStrengthHill3: planeConfig.noiseStrength.hill3,
      uNoiseStrengthOverall: planeConfig.noiseStrength.overall,
      uPlaneSize: planeConfig.size,
      uOpacityFactorDark: planeConfig.opacityFactorDark,
      uOpacityFactorLight: planeConfig.opacityFactorLight,
    }),
    [planeConfig]
  );
  return (
    <mesh>
      <planeGeometry
        args={[
          planeConfig.size,
          planeConfig.size,
          planeConfig.visualSegments,
          planeConfig.visualSegments,
        ]}
      />
      {/* @ts-ignore */}
      <planeShaderMaterial
        ref={materialRef}
        {...materialProps}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
        uThemeAdjust={themeAdjustRef.current}
      />
    </mesh>
  );
});
PlaneComponentR3F.displayName = 'PlaneComponentR3F';

type RainParticleData = {
  id: number;
  x: number;
  y: number;
  z: number;
  speedY: number;
  streamIndex: number;
  charMap: { u: number; v: number; w: number; h: number };

  opacity: number;
  currentStreamId: number;
  fadeFactor: number;
};
interface SplashParticleData {
  id: number;
  active: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
  opacity: number;
  charMap: { u: number; v: number; w: number; h: number };
}
type TriggerSplashFn = (position: THREE.Vector3) => void;

const SplashParticleSystemR3F: React.FC<{
  config: ParsedSceneConfig['splashParticles'];
  atlasData: AtlasData;
  triggerRef: React.MutableRefObject<TriggerSplashFn | null>;
}> = React.memo(({ config, atlasData, triggerRef }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const particles = useRef<SplashParticleData[]>([]).current;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { splashCharMap } = atlasData;
  useEffect(() => {
    if (!config.enabled) return;
    particles.length = 0;
    for (let i = 0; i < config.maxParticles; i++) {
      particles.push({
        id: i,
        active: false,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: config.lifespan,
        scale: 1,
        opacity: 0,
        charMap: splashCharMap,
      });
    }
  }, [config.maxParticles, config.lifespan, splashCharMap, config.enabled, particles]);
  triggerRef.current = useCallback(
    (impactPosition: THREE.Vector3) => {
      if (!config.enabled) return;
      let activatedCount = 0;
      for (let i = 0; i < particles.length && activatedCount < config.particlesPerSplash; i++) {
        const p = particles[i];
        if (!p.active) {
          p.active = true;
          p.position.copy(impactPosition);
          const angle = Math.random() * Math.PI * 2;
          const speed = THREE.MathUtils.lerp(config.speedMin, config.speedMax, Math.random());
          p.velocity.set(Math.cos(angle) * speed, config.lift, Math.sin(angle) * speed);
          p.life = p.maxLife;
          p.scale = config.size;
          p.opacity = 1.0;
          activatedCount++;
        }
      }
    },
    [config, particles]
  );
  const instanceOffsetAttribute = useMemo(
    () => new THREE.InstancedBufferAttribute(new Float32Array(config.maxParticles * 4), 4),
    [config.maxParticles]
  );
  const instanceColorOpacityAttribute = useMemo(
    () => new THREE.InstancedBufferAttribute(new Float32Array(config.maxParticles * 4), 4),
    [config.maxParticles]
  );
  useFrame((_state, delta) => {
    if (!meshRef.current || !config.enabled || particles.length === 0) return;
    const clampedDelta = Math.min(delta, 0.05);
    let needsUpdate = false;
    particles.forEach((p) => {
      if (p.active) {
        needsUpdate = true;
        p.velocity.y -= config.gravity * clampedDelta;
        p.position.addScaledVector(p.velocity, clampedDelta);
        p.life -= clampedDelta;
        if (p.life <= 0) {
          p.active = false;
          p.opacity = 0;
        } else {
          const lifeRatio = p.life / p.maxLife;
          p.opacity = lifeRatio;
          p.scale = config.size * lifeRatio;
        }
        dummy.position.copy(p.position);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(p.id, dummy.matrix);
        instanceOffsetAttribute.setXYZW(p.id, p.charMap.u, p.charMap.v, p.charMap.w, p.charMap.h);
        instanceColorOpacityAttribute.setW(p.id, p.opacity);
      } else if (instanceColorOpacityAttribute.getW(p.id) > 0) {
        instanceColorOpacityAttribute.setW(p.id, 0);
        needsUpdate = true;
      }
    });
    if (needsUpdate) {
      meshRef.current!.instanceMatrix.needsUpdate = true;
      instanceOffsetAttribute.needsUpdate = true;
      instanceColorOpacityAttribute.needsUpdate = true;

      // Update Uniforms
      const mat = meshRef.current!.material as any;
      if (mat.uniforms) {
        mat.uniforms.uSplashColor.value.copy(config.splashColor);
      }
    }
  });
  if (!config.enabled) return null;
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, config.maxParticles]}
      frustumCulled={false}
    >
      <planeGeometry args={[1, 1]}>
        <primitive attach="attributes-instanceOffset" object={instanceOffsetAttribute} />
        <primitive
          attach="attributes-instanceColorOpacity"
          object={instanceColorOpacityAttribute}
        />
      </planeGeometry>
      {/* @ts-ignore */}
      <splashParticleShaderMaterial
        uAtlasMap={atlasData.atlasTexture}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </instancedMesh>
  );
});
SplashParticleSystemR3F.displayName = 'SplashParticleSystemR3F';

const RainEffectComponentR3F: React.FC<{
  rainConfig: ParsedSceneConfig['rain'];
  planeConfig: ParsedSceneConfig['plane'];
  planeSize: number;
  atlasData: AtlasData;
  themeAdjustRef: React.MutableRefObject<number>;
  onRainImpact: TriggerSplashFn | null;
  timeRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<THREE.Vector3>;
}> = React.memo(
  ({
    rainConfig,
    planeConfig,
    planeSize,
    atlasData,
    themeAdjustRef,
    onRainImpact,
    timeRef,
    mouseRef,
  }) => {
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
    const particles = useRef<RainParticleData[]>([]).current;
    const nextStreamId = useRef(0);
    const dummyObject = useMemo(() => new THREE.Object3D(), []);
    const { currentLeadColor, currentTrailColorBase } = useMemo(() => {
      const adjust = themeAdjustRef.current;
      return {
        currentLeadColor: adjust === 0 ? rainConfig.leadColorDark : rainConfig.leadColorLight,
        currentTrailColorBase:
          adjust === 0 ? rainConfig.trailColorBaseDark : rainConfig.trailColorBaseLight,
      };
    }, [themeAdjustRef, rainConfig]);
    const defaultCharMap = atlasData.defaultCharMap;
    const { width: screenWidth } = useThree((state) => state.size);
    const isMobile = useMemo(() => screenWidth < 768, [screenWidth]);
    const isLightMode = themeAdjustRef.current > 0.5;
    const streamCount = useMemo(
      () =>
        isMobile
          ? rainConfig.streamCountMobile
          : isLightMode && rainConfig.streamCountDesktopLight
            ? rainConfig.streamCountDesktopLight
            : rainConfig.streamCountDesktop,
      [isMobile, rainConfig, isLightMode]
    );
    const streamLength = useMemo(
      () => (isMobile ? rainConfig.streamLengthMobile : rainConfig.streamLengthDesktop),
      [isMobile, rainConfig]
    );
    // Pre-allocate colors to avoid GC in render loop
    // Per three-best-practices: render-avoid-allocations
    const leadColorRef = useRef(new THREE.Color());
    const trailColorRef = useRef(new THREE.Color());
    const getColorsForTheme = useCallback(
      (adjust: number) => {
        leadColorRef.current.copy(rainConfig.leadColorDark).lerp(rainConfig.leadColorLight, adjust);
        trailColorRef.current
          .copy(rainConfig.trailColorBaseDark)
          .lerp(rainConfig.trailColorBaseLight, adjust);
        return { lead: leadColorRef.current, trail: trailColorRef.current };
      },
      [rainConfig]
    );

    const maxParticles = useMemo(() => streamCount * streamLength, [streamCount, streamLength]);
    const xSpreadFactor = useMemo(() => (isMobile ? 0.22 : 0.45), [isMobile]);
    const zSpreadFactor = useMemo(() => (isMobile ? 0.2 : 0.35), [isMobile]);
    // Pre-allocate impact vector per three-best-practices: render-avoid-allocations
    const impactVec = useMemo(() => new THREE.Vector3(), []);

    const getRandomCharMap = useCallback((): {
      u: number;
      v: number;
      w: number;
      h: number;
    } => {
      const c = GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)];
      return atlasData.charUVMap.get(c) || defaultCharMap;
    }, [atlasData.charUVMap, defaultCharMap]);
    useEffect(() => {
      if (particles.length > 0 && instancedMeshRef.current?.geometry) {
        const fadeAttr = instancedMeshRef.current.geometry.getAttribute('aFadeFactor') as
          | THREE.InstancedBufferAttribute
          | undefined;
        const opacityAttr = instancedMeshRef.current.geometry.getAttribute(
          'instanceColorOpacity'
        ) as THREE.InstancedBufferAttribute | undefined;

        if (fadeAttr && opacityAttr) {
          particles.forEach((p, i) => {
            fadeAttr.setX(i, p.fadeFactor);
            opacityAttr.setW(i, p.opacity);
          });
          fadeAttr.needsUpdate = true;
          opacityAttr.needsUpdate = true;
        }
      }
    }, [streamLength, particles]);
    const instanceOffsetAttribute = useMemo(
      () => new THREE.InstancedBufferAttribute(new Float32Array(maxParticles * 4), 4),
      [maxParticles]
    );
    const instanceColorOpacityAttribute = useMemo(
      () => new THREE.InstancedBufferAttribute(new Float32Array(maxParticles * 4), 4),
      [maxParticles]
    );
    const instanceFadeFactorAttribute = useMemo(
      () => new THREE.InstancedBufferAttribute(new Float32Array(maxParticles), 1),
      [maxParticles]
    );
    useEffect(() => {
      if (!atlasData || maxParticles === 0 || particles.length === maxParticles) return;
      particles.length = 0;
      const halfPlaneX = (planeSize / 2) * xSpreadFactor;
      const halfPlaneZ = (planeSize / 2) * zSpreadFactor;
      for (let i = 0; i < streamCount; i++) {
        const sX = Math.random() * halfPlaneX * 2 - halfPlaneX;
        const sZ = Math.random() * halfPlaneZ * 2 - halfPlaneZ;
        const bS =
          rainConfig.speedBaseMin +
          Math.random() * (rainConfig.speedBaseMax - rainConfig.speedBaseMin);
        const cSId = nextStreamId.current++;
        for (let j = 0; j < streamLength; j++) {
          particles.push({
            id: i * streamLength + j,
            x: sX,
            y: rainConfig.yTop - j * rainConfig.charHeight * 0.9 + Math.random() * 3,
            z: sZ,
            speedY: bS * (j === 0 ? 1 : 0.82 + Math.random() * 0.13),
            streamIndex: j,
            charMap: getRandomCharMap(),

            opacity: j === 0 ? 0.99 : Math.max(0.15, 0.9 - (j / streamLength) * 0.85),
            currentStreamId: cSId,
            fadeFactor: 1 - j / streamLength,
          });
        }
      }
      if (instancedMeshRef.current?.geometry) {
        const geom = instancedMeshRef.current.geometry;
        geom.setAttribute('instanceOffset', instanceOffsetAttribute);
        geom.setAttribute('instanceColorOpacity', instanceColorOpacityAttribute);
        geom.setAttribute('aFadeFactor', instanceFadeFactorAttribute);
        particles.forEach((p, idx) => {
          dummyObject.position.set(p.x, p.y, p.z);
          dummyObject.updateMatrix();
          instancedMeshRef.current.setMatrixAt(idx, dummyObject.matrix);
          instanceOffsetAttribute.setXYZW(idx, p.charMap.u, p.charMap.v, p.charMap.w, p.charMap.h);
          instanceColorOpacityAttribute.setW(idx, p.opacity);
          instanceFadeFactorAttribute.setX(idx, p.fadeFactor);
        });
        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        instanceOffsetAttribute.needsUpdate = true;
        instanceColorOpacityAttribute.needsUpdate = true;
        instanceFadeFactorAttribute.needsUpdate = true;
      }
    }, [
      atlasData,
      rainConfig,
      planeSize,
      xSpreadFactor,
      zSpreadFactor,
      streamCount,
      streamLength,
      maxParticles,
      getRandomCharMap,
      dummyObject,
      particles,
      instanceOffsetAttribute,
      instanceColorOpacityAttribute,
      instanceFadeFactorAttribute,
    ]);
    useFrame((state, delta) => {
      if (!instancedMeshRef.current || !atlasData) return;

      // Update Uniforms for smooth color transition (GPU handles the rest)
      const mat = instancedMeshRef.current.material as any;
      if (mat.uniforms) {
        const currentThemeAdjust = themeAdjustRef.current;
        const { lead, trail } = getColorsForTheme(currentThemeAdjust);
        mat.uniforms.uLeadColor.value.copy(lead);
        mat.uniforms.uTrailColor.value.copy(trail);
        // Update mouse position for interactive glow
        mat.uniforms.uMouse.value.copy(mouseRef.current);
      }

      const cD = Math.min(delta, 0.05);
      timeRef.current += cD;
      const streamsToReset = new Set<number>();
      let needsMatrixUpdate = false;
      let needsOffsetUpdate = false;
      let needsColorOpacityUpdate = false;
      const halfPlaneX = (planeSize / 2) * xSpreadFactor;
      const halfPlaneZ = (planeSize / 2) * zSpreadFactor;
      const timeNow = timeRef.current;

      // Wind effect
      const windX = Math.sin(timeNow * 0.5) * 0.5;
      const windZ = Math.cos(timeNow * 0.3) * 0.3;

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        if (streamsToReset.has(p.currentStreamId)) {
          if (p.opacity > 0) {
            p.opacity = Math.max(0, p.opacity - cD * 5);
            instanceColorOpacityAttribute.setW(i, p.opacity);
            needsColorOpacityUpdate = true;
          }
          continue;
        }

        // Apply gravity and wind
        p.y -= p.speedY * cD;
        p.x += windX * cD; // Wind
        p.z += windZ * cD; // Wind

        if (p.streamIndex > 0 && Math.random() < 0.008) {
          p.charMap = getRandomCharMap();
          instanceOffsetAttribute.setXYZW(i, p.charMap.u, p.charMap.v, p.charMap.w, p.charMap.h);
          needsOffsetUpdate = true;
        }
        if (p.streamIndex === 0) {
          const groundY = getPlaneHeightAt(p.x, p.z, timeNow, planeConfig);
          const collisionThreshold = groundY + rainConfig.charHeight * 0.05;
          if (p.y <= collisionThreshold) {
            if (onRainImpact) onRainImpact(impactVec.set(p.x, groundY, p.z));
            streamsToReset.add(p.currentStreamId);
            p.opacity = 0;
            instanceColorOpacityAttribute.setW(i, p.opacity);
            needsColorOpacityUpdate = true;
          }
        }
        if (
          p.y < rainConfig.yBottom &&
          p.streamIndex === 0 &&
          !streamsToReset.has(p.currentStreamId)
        ) {
          streamsToReset.add(p.currentStreamId);
          p.opacity = 0;
          instanceColorOpacityAttribute.setW(i, p.opacity);
          needsColorOpacityUpdate = true;
        }
        if (p.opacity > 0) {
          dummyObject.position.set(p.x, p.y, p.z);
          dummyObject.updateMatrix();
          instancedMeshRef.current.setMatrixAt(i, dummyObject.matrix);
          needsMatrixUpdate = true;
        }
        instanceColorOpacityAttribute.setW(i, p.opacity);
        if (p.opacity > 0) needsColorOpacityUpdate = true;
      }
      if (streamsToReset.size > 0) {
        const bS =
          rainConfig.speedBaseMin +
          Math.random() * (rainConfig.speedBaseMax - rainConfig.speedBaseMin);
        const nCSId = nextStreamId.current++;
        const nSX = Math.random() * halfPlaneX * 2 - halfPlaneX;
        const nSZ = Math.random() * halfPlaneZ * 2 - halfPlaneZ;
        for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          if (streamsToReset.has(p.currentStreamId)) {
            const isLead = p.streamIndex === 0;
            p.x = nSX;
            p.y = rainConfig.yTop - p.streamIndex * rainConfig.charHeight * 0.9 + Math.random() * 3;
            p.z = nSZ;
            p.speedY = bS * (isLead ? 1 : 0.82 + Math.random() * 0.13);
            p.charMap = getRandomCharMap();
            p.opacity = isLead ? 0.99 : Math.max(0.15, 0.9 - (p.streamIndex / streamLength) * 0.85);
            p.currentStreamId = nCSId;
            instanceOffsetAttribute.setXYZW(i, p.charMap.u, p.charMap.v, p.charMap.w, p.charMap.h);
            instanceColorOpacityAttribute.setW(i, p.opacity);
            needsColorOpacityUpdate = true;
          }
        }
      }
      if (needsMatrixUpdate) instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      if (needsOffsetUpdate) instanceOffsetAttribute.needsUpdate = true;
      if (needsColorOpacityUpdate) instanceColorOpacityAttribute.needsUpdate = true;
    });
    if (maxParticles === 0) return null;
    return (
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, maxParticles]}
        frustumCulled={false}
      >
        <planeGeometry
          args={[rainConfig.charHeight * rainConfig.charAspect, rainConfig.charHeight]}
        >
          <primitive attach="attributes-instanceOffset" object={instanceOffsetAttribute} />
          <primitive
            attach="attributes-instanceColorOpacity"
            object={instanceColorOpacityAttribute}
          />
        </planeGeometry>
        {/* @ts-ignore */}
        <rainParticleShaderMaterial
          uAtlasMap={atlasData.atlasTexture}
          uLeadColor={currentLeadColor}
          uTrailColor={currentTrailColorBase}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </instancedMesh>
    );
  }
);
RainEffectComponentR3F.displayName = 'RainEffectComponentR3F';

const SceneContent: React.FC<{
  currentTheme: string | undefined;
  cameraControls: CameraControls;
  parsedActiveCfg: ParsedSceneConfig;
  timeRef: React.MutableRefObject<number>;
}> = React.memo(({ currentTheme, cameraControls, parsedActiveCfg, timeRef }) => {
  const { camera, gl, scene, pointer, raycaster } = useThree();
  const atlasData = useMemo(() => createCharacterAtlas(), []);
  const triggerSplashRef = useRef<any | null>(null);
  useEffect(() => {
    return () => {
      if (atlasData?.atlasTexture) {
        atlasData.atlasTexture.dispose();
      }
    };
  }, [atlasData]);
  const themeAdjustRef = useRef(currentTheme === 'dark' ? 0 : 1);
  const targetThemeAdjust = currentTheme === 'dark' ? 0 : 1;

  // Pre-allocated objects for render loop per three-best-practices: render-avoid-allocations
  const bgColorRef = useRef(new THREE.Color());
  const mouseWorldRef = useRef(new THREE.Vector3());
  const mousePlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const mouseIntersect = useMemo(() => new THREE.Vector3(), []);

  useFrame((_state, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    themeAdjustRef.current = THREE.MathUtils.lerp(
      themeAdjustRef.current,
      targetThemeAdjust,
      clampedDelta * 10.0
    );

    // Update camera
    camera.position.set(cameraControls.xPos, cameraControls.yPos, cameraControls.zPos);
    camera.lookAt(cameraControls.lookAtX, cameraControls.lookAtY, cameraControls.lookAtZ);

    // Update fog and clear color based on smoothed themeAdjust
    const t = themeAdjustRef.current;
    const darkBg = parsedActiveCfg.themeColors.darkBg;
    const lightBg = parsedActiveCfg.themeColors.lightBg;
    // Use pre-allocated color to avoid GC
    const currentBg = bgColorRef.current.copy(darkBg).lerp(lightBg, t);

    // Project pointer to world for mouse interaction
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(mousePlane, mouseIntersect);
    if (mouseIntersect) {
      mouseWorldRef.current.copy(mouseIntersect);
    }

    gl.setClearColor(currentBg, 1.0);
    if (scene.fog) {
      (scene.fog as THREE.Fog | THREE.FogExp2).color.copy(currentBg);
      // Also lerp fog density
      const densityDark = parsedActiveCfg.effects.fog?.densityDarkTheme ?? 0.01;
      const densityLight = parsedActiveCfg.effects.fog?.densityLightTheme ?? 0.004;
      const currentDensity = THREE.MathUtils.lerp(densityDark, densityLight, t);
      if ('density' in scene.fog) {
        (scene.fog as THREE.FogExp2).density = currentDensity;
      }
    }
  });

  const fogDensity =
    targetThemeAdjust === 0
      ? parsedActiveCfg.effects.fog?.densityDarkTheme
      : parsedActiveCfg.effects.fog?.densityLightTheme;
  const fogEnabled = parsedActiveCfg.effects.fog?.enabled ?? true;
  const bgColor =
    targetThemeAdjust === 0
      ? parsedActiveCfg.themeColors.darkBg
      : parsedActiveCfg.themeColors.lightBg;
  return (
    <>
      {fogEnabled && fogDensity !== undefined && (
        <fogExp2 attach="fog" args={[bgColor, fogDensity]} />
      )}
      <ambientLight intensity={0.3} />
      <PlaneComponentR3F
        themeAdjustRef={themeAdjustRef}
        planeConfig={parsedActiveCfg.plane}
        timeRef={timeRef}
      />
      {atlasData && (
        <RainEffectComponentR3F
          rainConfig={parsedActiveCfg.rain}
          planeConfig={parsedActiveCfg.plane}
          planeSize={parsedActiveCfg.plane.size}
          atlasData={atlasData}
          themeAdjustRef={themeAdjustRef}
          onRainImpact={triggerSplashRef.current}
          timeRef={timeRef}
          mouseRef={mouseWorldRef}
        />
      )}
      {atlasData && parsedActiveCfg.splashParticles.enabled && (
        <SplashParticleSystemR3F
          config={parsedActiveCfg.splashParticles}
          atlasData={atlasData}
          triggerRef={triggerSplashRef}
        />
      )}
    </>
  );
});
SceneContent.displayName = 'SceneContent';

interface ThreeSceneProps {
  currentTheme: string | undefined;
  cameraControls: CameraControls;
  dynamicConfig?: Partial<SceneConfig>;
}

const detectInitialQuality = (): 'low' | 'medium' | 'high' => {
  if (typeof navigator === 'undefined') return 'medium';
  const ua = (navigator as any).userAgent || '';
  const isMobile = (navigator as any).userAgentData?.mobile || /Mobi|Android/i.test(ua);
  const dm = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const saveData = (navigator as any).connection?.saveData === true;
  if (saveData) return 'low';
  if (isMobile && (dm <= 4 || cores <= 4)) return 'low';
  if (isMobile || dm <= 4 || cores <= 6) return 'medium';
  return 'high';
};

const capDpr = (quality: 'low' | 'medium' | 'high') =>
  quality === 'high'
    ? [1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1]
    : quality === 'medium'
      ? [1, 1.2]
      : [1, 1.0];

const scaleInt = (v: number, quality: 'low' | 'medium' | 'high') =>
  quality === 'high'
    ? v
    : quality === 'medium'
      ? Math.max(1, Math.floor(v * 0.75))
      : Math.max(1, Math.floor(v * 0.4));

const ThreeScene: React.FC<ThreeSceneProps> = ({ currentTheme, cameraControls, dynamicConfig }) => {
  const parsedActiveCfg = useMemo(() => {
    return parseConfigColors(
      dynamicConfig || importedDefaultConfig,
      currentTheme === 'dark' ? 'dark' : 'light'
    );
  }, [dynamicConfig, currentTheme]);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>(() => detectInitialQuality());
  const [dpr, setDpr] = useState<[number, number]>(() => capDpr(quality) as [number, number]);

  const timeRef = useRef(0);
  const effectiveConfig = useMemo(() => {
    const baseRain = parsedActiveCfg.rain;
    const baseSplash = parsedActiveCfg.splashParticles;
    return {
      ...parsedActiveCfg,
      rain: {
        ...baseRain,
        streamCountDesktop: scaleInt(baseRain.streamCountDesktop, quality),
        streamCountDesktopLight:
          baseRain.streamCountDesktopLight !== undefined
            ? scaleInt(baseRain.streamCountDesktopLight, quality)
            : scaleInt(baseRain.streamCountDesktop, quality),
        streamCountMobile: scaleInt(baseRain.streamCountMobile, quality),
        streamLengthDesktop: scaleInt(baseRain.streamLengthDesktop, quality),
        streamLengthMobile: scaleInt(baseRain.streamLengthMobile, quality),
      },
      splashParticles: {
        ...baseSplash,
        maxParticles: scaleInt(baseSplash.maxParticles, quality),
        particlesPerSplash: scaleInt(baseSplash.particlesPerSplash, quality),
      },
    };
  }, [parsedActiveCfg, quality]);

  const bloomConfig = effectiveConfig.effects.bloom;
  const bloomEnabled = bloomConfig.enabled && quality !== 'low';

  useEffect(() => {
    setDpr(capDpr(quality) as [number, number]);
  }, [quality]);

  return (
    <div className={cn('absolute inset-0 w-full h-full pointer-events-none')}>
      <Canvas
        camera={{
          position: [
            effectiveConfig.camera.initialXPos,
            effectiveConfig.camera.initialYPos,
            effectiveConfig.camera.initialZPos,
          ],
          fov: effectiveConfig.camera.fov,
          near: effectiveConfig.camera.near,
          far: effectiveConfig.camera.far,
        }}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: true,
          logarithmicDepthBuffer: false,
          toneMapping: THREE.NoToneMapping,
        }}
        dpr={dpr}
        style={{ background: 'transparent' }}
        frameloop="always"
        shadows={false}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setQuality((q) => (q === 'high' ? 'medium' : 'low'))}
          onIncline={() => setQuality((q) => (q === 'low' ? 'medium' : 'high'))}
        />
        <Suspense fallback={null}>
          {bloomEnabled ? (
            <EffectComposer>
              <Bloom
                intensity={bloomConfig.intensity}
                luminanceThreshold={bloomConfig.luminanceThreshold}
                luminanceSmoothing={bloomConfig.luminanceSmoothing}
                kernelSize={getKernelSize(quality === 'medium' ? 'SMALL' : bloomConfig.kernelSize)}
                mipmapBlur={bloomConfig.mipmapBlur}
              />
              <SceneContent
                currentTheme={currentTheme}
                cameraControls={cameraControls}
                parsedActiveCfg={effectiveConfig}
                timeRef={timeRef}
              />
            </EffectComposer>
          ) : (
            <SceneContent
              currentTheme={currentTheme}
              cameraControls={cameraControls}
              parsedActiveCfg={effectiveConfig}
              timeRef={timeRef}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
export default ThreeScene;
