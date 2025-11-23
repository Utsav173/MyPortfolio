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

const jsCnoise = (P: THREE.Vector3): number => {
  const _js_floor_vec3 = (v: THREE.Vector3): THREE.Vector3 => v.clone().floor();
  const _js_fract_vec3 = (v: THREE.Vector3): THREE.Vector3 =>
    v.clone().sub(_js_floor_vec3(v.clone()));
  const _js_floor_vec4 = (v: THREE.Vector4): THREE.Vector4 => v.clone().floor();
  const _js_fract_vec4 = (v: THREE.Vector4): THREE.Vector4 =>
    v.clone().sub(_js_floor_vec4(v.clone()));
  const _js_mod289_vec3 = (x: THREE.Vector3): THREE.Vector3 =>
    x.clone().sub(_js_floor_vec3(x.clone().multiplyScalar(1.0 / 289.0)).multiplyScalar(289.0));
  const _js_mod289_vec4 = (x: THREE.Vector4): THREE.Vector4 =>
    x.clone().sub(_js_floor_vec4(x.clone().multiplyScalar(1.0 / 289.0)).multiplyScalar(289.0));
  const _js_permute_vec4 = (x: THREE.Vector4): THREE.Vector4 =>
    _js_mod289_vec4(x.clone().multiplyScalar(34.0).addScalar(1.0).multiply(x));
  const _js_taylorInvSqrt_vec4 = (r: THREE.Vector4): THREE.Vector4 =>
    new THREE.Vector4(
      1.79284291400159 - 0.85373472095314 * r.x,
      1.79284291400159 - 0.85373472095314 * r.y,
      1.79284291400159 - 0.85373472095314 * r.z,
      1.79284291400159 - 0.85373472095314 * r.w
    );
  const _js_fade_vec3 = (t: THREE.Vector3): THREE.Vector3 => {
    const tc = t.clone();
    const t615 = tc.clone().multiplyScalar(6.0).subScalar(15.0);
    const tmult615 = tc.clone().multiply(t615);
    const inner = tmult615.addScalar(10.0);
    return tc.clone().multiply(tc).multiply(tc).multiply(inner);
  };
  const _js_abs_vec4 = (v: THREE.Vector4): THREE.Vector4 =>
    new THREE.Vector4(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z), Math.abs(v.w));
  const _js_step_s_v4 = (edge: number, x: THREE.Vector4): THREE.Vector4 =>
    new THREE.Vector4(
      x.x < edge ? 0.0 : 1.0,
      x.y < edge ? 0.0 : 1.0,
      x.z < edge ? 0.0 : 1.0,
      x.w < edge ? 0.0 : 1.0
    );
  const Pi0 = _js_floor_vec3(P);
  const Pi1 = Pi0.clone().addScalar(1.0);
  const Pi0_mod = _js_mod289_vec3(Pi0);
  const Pi1_mod = _js_mod289_vec3(Pi1);
  const Pf0 = _js_fract_vec3(P);
  const Pf1 = Pf0.clone().subScalar(1.0);
  const ix = new THREE.Vector4(Pi0_mod.x, Pi1_mod.x, Pi0_mod.x, Pi1_mod.x);
  const iy = new THREE.Vector4(Pi0_mod.y, Pi0_mod.y, Pi1_mod.y, Pi1_mod.y);
  const iz0 = new THREE.Vector4(Pi0_mod.z, Pi0_mod.z, Pi0_mod.z, Pi0_mod.z);
  const iz1 = new THREE.Vector4(Pi1_mod.z, Pi1_mod.z, Pi1_mod.z, Pi1_mod.z);
  const ixy = _js_permute_vec4(_js_permute_vec4(ix).add(iy));
  const ixy0 = _js_permute_vec4(ixy.clone().add(iz0));
  const ixy1 = _js_permute_vec4(ixy.clone().add(iz1));
  let gx0 = ixy0.clone().multiplyScalar(1 / 7);
  let gy0 = _js_fract_vec4(
    gx0
      .clone()
      .floor()
      .multiplyScalar(1 / 7)
  ).subScalar(0.5);
  gx0 = _js_fract_vec4(gx0);
  const gz0 = new THREE.Vector4(0.5).sub(_js_abs_vec4(gx0)).sub(_js_abs_vec4(gy0));
  const sz0 = _js_step_s_v4(0, gz0);
  gx0.sub(sz0.clone().multiply(_js_step_s_v4(0, gx0).subScalar(0.5)));
  gy0.sub(sz0.clone().multiply(_js_step_s_v4(0, gy0).subScalar(0.5)));
  let gx1 = ixy1.clone().multiplyScalar(1 / 7);
  let gy1 = _js_fract_vec4(
    gx1
      .clone()
      .floor()
      .multiplyScalar(1 / 7)
  ).subScalar(0.5);
  gx1 = _js_fract_vec4(gx1);
  const gz1 = new THREE.Vector4(0.5).sub(_js_abs_vec4(gx1)).sub(_js_abs_vec4(gy1));
  const sz1 = _js_step_s_v4(0, gz1);
  gx1.sub(sz1.clone().multiply(_js_step_s_v4(0, gx1).subScalar(0.5)));
  gy1.sub(sz1.clone().multiply(_js_step_s_v4(0, gy1).subScalar(0.5)));
  const g000 = new THREE.Vector3(gx0.x, gy0.x, gz0.x);
  const g100 = new THREE.Vector3(gx0.y, gy0.y, gz0.y);
  const g010 = new THREE.Vector3(gx0.z, gy0.z, gz0.z);
  const g110 = new THREE.Vector3(gx0.w, gy0.w, gz0.w);
  const g001 = new THREE.Vector3(gx1.x, gy1.x, gz1.x);
  const g101 = new THREE.Vector3(gx1.y, gy1.y, gz1.y);
  const g011 = new THREE.Vector3(gx1.z, gy1.z, gz1.z);
  const g111 = new THREE.Vector3(gx1.w, gy1.w, gz1.w);
  const norm0 = _js_taylorInvSqrt_vec4(
    new THREE.Vector4(g000.dot(g000), g010.dot(g010), g100.dot(g100), g110.dot(g110))
  );
  g000.multiplyScalar(norm0.x);
  g010.multiplyScalar(norm0.y);
  g100.multiplyScalar(norm0.z);
  g110.multiplyScalar(norm0.w);
  const norm1 = _js_taylorInvSqrt_vec4(
    new THREE.Vector4(g001.dot(g001), g011.dot(g011), g101.dot(g101), g111.dot(g111))
  );
  g001.multiplyScalar(norm1.x);
  g011.multiplyScalar(norm1.y);
  g101.multiplyScalar(norm1.z);
  g111.multiplyScalar(norm1.w);
  const n000 = g000.dot(Pf0);
  const n100 = g100.dot(new THREE.Vector3(Pf1.x, Pf0.y, Pf0.z));
  const n010 = g010.dot(new THREE.Vector3(Pf0.x, Pf1.y, Pf0.z));
  const n110 = g110.dot(new THREE.Vector3(Pf1.x, Pf1.y, Pf0.z));
  const n001 = g001.dot(new THREE.Vector3(Pf0.x, Pf0.y, Pf1.z));
  const n101 = g101.dot(new THREE.Vector3(Pf1.x, Pf0.y, Pf1.z));
  const n011 = g011.dot(new THREE.Vector3(Pf0.x, Pf1.y, Pf1.z));
  const n111 = g111.dot(Pf1);
  const fade_xyz_val = _js_fade_vec3(Pf0);
  const n_z = new THREE.Vector4(n000, n100, n010, n110).lerp(
    new THREE.Vector4(n001, n101, n011, n111),
    fade_xyz_val.z
  );
  const n_yz_result = new THREE.Vector2(n_z.x, n_z.y).lerp(
    new THREE.Vector2(n_z.z, n_z.w),
    fade_xyz_val.y
  );
  return 2.2 * THREE.MathUtils.lerp(n_yz_result.x, n_yz_result.y, fade_xyz_val.x);
};

