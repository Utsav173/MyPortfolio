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

const PlaneShaderMaterial = shaderMaterial(
  {
    time: 0,
    uThemeAdjust: 0,
    uPlaneColorDarkTheme: new THREE.Color(0x19193b),
    uPlaneColorLightTheme: new THREE.Color(0x205d75),
    uNoiseStrengthHill1: 15.0,
    uNoiseStrengthHill2: 11.3,
    uNoiseStrengthHill3: 3.2,
    uNoiseStrengthOverall: 46.5,
    uPlaneSize: 256.0,
    uOpacityFactorDark: 0.87,
    uOpacityFactorLight: 0.98,
  },
  ` varying vec3 vPosition; 
    uniform float time; 
    uniform float uNoiseStrengthHill1; 
    uniform float uNoiseStrengthHill2; 
    uniform float uNoiseStrengthHill3; 
    uniform float uNoiseStrengthOverall; 
    uniform float uPlaneSize;
    mat4 rotateMatrixX(float radian) { return mat4(1.,0.,0.,0.,0.,cos(radian),-sin(radian),0.,0.,sin(radian),cos(radian),0.,0.,0.,0.,1.);} vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;} vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;} vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);} vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;} vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);} float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod289(Pi0);Pi1=mod289(Pi1);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.y,Pi0.y,Pi1.y,Pi1.y);vec4 iz0=vec4(Pi0.z,Pi0.z,Pi0.z,Pi0.z);vec4 iz1=vec4(Pi1.z,Pi1.z,Pi1.z,Pi1.z);vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0*(1./7.);vec4 gy0=fract(floor(gx0)*(1./7.))-.5;gx0=fract(gx0);vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1*(1./7.);vec4 gy1=fract(floor(gx1)*(1./7.))-.5;gx1=fract(gx1);vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.y,Pf0.z));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.x,Pf1.y,Pf0.z));float n001=dot(g001,vec3(Pf0.x,Pf0.y,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.y,Pf1.z));float n111=dot(g111,Pf1);vec3 fade_xyz_val=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz_val.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz_val.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz_val.x);return 2.2*n_xyz;} void main() { vec3 updatePosition = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz; float sin1 = sin(radians(updatePosition.x / (uPlaneSize/2.0) * 90.0)); vec3 noisePosition = updatePosition + vec3(0.0, 0.0, time * -18.0); float noise1 = cnoise(noisePosition * 0.065); float noise2 = cnoise(noisePosition * 0.045); float noise3 = cnoise(noisePosition * 0.28); vec3 lastPosition = updatePosition + vec3(0.0, noise1 * sin1 * uNoiseStrengthHill1 + noise2 * sin1 * uNoiseStrengthHill2 + noise3 * (abs(sin1) * 1.7 + 0.4) * uNoiseStrengthHill3 + pow(sin1, 2.0) * uNoiseStrengthOverall, 0.0); vPosition = lastPosition; gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPosition, 1.0); }`,
  ` varying vec3 vPosition; uniform float uThemeAdjust; uniform vec3 uPlaneColorDarkTheme; uniform vec3 uPlaneColorLightTheme; uniform float uPlaneSize; uniform float uOpacityFactorDark; uniform float uOpacityFactorLight; void main() { float opacityFactor = (110.0 - length(vPosition)) / uPlaneSize; float currentOpacityFactor = mix(uOpacityFactorDark, uOpacityFactorLight, uThemeAdjust); float baseOpacity = smoothstep(0.0, 0.9, opacityFactor) * currentOpacityFactor; vec3 color = mix(uPlaneColorDarkTheme, uPlaneColorLightTheme, uThemeAdjust); gl_FragColor = vec4(color, baseOpacity); }`
);

const RainParticleShaderMaterial = shaderMaterial(
  { uAtlasMap: new THREE.Texture() },
  ` precision highp float; attribute vec4 instanceOffset; attribute vec4 instanceColorOpacity; varying vec2 vAtlasUv; varying vec4 vColorOpacity; void main() { vAtlasUv = uv * instanceOffset.zw + instanceOffset.xy; vColorOpacity = instanceColorOpacity; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`,
  ` precision mediump float; uniform sampler2D uAtlasMap; varying vec2 vAtlasUv; varying vec4 vColorOpacity; void main() { vec4 texColor = texture2D(uAtlasMap, vAtlasUv); if (texColor.a < 0.05) discard; gl_FragColor = vec4(vColorOpacity.rgb * texColor.rgb, texColor.a * vColorOpacity.a); }`
);

