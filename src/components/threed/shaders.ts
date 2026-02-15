import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// ─────────────────────────────────────────────────
// Plane Shader – Terrain with animated noise & grid
// IMPORTANT: Vertex shader kept as single-line (minified) to avoid
// GLSL newline/whitespace compilation issues on some WebGL drivers.
// ─────────────────────────────────────────────────
export const PlaneShaderMaterial = shaderMaterial(
  {
    time: 0,
    uThemeAdjust: 0,
    uPlaneColorDarkTheme: new THREE.Color(0x19193b),
    uPlaneColorLightTheme: new THREE.Color(0x205d75),
    uGridColorDarkTheme: new THREE.Color(0x00ffff),
    uGridColorLightTheme: new THREE.Color(0x3b82f6),
    uGridLineThickness: 0.018,
    uGridLineSpacing: 40.0,
    uNoiseStrengthHill1: 15.0,
    uNoiseStrengthHill2: 11.3,
    uNoiseStrengthHill3: 3.2,
    uNoiseStrengthOverall: 46.5,
    uPlaneSize: 256.0,
    uOpacityFactorDark: 0.87,
    uOpacityFactorLight: 0.98,
  },
  // Vertex shader – kept in proven minified format
  ` varying vec3 vPosition; 
    varying vec2 vUv;
    uniform float time; 
    uniform float uNoiseStrengthHill1; 
    uniform float uNoiseStrengthHill2; 
    uniform float uNoiseStrengthHill3; 
    uniform float uNoiseStrengthOverall; 
    uniform float uPlaneSize;
    mat4 rotateMatrixX(float radian) { return mat4(1.,0.,0.,0.,0.,cos(radian),-sin(radian),0.,0.,sin(radian),cos(radian),0.,0.,0.,0.,1.);} vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;} vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;} vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);} vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;} vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);} float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod289(Pi0);Pi1=mod289(Pi1);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.y,Pi0.y,Pi1.y,Pi1.y);vec4 iz0=vec4(Pi0.z,Pi0.z,Pi0.z,Pi0.z);vec4 iz1=vec4(Pi1.z,Pi1.z,Pi1.z,Pi1.z);vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0*(1./7.);vec4 gy0=fract(floor(gx0)*(1./7.))-.5;gx0=fract(gx0);vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1*(1./7.);vec4 gy1=fract(floor(gx1)*(1./7.))-.5;gx1=fract(gx1);vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.y,Pf0.z));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.x,Pf1.y,Pf0.z));float n001=dot(g001,vec3(Pf0.x,Pf0.y,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.y,Pf1.z));float n111=dot(g111,Pf1);vec3 fade_xyz_val=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz_val.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz_val.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz_val.x);return 2.2*n_xyz;} void main() { vUv = uv; vec3 updatePosition = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz; float sin1 = sin(radians(updatePosition.x / (uPlaneSize/2.0) * 90.0)); vec3 noisePosition = updatePosition + vec3(0.0, 0.0, time * -18.0); float noise1 = cnoise(noisePosition * 0.065); float noise2 = cnoise(noisePosition * 0.045); float noise3 = cnoise(noisePosition * 0.28); vec3 lastPosition = updatePosition + vec3(0.0, noise1 * sin1 * uNoiseStrengthHill1 + noise2 * sin1 * uNoiseStrengthHill2 + noise3 * (abs(sin1) * 1.7 + 0.4) * uNoiseStrengthHill3 + pow(sin1, 2.0) * uNoiseStrengthOverall, 0.0); vPosition = lastPosition; gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPosition, 1.0); }`,
  // Fragment shader
  ` varying vec3 vPosition; 
    varying vec2 vUv;
    uniform float uThemeAdjust; 
    uniform vec3 uPlaneColorDarkTheme; 
    uniform vec3 uPlaneColorLightTheme; 
    uniform vec3 uGridColorDarkTheme;
    uniform vec3 uGridColorLightTheme;
    uniform float uGridLineThickness;
    uniform float uGridLineSpacing;
    uniform float uPlaneSize; 
    uniform float uOpacityFactorDark; 
    uniform float uOpacityFactorLight; 
    void main() { 
      float opacityFactor = (110.0 - length(vPosition)) / uPlaneSize; 
      float currentOpacityFactor = mix(uOpacityFactorDark, uOpacityFactorLight, uThemeAdjust); 
      float baseOpacity = smoothstep(0.0, 0.9, opacityFactor) * currentOpacityFactor; 
      vec3 color = mix(uPlaneColorDarkTheme, uPlaneColorLightTheme, uThemeAdjust); 
      vec3 gridColor = mix(uGridColorDarkTheme, uGridColorLightTheme, uThemeAdjust);
      
      float gridX = smoothstep(uGridLineThickness, 0.0, abs(fract(vUv.x * uGridLineSpacing) - 0.5) * 2.0);
      float gridY = smoothstep(uGridLineThickness, 0.0, abs(fract(vUv.y * uGridLineSpacing) - 0.5) * 2.0);
      float gridFactor = max(gridX, gridY);

      vec3 finalColor = mix(color, gridColor, gridFactor);
      
      gl_FragColor = vec4(finalColor, baseOpacity); 
    }`
);