interface CameraControls {
  xPos: number;
  yPos: number;
  zPos: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

const getPlaneHeightAt = (
  x: number,
  z: number,
  time: number,
  planeConfig: ParsedSceneConfig['plane']
): number => {
  const sin1 = Math.sin(THREE.MathUtils.degToRad((x / (planeConfig.size / 2)) * 90.0));
  const noiseArg = new THREE.Vector3(x, 0.0, -z + time * -18.0);
  const n1 = jsCnoise(noiseArg.clone().multiplyScalar(0.065));
  const n2 = jsCnoise(noiseArg.clone().multiplyScalar(0.045));
  const n3 = jsCnoise(noiseArg.clone().multiplyScalar(0.28));
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
  }, [
    config.maxParticles,
    config.lifespan,
    splashCharMap,
    config.enabled,
    particles,
  ]);
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
}> = React.memo(
  ({ rainConfig, planeConfig, planeSize, atlasData, themeAdjustRef, onRainImpact, timeRef }) => {
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
    const getColorsForTheme = useCallback(
      (adjust: number) => {
        const lead = new THREE.Color().lerpColors(
          rainConfig.leadColorDark,
          rainConfig.leadColorLight,
          adjust
        );
        const trail = new THREE.Color().lerpColors(
          rainConfig.trailColorBaseDark,
          rainConfig.trailColorBaseLight,
          adjust
        );
        return { lead, trail };
      },
      [rainConfig]
    );

    const maxParticles = useMemo(() => streamCount * streamLength, [streamCount, streamLength]);
    const xSpreadFactor = useMemo(() => (isMobile ? 0.22 : 0.45), [isMobile]); // Reduced for mobile density
    const zSpreadFactor = useMemo(() => (isMobile ? 0.2 : 0.35), [isMobile]); // Reduced for mobile density

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
      instanceFadeFactorAttribute
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
            if (onRainImpact) onRainImpact(new THREE.Vector3(p.x, groundY, p.z));
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
  const { camera, gl, scene } = useThree();
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
    const currentBg = new THREE.Color().lerpColors(darkBg, lightBg, t);

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