const SplashParticleShaderMaterial = shaderMaterial(
  { uAtlasMap: new THREE.Texture() },
  ` precision highp float; attribute vec4 instanceOffset; attribute vec4 instanceColorOpacity; varying vec2 vAtlasUv; varying vec4 vColorOpacity; void main() { vAtlasUv = uv * instanceOffset.zw + instanceOffset.xy; vColorOpacity = instanceColorOpacity; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`,
  ` precision mediump float; uniform sampler2D uAtlasMap; varying vec2 vAtlasUv; varying vec4 vColorOpacity; void main() { vec4 texColor = texture2D(uAtlasMap, vAtlasUv); if (texColor.a < 0.01) discard; gl_FragColor = vec4(vColorOpacity.rgb * texColor.rgb, texColor.a * vColorOpacity.a); }`
);

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
  themeAdjust: number;
  planeConfig: ParsedSceneConfig['plane'];
  timeRef: React.MutableRefObject<number>;
}> = React.memo(({ themeAdjust, planeConfig, timeRef }) => {
  const materialRef = useRef<any>(null!);
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uThemeAdjust.value = themeAdjust;
    }
  }, [themeAdjust]);
  useFrame((_state, delta) => {
    const clamped = Math.min(delta, 0.05);
    if (materialRef.current?.time !== undefined) {
      materialRef.current.time += clamped * planeConfig.timeFactor;
      timeRef.current = materialRef.current.time;
    }
  });
  const materialProps = useMemo(
    () => ({
      uPlaneColorDarkTheme: planeConfig.planeColorForDarkTheme,
      uPlaneColorLightTheme: planeConfig.planeColorForLightTheme,
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
        uThemeAdjust={themeAdjust}
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
  color: THREE.Color;
  opacity: number;
  currentStreamId: number;
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
  color: THREE.Color;
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
  const splashBaseRenderColor = useMemo(() => {
    return config.splashColor.clone();
  }, [config.splashColor]);
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
        color: splashBaseRenderColor.clone(),
      });
    }
  }, [
    config.maxParticles,
    config.lifespan,
    splashCharMap,
    splashBaseRenderColor,
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
          p.color.copy(splashBaseRenderColor);
          activatedCount++;
        }
      }
    },
    [config, particles, splashBaseRenderColor]
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
        instanceColorOpacityAttribute.setXYZW(p.id, p.color.r, p.color.g, p.color.b, p.opacity);
      } else if (instanceColorOpacityAttribute.getW(p.id) > 0) {
        instanceColorOpacityAttribute.setW(p.id, 0);
        needsUpdate = true;
      }
    });
    if (needsUpdate) {
      meshRef.current!.instanceMatrix.needsUpdate = true;
      instanceOffsetAttribute.needsUpdate = true;
      instanceColorOpacityAttribute.needsUpdate = true;
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
  themeAdjust: number;
  onRainImpact: TriggerSplashFn | null;
  timeRef: React.MutableRefObject<number>;
}> = React.memo(
  ({ rainConfig, planeConfig, planeSize, atlasData, themeAdjust, onRainImpact, timeRef }) => {
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
    const particles = useRef<RainParticleData[]>([]).current;
    const nextStreamId = useRef(0);
    const dummyObject = useMemo(() => new THREE.Object3D(), []);
    const { currentLeadColor, currentTrailColorBase } = useMemo(() => {
      return {
        currentLeadColor: themeAdjust === 0 ? rainConfig.leadColorDark : rainConfig.leadColorLight,
        currentTrailColorBase:
          themeAdjust === 0 ? rainConfig.trailColorBaseDark : rainConfig.trailColorBaseLight,
      };
    }, [themeAdjust, rainConfig]);
    const defaultCharMap = atlasData.defaultCharMap;
    const { width: screenWidth } = useThree((state) => state.size);
    const isMobile = useMemo(() => screenWidth < 768, [screenWidth]);
    const isLightMode = themeAdjust === 1;
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
    const maxParticles = useMemo(() => streamCount * streamLength, [streamCount, streamLength]);
    const xSpreadFactor = useMemo(() => (isMobile ? 0.35 : 0.45), [isMobile]);
    const zSpreadFactor = useMemo(() => (isMobile ? 0.25 : 0.35), [isMobile]);
    const getTrailColor = useCallback(
      (idx: number, len: number, base: THREE.Color): THREE.Color => {
        const baseFade = 1 - idx / len;
        const fade = Math.pow(baseFade, 1.5) * 0.85;
        const randomJitter = 1.0 - Math.random() * 0.15;
        return base.clone().multiplyScalar(fade * randomJitter);
      },
      []
    );
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
        particles.forEach((p) => {
          p.color =
            p.streamIndex === 0
              ? currentLeadColor.clone()
              : getTrailColor(p.streamIndex, streamLength, currentTrailColorBase);
        });
        const attr = instancedMeshRef.current.geometry.getAttribute('instanceColorOpacity') as
          | THREE.InstancedBufferAttribute
          | undefined;
        if (attr) {
          particles.forEach((p, i) => attr.setXYZW(i, p.color.r, p.color.g, p.color.b, p.opacity));
          attr.needsUpdate = true;
        }
      }
    }, [currentLeadColor, currentTrailColorBase, getTrailColor, streamLength, particles]);
    const instanceOffsetAttribute = useMemo(
      () => new THREE.InstancedBufferAttribute(new Float32Array(maxParticles * 4), 4),
      [maxParticles]
    );
    const instanceColorOpacityAttribute = useMemo(
      () => new THREE.InstancedBufferAttribute(new Float32Array(maxParticles * 4), 4),
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
            color:
              j === 0
                ? currentLeadColor.clone()
                : getTrailColor(j, streamLength, currentTrailColorBase),
            opacity: j === 0 ? 0.99 : Math.max(0.15, 0.9 - (j / streamLength) * 0.85),
            currentStreamId: cSId,
          });
        }
      }
      if (instancedMeshRef.current?.geometry) {
        const geom = instancedMeshRef.current.geometry;
        geom.setAttribute('instanceOffset', instanceOffsetAttribute);
        geom.setAttribute('instanceColorOpacity', instanceColorOpacityAttribute);
        particles.forEach((p, idx) => {
          dummyObject.position.set(p.x, p.y, p.z);
          dummyObject.updateMatrix();
          instancedMeshRef.current.setMatrixAt(idx, dummyObject.matrix);
          instanceOffsetAttribute.setXYZW(idx, p.charMap.u, p.charMap.v, p.charMap.w, p.charMap.h);
          instanceColorOpacityAttribute.setXYZW(idx, p.color.r, p.color.g, p.color.b, p.opacity);
        });
        instancedMeshRef.current.instanceMatrix.needsUpdate = true;
        instanceOffsetAttribute.needsUpdate = true;
        instanceColorOpacityAttribute.needsUpdate = true;
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
      currentLeadColor,
      getTrailColor,
      currentTrailColorBase,
      dummyObject,
      particles,
      instanceOffsetAttribute,
      instanceColorOpacityAttribute,
    ]);
    useFrame((_state, delta) => {
      if (!instancedMeshRef.current || particles.length === 0 || maxParticles === 0) return;
      const cD = Math.min(delta, 0.05);
      const streamsToReset = new Set<number>();
      let needsMatrixUpdate = false;
      let needsOffsetUpdate = false;
      let needsColorOpacityUpdate = false;
      const halfPlaneX = (planeSize / 2) * xSpreadFactor;
      const halfPlaneZ = (planeSize / 2) * zSpreadFactor;
      const timeNow = timeRef.current;
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
        p.y -= p.speedY * cD;
        if (p.streamIndex > 0 && Math.random() < 0.006) {
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
        instanceOffsetAttribute.setXYZW(i, p.charMap.u, p.charMap.v, p.charMap.w, p.charMap.h);
        instanceColorOpacityAttribute.setXYZW(i, p.color.r, p.color.g, p.color.b, p.opacity);
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
            p.color = isLead
              ? currentLeadColor.clone()
              : getTrailColor(p.streamIndex, streamLength, currentTrailColorBase);
            p.opacity = isLead ? 0.99 : Math.max(0.15, 0.9 - (p.streamIndex / streamLength) * 0.85);
            p.currentStreamId = nCSId;
            instanceOffsetAttribute.setXYZW(i, p.charMap.u, p.charMap.v, p.charMap.w, p.charMap.h);
            instanceColorOpacityAttribute.setXYZW(i, p.color.r, p.color.g, p.color.b, p.opacity);
            needsOffsetUpdate = true;
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
  const themeAdjust = currentTheme === 'dark' ? 0 : 1;
  useEffect(() => {
    const newBgColor =
      themeAdjust === 0 ? parsedActiveCfg.themeColors.darkBg : parsedActiveCfg.themeColors.lightBg;
    gl.setClearColor(newBgColor, 1.0);
    if (scene.fog) {
      (scene.fog as THREE.Fog | THREE.FogExp2).color.copy(newBgColor);
    }
  }, [themeAdjust, gl, scene, parsedActiveCfg.themeColors]);
  useFrame(() => {
    camera.position.set(cameraControls.xPos, cameraControls.yPos, cameraControls.zPos);
    camera.lookAt(cameraControls.lookAtX, cameraControls.lookAtY, cameraControls.lookAtZ);
  });
  const fogDensity =
    themeAdjust === 0
      ? parsedActiveCfg.effects.fog?.densityDarkTheme
      : parsedActiveCfg.effects.fog?.densityLightTheme;
  const fogEnabled = parsedActiveCfg.effects.fog?.enabled ?? true;
  const bgColor =
    themeAdjust === 0 ? parsedActiveCfg.themeColors.darkBg : parsedActiveCfg.themeColors.lightBg;
  return (
    <>
      {fogEnabled && fogDensity !== undefined && (
        <fogExp2 attach="fog" args={[bgColor, fogDensity]} />
      )}
      <ambientLight intensity={0.3} />
      <PlaneComponentR3F
        themeAdjust={themeAdjust}
        planeConfig={parsedActiveCfg.plane}
        timeRef={timeRef}
      />
      {atlasData && (
        <RainEffectComponentR3F
          rainConfig={parsedActiveCfg.rain}
          planeConfig={parsedActiveCfg.plane}
          planeSize={parsedActiveCfg.plane.size}
          atlasData={atlasData}
          themeAdjust={themeAdjust}
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

const CanvasErrorFallback = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#222',
      color: 'white',
      flexDirection: 'column',
    }}
  >
    <h2>Oops! Something went wrong in the 3D scene.</h2>
  </div>
);

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
  if (isMobile && (dm <= 3 || cores <= 4)) return 'low';
  if (isMobile || dm <= 4 || cores <= 6) return 'medium';
  return 'high';
};

const capDpr = (quality: 'low' | 'medium' | 'high') =>
  quality === 'high'
    ? [1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.25) : 1]
    : quality === 'medium'
      ? [1, 1.0]
      : [1, 1.0];

const scaleInt = (v: number, quality: 'low' | 'medium' | 'high') =>
  quality === 'high'
    ? v
    : quality === 'medium'
      ? Math.max(1, Math.floor(v * 0.7))
      : Math.max(1, Math.floor(v * 0.45));

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
  const effectiveRain = useMemo(() => {
    const base = parsedActiveCfg.rain;
    return {
      ...base,
      streamCountDesktop: scaleInt(base.streamCountDesktop, quality),
      streamCountDesktopLight:
        base.streamCountDesktopLight !== undefined
          ? scaleInt(base.streamCountDesktopLight, quality)
          : scaleInt(base.streamCountDesktop, quality), // provide a default value
      streamCountMobile: scaleInt(base.streamCountMobile, quality),
      streamLengthDesktop: scaleInt(base.streamLengthDesktop, quality),
      streamLengthMobile: scaleInt(base.streamLengthMobile, quality),
      charHeight:
        quality === 'high'
          ? base.charHeight
          : quality === 'medium'
            ? base.charHeight * 1.05
            : base.charHeight * 1.1,
    };
  }, [parsedActiveCfg.rain, quality]);
  const bloomConfig = parsedActiveCfg.effects.bloom;
  const bloomEnabled = bloomConfig.enabled && quality !== 'low';

  useEffect(() => {
    setDpr(capDpr(quality) as [number, number]);
  }, [quality]);

  return (
    <div className={cn('absolute inset-0 w-full h-full pointer-events-none')}>
      <Canvas
        camera={{
          position: [
            parsedActiveCfg.camera.initialXPos,
            parsedActiveCfg.camera.initialYPos,
            parsedActiveCfg.camera.initialZPos,
          ],
          fov: parsedActiveCfg.camera.fov,
          near: parsedActiveCfg.camera.near,
          far: parsedActiveCfg.camera.far,
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
          flipflops={2}
          onDecline={() => setQuality((q) => (q === 'high' ? 'medium' : 'low'))}
          onIncline={() => setQuality((q) => (q === 'low' ? 'medium' : 'high'))}
        />
        {typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches ? (
          bloomEnabled ? (
            <EffectComposer>
              <Bloom
                intensity={Math.min(bloomConfig.intensity, 0.25)}
                luminanceThreshold={bloomConfig.luminanceThreshold}
                luminanceSmoothing={bloomConfig.luminanceSmoothing}
                kernelSize={KernelSize.SMALL}
                mipmapBlur={false}
              />
              <SceneContent
                currentTheme={currentTheme}
                cameraControls={cameraControls}
                parsedActiveCfg={{ ...parsedActiveCfg, rain: effectiveRain }}
                timeRef={timeRef}
              />
            </EffectComposer>
          ) : (
            <SceneContent
              currentTheme={currentTheme}
              cameraControls={cameraControls}
              parsedActiveCfg={{ ...parsedActiveCfg, rain: effectiveRain }}
              timeRef={timeRef}
            />
          )
        ) : (
          <Suspense fallback={<CanvasErrorFallback />}>
            <SceneContent
              currentTheme={currentTheme}
              cameraControls={cameraControls}
              parsedActiveCfg={{ ...parsedActiveCfg, rain: effectiveRain }}
              timeRef={timeRef}
            />
          </Suspense>
        )}
      </Canvas>
    </div>
  );
};
export default ThreeScene;