// ─────────────────────────────────────────────────
// Rain Particle Shader – Instanced character rain
// Optimizations: mediump precision, branchless color
// Feature: Mouse interaction via uMouse uniform
// ─────────────────────────────────────────────────
export const RainParticleShaderMaterial = shaderMaterial(
  {
    uAtlasMap: new THREE.Texture(),
    uLeadColor: new THREE.Color(),
    uTrailColor: new THREE.Color(),
    uMouse: new THREE.Vector3(0, 0, 0),
    uMouseRadius: 15.0,
  },
  // Vertex shader
  ` 
    precision highp float; 
    attribute vec4 instanceOffset; 
    attribute vec4 instanceColorOpacity; 
    attribute float aFadeFactor;
    varying vec2 vAtlasUv; 
    varying float vOpacity;
    varying float vFadeFactor;
    varying vec3 vWorldPos;
    void main() { 
      vAtlasUv = uv * instanceOffset.zw + instanceOffset.xy; 
      vOpacity = instanceColorOpacity.a;
      vFadeFactor = aFadeFactor;
      vWorldPos = (instanceMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); 
    }
  `,
  // Fragment shader
  ` 
    precision mediump float; 
    uniform sampler2D uAtlasMap; 
    uniform vec3 uLeadColor;
    uniform vec3 uTrailColor;
    uniform vec3 uMouse;
    uniform float uMouseRadius;
    varying vec2 vAtlasUv; 
    varying float vOpacity;
    varying float vFadeFactor;
    varying vec3 vWorldPos;
    void main() { 
      vec4 texColor = texture2D(uAtlasMap, vAtlasUv); 
      if (texColor.a < 0.05) discard; 
      
      // Branchless lead/trail color selection
      float isLead = step(0.98, vFadeFactor);
      vec3 baseColor = mix(uTrailColor * vFadeFactor, uLeadColor, isLead);

      // Mouse proximity glow (Cyber-Ripple)
      float mouseDist = length(vWorldPos - uMouse);
      float mouseGlow = smoothstep(uMouseRadius, 0.0, mouseDist);
      vec3 glowColor = mix(baseColor, uLeadColor * 1.5, mouseGlow * 0.6);

      gl_FragColor = vec4(glowColor * texColor.rgb, texColor.a * vOpacity); 
    }
  `
);

// ─────────────────────────────────────────────────
// Splash Particle Shader – Impact particles
// ─────────────────────────────────────────────────
export const SplashParticleShaderMaterial = shaderMaterial(
  {
    uAtlasMap: new THREE.Texture(),
    uSplashColor: new THREE.Color(),
  },
  // Vertex shader
  ` 
    precision highp float; 
    attribute vec4 instanceOffset; 
    attribute vec4 instanceColorOpacity; 
    varying vec2 vAtlasUv; 
    varying float vOpacity;
    void main() { 
      vAtlasUv = uv * instanceOffset.zw + instanceOffset.xy; 
      vOpacity = instanceColorOpacity.a;
      gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); 
    }
  `,
  // Fragment shader
  ` 
    precision mediump float; 
    uniform sampler2D uAtlasMap; 
    uniform vec3 uSplashColor;
    varying vec2 vAtlasUv; 
    varying float vOpacity;
    void main() { 
      vec4 texColor = texture2D(uAtlasMap, vAtlasUv); 
      if (texColor.a < 0.01) discard; 
      gl_FragColor = vec4(uSplashColor * texColor.rgb, texColor.a * vOpacity); 
    }
  `
);
