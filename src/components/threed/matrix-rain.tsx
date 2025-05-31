"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import {
  SceneConfig,
  defaultSceneConfig as importedDefaultConfig,
  parseConfigColors,
  ParsedSceneConfig,
  ParsedPlaneConfig,
  ParsedRainConfig,
} from "@/lib/sceneConfig";
import { cn } from "@/lib/utils";

interface CameraControls {
  xPos: number;
  yPos: number;
  zPos: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}

interface ThreeSceneProps {
  currentTheme: string | undefined;
  cameraControls: CameraControls;
  dynamicConfig?: SceneConfig;
  className?: string;
}

const PROGRAMMATIC_CHARS_STR =
  "0123456789ABCDEF!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~";

const SANSKRIT_CHARS_STR = "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह";

const GLYPH_CHARS = (PROGRAMMATIC_CHARS_STR + SANSKRIT_CHARS_STR).split("");

const CHARS_PER_ROW = 10;
const NUM_ROWS = Math.ceil(GLYPH_CHARS.length / CHARS_PER_ROW);
const CHAR_TEXTURE_SIZE = 64;
const DEFAULT_CHAR_MAP = { u: 0, v: 0, w: 1 / CHARS_PER_ROW, h: 1 / NUM_ROWS };
let SPLASH_CHAR_MAP = DEFAULT_CHAR_MAP;

function createCharacterAtlas(): {
  atlasTexture: THREE.Texture;
  charUVMap: Map<string, { u: number; v: number; w: number; h: number }>;
} {
  const atlasCanvas = document.createElement("canvas");
  atlasCanvas.width = CHARS_PER_ROW * CHAR_TEXTURE_SIZE;
  atlasCanvas.height = NUM_ROWS * CHAR_TEXTURE_SIZE;
  const context = atlasCanvas.getContext("2d");
  if (!context) throw new Error("Cannot get 2D context for atlas");

  context.fillStyle = "white";
  context.font = `bold ${CHAR_TEXTURE_SIZE * 0.75}px monospace`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  const charUVMap = new Map<
    string,
    { u: number; v: number; w: number; h: number }
  >();
  const cellWidthUV = 1 / CHARS_PER_ROW;
  const cellHeightUV = 1 / NUM_ROWS;

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
    const firstCharMap = charUVMap.get(GLYPH_CHARS[0]);
    if (firstCharMap) {
      DEFAULT_CHAR_MAP.u = firstCharMap.u;
      DEFAULT_CHAR_MAP.v = firstCharMap.v;
      DEFAULT_CHAR_MAP.w = firstCharMap.w;
      DEFAULT_CHAR_MAP.h = firstCharMap.h;
    }
    SPLASH_CHAR_MAP =
      charUVMap.get("・") ||
      charUVMap.get(".") ||
      charUVMap.get("o") ||
      DEFAULT_CHAR_MAP;
  }

  const atlasTexture = new THREE.Texture(atlasCanvas);
  atlasTexture.flipY = false;
  atlasTexture.needsUpdate = true;
  atlasTexture.minFilter = THREE.LinearFilter;
  atlasTexture.magFilter = THREE.LinearFilter;
  return { atlasTexture, charUVMap };
}

class Plane {
  uniforms: {
    time: { type: string; value: number };
    uThemeAdjust: { value: number };
    uHillDarkColor: { value: THREE.Color };
    uHillLightColor: { value: THREE.Color };
  };
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.RawShaderMaterial>;
  collisionMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  timeFactor: number;
  planeSize: number;
  config: ParsedPlaneConfig;

  constructor(
    scene: THREE.Scene,
    initialThemeAdjust: number,
    config: ParsedPlaneConfig
  ) {
    this.config = config;
    this.planeSize = this.config.size;

    this.uniforms = {
      time: { type: "f", value: 0 },
      uThemeAdjust: { value: initialThemeAdjust },
      uHillDarkColor: { value: this.config.hillDarkColor.clone() },
      uHillLightColor: { value: this.config.hillLightColor.clone() },
    };
    this.timeFactor = this.config.timeFactor;

    const geometry = new THREE.PlaneGeometry(
      this.planeSize,
      this.planeSize,
      this.config.visualSegments,
      this.config.visualSegments
    );
    const collisionGeometry = new THREE.PlaneGeometry(
      this.planeSize,
      this.planeSize,
      this.config.collisionSegments,
      this.config.collisionSegments
    );

    const vertexShader = `#define GLSLIFY 1
attribute vec3 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
varying vec3 vPosition;
mat4 rotateMatrixX(float radian) { return mat4(1.,0.,0.,0.,0.,cos(radian),-sin(radian),0.,0.,sin(radian),cos(radian),0.,0.,0.,0.,1.);}
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}
float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod289(Pi0);Pi1=mod289(Pi1);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0*(1./7.);vec4 gy0=fract(floor(gx0)*(1./7.))-.5;gx0=fract(gx0);vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1*(1./7.);vec4 gy1=fract(floor(gx1)*(1./7.))-.5;gx1=fract(gx1);vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}
void main(void){vec3 updatePosition=(rotateMatrixX(radians(90.))*vec4(position,1.)).xyz;float sin1=sin(radians(updatePosition.x/128.*90.));vec3 noisePosition=updatePosition+vec3(0.,0.,time*-18.);float noise1=cnoise(noisePosition*.065);float noise2=cnoise(noisePosition*.045);float noise3=cnoise(noisePosition*.28);vec3 lastPosition=updatePosition+vec3(0.,noise1*sin1*${this.config.noiseStrength.hill1.toFixed(
      1
    )}+noise2*sin1*${this.config.noiseStrength.hill2.toFixed(
      1
    )}+noise3*(abs(sin1)*1.7+.4)+pow(sin1,2.)*${this.config.noiseStrength.overall.toFixed(
      1
    )},0.);vPosition=lastPosition;gl_Position=projectionMatrix*modelViewMatrix*vec4(lastPosition,1.);}`;

    const fragmentShader = `
            precision highp float;
            varying vec3 vPosition;
            uniform float uThemeAdjust; 
            uniform vec3 uHillDarkColor;
            uniform vec3 uHillLightColor;
            void main(void) {
              float opacityFactor = (110.0 - length(vPosition)) / ${this.planeSize.toFixed(
                1
              )}; 
              float opacityDark = smoothstep(0.0, 0.9, opacityFactor) * ${this.config.opacityFactorDark.toFixed(
                2
              )};
              float opacityLight = smoothstep(0.0, 0.9, opacityFactor) * ${this.config.opacityFactorLight.toFixed(
                2
              )};
              float baseOpacity = mix(opacityDark, opacityLight, uThemeAdjust);
              vec3 color = mix(uHillDarkColor, uHillLightColor, uThemeAdjust);
              gl_FragColor = vec4(color, baseOpacity);
            }`;

    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);

    const collisionMaterial = new THREE.MeshBasicMaterial({ visible: false });
    this.collisionMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
    this.collisionMesh.rotation.x = -Math.PI / 2;
    this.updateCollisionMeshVertices();
    scene.add(this.collisionMesh);
  }

  private static _floor_vec3(v: THREE.Vector3): THREE.Vector3 {
    return v.clone().floor();
  }
  private static _fract_vec3(v: THREE.Vector3): THREE.Vector3 {
    return v.clone().sub(this._floor_vec3(v.clone()));
  }
  private static _floor_vec4(v: THREE.Vector4): THREE.Vector4 {
    return v.clone().floor();
  }
  private static _fract_vec4(v: THREE.Vector4): THREE.Vector4 {
    return v.clone().sub(this._floor_vec4(v.clone()));
  }

  private static _mod289_vec3(x: THREE.Vector3): THREE.Vector3 {
    return x
      .clone()
      .sub(
        this._floor_vec3(x.clone().multiplyScalar(1.0 / 289.0)).multiplyScalar(
          289.0
        )
      );
  }
  private static _mod289_vec4(x: THREE.Vector4): THREE.Vector4 {
    const floorVal = this._floor_vec4(x.clone().multiplyScalar(1.0 / 289.0));
    return x.clone().sub(floorVal.multiplyScalar(289.0));
  }

  private static _permute_vec4(x: THREE.Vector4): THREE.Vector4 {
    return this._mod289_vec4(
      x.clone().multiplyScalar(34.0).addScalar(1.0).multiply(x)
    );
  }

  private static _taylorInvSqrt_vec4(r: THREE.Vector4): THREE.Vector4 {
    return new THREE.Vector4(
      1.79284291400159 - 0.85373472095314 * r.x,
      1.79284291400159 - 0.85373472095314 * r.y,
      1.79284291400159 - 0.85373472095314 * r.z,
      1.79284291400159 - 0.85373472095314 * r.w
    );
  }

  private static _fade_vec3(t: THREE.Vector3): THREE.Vector3 {
    const t_c = t.clone();
    const t_6_15 = t_c.clone().multiplyScalar(6.0).subScalar(15.0);
    const t_mul_t_6_15 = t_c.clone().multiply(t_6_15);
    const inner = t_mul_t_6_15.addScalar(10.0);
    return t_c.clone().multiply(t_c).multiply(t_c).multiply(inner);
  }

  private static _abs_vec4(v: THREE.Vector4): THREE.Vector4 {
    return new THREE.Vector4(
      Math.abs(v.x),
      Math.abs(v.y),
      Math.abs(v.z),
      Math.abs(v.w)
    );
  }

  private static _step_s_v4(edge: number, x: THREE.Vector4): THREE.Vector4 {
    return new THREE.Vector4(
      x.x < edge ? 0.0 : 1.0,
      x.y < edge ? 0.0 : 1.0,
      x.z < edge ? 0.0 : 1.0,
      x.w < edge ? 0.0 : 1.0
    );
  }

  private static _cnoise(P: THREE.Vector3): number {
    const Pi0 = this._floor_vec3(P);
    const Pi1 = Pi0.clone().addScalar(1.0);

    const Pi0_mod = this._mod289_vec3(Pi0);
    const Pi1_mod = this._mod289_vec3(Pi1);

    const Pf0 = this._fract_vec3(P);
    const Pf1 = Pf0.clone().subScalar(1.0);

    const ix = new THREE.Vector4(Pi0_mod.x, Pi1_mod.x, Pi0_mod.x, Pi1_mod.x);
    const iy = new THREE.Vector4(Pi0_mod.y, Pi0_mod.y, Pi1_mod.y, Pi1_mod.y);
    const iz0 = new THREE.Vector4(Pi0_mod.z, Pi0_mod.z, Pi0_mod.z, Pi0_mod.z);
    const iz1 = new THREE.Vector4(Pi1_mod.z, Pi1_mod.z, Pi1_mod.z, Pi1_mod.z);

    const ixy = this._permute_vec4(this._permute_vec4(ix).add(iy));
    const ixy0 = this._permute_vec4(ixy.clone().add(iz0));
    const ixy1 = this._permute_vec4(ixy.clone().add(iz1));

    let gx0 = ixy0.clone().multiplyScalar(1.0 / 7.0);
    let gy0 = this._fract_vec4(
      this._floor_vec4(gx0.clone()).multiplyScalar(1.0 / 7.0)
    ).subScalar(0.5);
    gx0 = this._fract_vec4(gx0);
    const gz0 = new THREE.Vector4(0.5, 0.5, 0.5, 0.5)
      .sub(this._abs_vec4(gx0))
      .sub(this._abs_vec4(gy0));
    const sz0 = this._step_s_v4(0.0, gz0);

    gx0.sub(sz0.clone().multiply(this._step_s_v4(0.0, gx0).subScalar(0.5)));
    gy0.sub(sz0.clone().multiply(this._step_s_v4(0.0, gy0).subScalar(0.5)));

    let gx1 = ixy1.clone().multiplyScalar(1.0 / 7.0);
    let gy1 = this._fract_vec4(
      this._floor_vec4(gx1.clone()).multiplyScalar(1.0 / 7.0)
    ).subScalar(0.5);
    gx1 = this._fract_vec4(gx1);
    const gz1 = new THREE.Vector4(0.5, 0.5, 0.5, 0.5)
      .sub(this._abs_vec4(gx1))
      .sub(this._abs_vec4(gy1));
    const sz1 = this._step_s_v4(0.0, gz1);

    gx1.sub(sz1.clone().multiply(this._step_s_v4(0.0, gx1).subScalar(0.5)));
    gy1.sub(sz1.clone().multiply(this._step_s_v4(0.0, gy1).subScalar(0.5)));

    const g000 = new THREE.Vector3(gx0.x, gy0.x, gz0.x);
    const g100 = new THREE.Vector3(gx0.y, gy0.y, gz0.y);
    const g010 = new THREE.Vector3(gx0.z, gy0.z, gz0.z);
    const g110 = new THREE.Vector3(gx0.w, gy0.w, gz0.w);
    const g001 = new THREE.Vector3(gx1.x, gy1.x, gz1.x);
    const g101 = new THREE.Vector3(gx1.y, gy1.y, gz1.y);
    const g011 = new THREE.Vector3(gx1.z, gy1.z, gz1.z);
    const g111 = new THREE.Vector3(gx1.w, gy1.w, gz1.w);

    const norm0 = this._taylorInvSqrt_vec4(
      new THREE.Vector4(
        g000.dot(g000),
        g010.dot(g010),
        g100.dot(g100),
        g110.dot(g110)
      )
    );
    g000.multiplyScalar(norm0.x);
    g010.multiplyScalar(norm0.y);
    g100.multiplyScalar(norm0.z);
    g110.multiplyScalar(norm0.w);

    const norm1 = this._taylorInvSqrt_vec4(
      new THREE.Vector4(
        g001.dot(g001),
        g011.dot(g011),
        g101.dot(g101),
        g111.dot(g111)
      )
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

    const fade_xyz = this._fade_vec3(Pf0);

    const n_z_vec4 = new THREE.Vector4(n000, n100, n010, n110);
    const n_z1_vec4 = new THREE.Vector4(n001, n101, n011, n111);
    const n_z = n_z_vec4.lerp(n_z1_vec4, fade_xyz.z);

    const n_yz_x = THREE.MathUtils.lerp(n_z.x, n_z.z, fade_xyz.y);
    const n_yz_y = THREE.MathUtils.lerp(n_z.y, n_z.w, fade_xyz.y);

    const n_xyz = THREE.MathUtils.lerp(n_yz_x, n_yz_y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  setTheme(
    themeAdjust: number,
    newHillDarkColor: THREE.Color,
    newHillLightColor: THREE.Color
  ) {
    this.uniforms.uThemeAdjust.value = themeAdjust;
    this.uniforms.uHillDarkColor.value = newHillDarkColor;
    this.uniforms.uHillLightColor.value = newHillLightColor;
  }

  updateCollisionMeshVertices() {
    const positions = this.collisionMesh.geometry.attributes
      .position as THREE.BufferAttribute;
    const timeVal = this.uniforms.time.value;

    for (let i = 0; i < positions.count; i++) {
      const shader_plane_x = positions.getX(i);
      const shader_plane_y_for_noise = -positions.getY(i);

      const noiseArgX = shader_plane_x;
      const noiseArgY = 0.0;
      const noiseArgZ = shader_plane_y_for_noise + timeVal * -18.0;

      const sinWave = Math.sin(
        THREE.MathUtils.degToRad((noiseArgX / (this.planeSize / 2)) * 90.0)
      );

      const noiseVecInput = new THREE.Vector3(noiseArgX, noiseArgY, noiseArgZ);
      const noise1 = Plane._cnoise(noiseVecInput.clone().multiplyScalar(0.065));
      const noise2 = Plane._cnoise(noiseVecInput.clone().multiplyScalar(0.045));
      const noise3 = Plane._cnoise(noiseVecInput.clone().multiplyScalar(0.28));

      let displacement = 0;
      displacement += noise1 * sinWave * this.config.noiseStrength.hill1;
      displacement += noise2 * sinWave * this.config.noiseStrength.hill2;
      displacement += noise3 * (Math.abs(sinWave) * 1.7 + 0.4);
      displacement +=
        Math.pow(sinWave, 2.0) * this.config.noiseStrength.overall;

      positions.setZ(i, displacement);
    }
    positions.needsUpdate = true;
    this.collisionMesh.geometry.computeBoundingSphere();
  }

  render(deltaTime: number) {
    this.uniforms.time.value += deltaTime * this.timeFactor;
    if (deltaTime > 0.001 && deltaTime < 0.1) {
      this.updateCollisionMeshVertices();
    }
  }

  dispose() {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.collisionMesh.geometry.dispose();
    (this.collisionMesh.material as THREE.Material).dispose();
    this.mesh.removeFromParent();
    this.collisionMesh.removeFromParent();
  }
}

type RainParticle = {
  id: number;
  x: number;
  y: number;
  z: number;
  speedY: number;
  streamIndex: number;
  charMap: { u: number; v: number; w: number; h: number };
  color: THREE.Color;
  opacity: number;
  needsReset: boolean;
  currentStreamId: number;
  isSplashing: boolean;
  splashTimer: number;
  scale: number;
};

class RainEffect {
  private scene: THREE.Scene;
  private instancedMesh!: THREE.InstancedMesh;
  private particles: RainParticle[] = [];
  private charUVMap: Map<
    string,
    { u: number; v: number; w: number; h: number }
  >;
  private atlasTexture: THREE.Texture;

  private maxParticles: number;
  private areaWidth: number;
  private areaDepth: number;
  private yTop: number;
  private yBottom: number;
  private streamLength: number;
  private streamCount: number;

  private currentLeadColor: THREE.Color;
  private currentTrailColorBase: THREE.Color;
  private currentSplashColor: THREE.Color;

  private dummy = new THREE.Object3D();
  private raycaster: THREE.Raycaster;
  private collisionPlane: THREE.Mesh;
  private themeAdjust: number;
  private nextStreamId = 0;
  private config: ParsedRainConfig;

  private instanceOffsetAttribute!: THREE.InstancedBufferAttribute;
  private instanceColorOpacityAttribute!: THREE.InstancedBufferAttribute;

  constructor(
    scene: THREE.Scene,
    streamCount: number,
    streamLength: number,
    areaWidth: number,
    areaDepth: number,
    yTop: number,
    yBottom: number,
    atlasData: {
      atlasTexture: THREE.Texture;
      charUVMap: Map<string, { u: number; v: number; w: number; h: number }>;
    },
    collisionPlane: THREE.Mesh,
    initialThemeAdjust: number,
    config: ParsedRainConfig
  ) {
    this.scene = scene;
    this.config = config;
    this.streamCount = streamCount;
    this.streamLength = streamLength;
    this.maxParticles = this.streamCount * this.streamLength;
    this.areaWidth = areaWidth;
    this.areaDepth = areaDepth;
    this.yTop = yTop;
    this.yBottom = yBottom;
    this.atlasTexture = atlasData.atlasTexture;
    this.charUVMap = atlasData.charUVMap;
    this.collisionPlane = collisionPlane;
    this.themeAdjust = initialThemeAdjust;

    this.currentLeadColor =
      this.themeAdjust === 0
        ? this.config.leadColorDark.clone()
        : this.config.leadColorLight.clone();
    this.currentTrailColorBase =
      this.themeAdjust === 0
        ? this.config.trailColorBaseDark.clone()
        : this.config.trailColorBaseLight.clone();
    this.currentSplashColor = this.config.splashColor.clone();

    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = (yTop - yBottom) * 1.5;

    this.initInstancedMesh();
    this.initParticles();
  }

  setTheme(themeAdjust: number) {
    this.themeAdjust = themeAdjust;
    this.currentLeadColor =
      this.themeAdjust === 0
        ? this.config.leadColorDark.clone()
        : this.config.leadColorLight.clone();
    this.currentTrailColorBase =
      this.themeAdjust === 0
        ? this.config.trailColorBaseDark.clone()
        : this.config.trailColorBaseLight.clone();
    this.currentSplashColor = this.config.splashColor.clone();

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.isSplashing) {
        const isLead = p.streamIndex === 0;
        p.color = isLead
          ? this.currentLeadColor.clone()
          : this.getTrailColor(p.streamIndex, this.streamLength);
        if (this.instanceColorOpacityAttribute) {
          this.instanceColorOpacityAttribute.setXYZ(
            i,
            p.color.r,
            p.color.g,
            p.color.b
          );
        }
      }
    }
    if (this.instanceColorOpacityAttribute)
      this.instanceColorOpacityAttribute.needsUpdate = true;
  }

  private initInstancedMesh() {
    const geometry = new THREE.PlaneGeometry(
      this.config.charHeight * this.config.charAspect,
      this.config.charHeight
    );
    const material = new THREE.ShaderMaterial({
      uniforms: { uAtlasMap: { value: this.atlasTexture } },
      vertexShader: `precision highp float; attribute vec4 instanceOffset; attribute vec4 instanceColorOpacity; varying vec2 vAtlasUv; varying vec4 vColorOpacity; void main() { vAtlasUv = uv * instanceOffset.zw + instanceOffset.xy; vColorOpacity = instanceColorOpacity; vec4 worldPosition = instanceMatrix * vec4(position, 1.0); vec4 viewPosition = modelViewMatrix * worldPosition; gl_Position = projectionMatrix * viewPosition; }`,
      fragmentShader: `precision highp float; uniform sampler2D uAtlasMap; varying vec2 vAtlasUv; varying vec4 vColorOpacity; void main() { vec4 texColor = texture2D(uAtlasMap, vAtlasUv); if (texColor.a < 0.05) discard; gl_FragColor = vec4(vColorOpacity.rgb * texColor.rgb, texColor.a * vColorOpacity.a); }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.maxParticles
    );
    this.scene.add(this.instancedMesh);

    const offsets = new Float32Array(this.maxParticles * 4);
    const colorsOpacities = new Float32Array(this.maxParticles * 4);
    this.instanceOffsetAttribute = new THREE.InstancedBufferAttribute(
      offsets,
      4
    );
    this.instanceColorOpacityAttribute = new THREE.InstancedBufferAttribute(
      colorsOpacities,
      4
    );
    this.instancedMesh.geometry.setAttribute(
      "instanceOffset",
      this.instanceOffsetAttribute
    );
    this.instancedMesh.geometry.setAttribute(
      "instanceColorOpacity",
      this.instanceColorOpacityAttribute
    );
  }

  private initParticles() {
    for (let i = 0; i < this.streamCount; i++) {
      const streamX = Math.random() * this.areaWidth - this.areaWidth / 2;
      const streamZ = Math.random() * this.areaDepth - this.areaDepth / 2;
      const baseSpeed =
        this.config.speedBaseMin +
        Math.random() * (this.config.speedBaseMax - this.config.speedBaseMin);
      const currentStreamId = this.nextStreamId++;

      for (let j = 0; j < this.streamLength; j++) {
        const particleIndex = i * this.streamLength + j;
        const isLead = j === 0;
        this.particles[particleIndex] = {
          id: particleIndex,
          x: streamX,
          y: this.yTop - j * this.config.charHeight * 0.9 + Math.random() * 3,
          z: streamZ,
          speedY: baseSpeed * (isLead ? 1.0 : 0.82 + Math.random() * 0.13),
          streamIndex: j,
          charMap: this.getRandomCharMap(),
          color: isLead
            ? this.currentLeadColor.clone()
            : this.getTrailColor(j, this.streamLength),
          opacity: isLead
            ? 0.99
            : Math.max(0.15, 0.9 - (j / this.streamLength) * 0.85),
          needsReset: false,
          currentStreamId: currentStreamId,
          isSplashing: false,
          splashTimer: 0,
          scale: 1.0,
        };
        this.updateInstanceData(particleIndex);
      }
    }
    if (this.instancedMesh.instanceMatrix)
      this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (this.instanceOffsetAttribute)
      this.instanceOffsetAttribute.needsUpdate = true;
    if (this.instanceColorOpacityAttribute)
      this.instanceColorOpacityAttribute.needsUpdate = true;
  }

  private getRandomCharMap() {
    const char = GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)];
    return this.charUVMap.get(char) || DEFAULT_CHAR_MAP;
  }

  private getTrailColor(
    indexInStream: number,
    streamLength: number
  ): THREE.Color {
    const factor = Math.max(0.35, 1.0 - (indexInStream / streamLength) * 0.6);
    return this.currentTrailColorBase.clone().multiplyScalar(factor);
  }

  private resetStream(streamIdToReset: number) {
    const newStreamX = Math.random() * this.areaWidth - this.areaWidth / 2;
    const newStreamZ = Math.random() * this.areaDepth - this.areaDepth / 2;
    const baseSpeed =
      this.config.speedBaseMin +
      Math.random() * (this.config.speedBaseMax - this.config.speedBaseMin);
    const newCurrentStreamId = this.nextStreamId++;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.currentStreamId === streamIdToReset) {
        const isLead = p.streamIndex === 0;
        p.x = newStreamX;
        p.y =
          this.yTop -
          p.streamIndex * this.config.charHeight * 0.9 +
          Math.random() * 3;
        p.z = newStreamZ;
        p.speedY = baseSpeed * (isLead ? 1.0 : 0.82 + Math.random() * 0.13);
        p.charMap = this.getRandomCharMap();
        p.color = isLead
          ? this.currentLeadColor.clone()
          : this.getTrailColor(p.streamIndex, this.streamLength);
        p.opacity = isLead
          ? 0.99
          : Math.max(0.15, 0.9 - (p.streamIndex / this.streamLength) * 0.85);
        p.needsReset = false;
        p.currentStreamId = newCurrentStreamId;
        p.isSplashing = false;
        p.splashTimer = 0;
        p.scale = 1.0;
        this.updateInstanceData(i);
      }
    }
  }

  private updateInstanceData(pIndex: number) {
    const p = this.particles[pIndex];
    this.dummy.position.set(p.x, p.y, p.z);
    this.dummy.scale.set(p.scale, p.scale, p.scale);
    this.dummy.updateMatrix();
    if (this.instancedMesh)
      this.instancedMesh.setMatrixAt(pIndex, this.dummy.matrix);
    if (this.instanceOffsetAttribute)
      this.instanceOffsetAttribute.setXYZW(
        pIndex,
        p.charMap.u,
        p.charMap.v,
        p.charMap.w,
        p.charMap.h
      );
    if (this.instanceColorOpacityAttribute)
      this.instanceColorOpacityAttribute.setXYZW(
        pIndex,
        p.color.r,
        p.color.g,
        p.color.b,
        p.opacity
      );
  }

  update(deltaTime: number) {
    if (!this.instancedMesh || !this.collisionPlane) return;

    let needsMatrixUpdate = false;
    let needsOffsetUpdate = false;
    let needsColorOpacityUpdate = false;

    const collisionChecksThisFrame = Math.min(
      this.streamCount,
      Math.ceil(this.streamCount / 5)
    );
    let raycastCounter = 0;
    const streamsToReset = new Set<number>();

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (streamsToReset.has(p.currentStreamId) && !p.isSplashing) continue;

      if (p.isSplashing) {
        p.splashTimer -= deltaTime;
        p.opacity = Math.max(0.01, p.splashTimer / this.config.splashDuration);
        p.scale =
          1.0 +
          (this.config.splashScaleFactor - 1.0) *
            Math.sin(
              (1.0 - p.splashTimer / this.config.splashDuration) * Math.PI
            );
        p.color.copy(this.currentSplashColor);
        p.charMap = SPLASH_CHAR_MAP;

        if (p.splashTimer <= 0) {
          streamsToReset.add(p.currentStreamId);
          p.isSplashing = false;
          p.scale = 1.0;
        }

        this.updateInstanceData(i);
        needsMatrixUpdate = true;
        needsOffsetUpdate = true;
        needsColorOpacityUpdate = true;
        continue;
      }

      p.y -= p.speedY * deltaTime;

      this.dummy.position.set(p.x, p.y, p.z);
      this.dummy.scale.set(p.scale, p.scale, p.scale);
      this.dummy.updateMatrix();
      if (this.instancedMesh)
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      needsMatrixUpdate = true;

      if (p.streamIndex > 0 && Math.random() < 0.006) {
        p.charMap = this.getRandomCharMap();
        if (this.instanceOffsetAttribute) {
          this.instanceOffsetAttribute.setXYZW(
            i,
            p.charMap.u,
            p.charMap.v,
            p.charMap.w,
            p.charMap.h
          );
          needsOffsetUpdate = true;
        }
      }

      if (
        p.streamIndex === 0 &&
        p.y < this.yTop &&
        raycastCounter < collisionChecksThisFrame &&
        this.collisionPlane.geometry.boundingSphere
      ) {
        raycastCounter++;
        const rayOrigin = new THREE.Vector3(
          p.x,
          p.y + this.config.charHeight * 0.3,
          p.z
        );
        this.raycaster.set(rayOrigin, new THREE.Vector3(0, -1, 0));

        const intersects = this.raycaster.intersectObject(
          this.collisionPlane,
          false
        );

        if (intersects.length > 0) {
          const hitPoint = intersects[0].point;
          const hitY = hitPoint.y;
          const collisionThreshold = hitY + this.config.charHeight * 0.05;

          if (p.y <= collisionThreshold) {
            if (!p.isSplashing) {
              p.isSplashing = true;
              p.splashTimer = this.config.splashDuration;
              p.color.copy(this.currentSplashColor);
              p.opacity = 1.0;
              p.charMap = SPLASH_CHAR_MAP;
              p.scale = this.config.splashScaleFactor;

              this.updateInstanceData(i);
              needsOffsetUpdate = true;
              needsColorOpacityUpdate = true;
              needsMatrixUpdate = true;

              for (let k = 0; k < this.particles.length; k++) {
                if (
                  this.particles[k].currentStreamId === p.currentStreamId &&
                  this.particles[k].id !== p.id
                ) {
                  this.particles[k].opacity = 0;
                  if (this.instanceColorOpacityAttribute) {
                    this.instanceColorOpacityAttribute.setW(k, 0);
                  }
                }
              }
            }
          }
        }
      }

      if (p.y < this.yBottom && p.streamIndex === 0 && !p.isSplashing) {
        streamsToReset.add(p.currentStreamId);
      }
    }

    streamsToReset.forEach((streamId) => {
      this.resetStream(streamId);
      needsMatrixUpdate = true;
      needsOffsetUpdate = true;
      needsColorOpacityUpdate = true;
    });

    if (needsMatrixUpdate && this.instancedMesh.instanceMatrix)
      this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (needsOffsetUpdate && this.instanceOffsetAttribute)
      this.instanceOffsetAttribute.needsUpdate = true;
    if (needsColorOpacityUpdate && this.instanceColorOpacityAttribute)
      this.instanceColorOpacityAttribute.needsUpdate = true;
  }

  dispose() {
    if (this.instancedMesh) {
      this.instancedMesh.geometry.dispose();
      if (this.instancedMesh.material) {
        (this.instancedMesh.material as THREE.Material).dispose();
      }
      this.instancedMesh.removeFromParent();
    }
    this.particles = [];
  }
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  currentTheme,
  cameraControls,
  dynamicConfig,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const planeInstanceRef = useRef<Plane | null>(null);
  const rainEffectInstanceRef = useRef<RainEffect | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const atlasDataRef = useRef<{
    atlasTexture: THREE.Texture;
    charUVMap: Map<string, { u: number; v: number; w: number; h: number }>;
  } | null>(null);

  const activeConfig = useMemo(
    () => dynamicConfig || importedDefaultConfig,
    [dynamicConfig]
  );

  const parsedActiveConfig: ParsedSceneConfig = useMemo(
    () =>
      parseConfigColors(
        activeConfig,
        currentTheme === "dark" ? "dark" : "light"
      ),
    [activeConfig, currentTheme]
  );

  const themeConfig = useMemo(() => {
    const isDark = currentTheme === "dark";
    return {
      themeAdjust: isDark ? 0.0 : 1.0,
      bgColor: isDark
        ? parsedActiveConfig.themeColors.darkBg.clone()
        : parsedActiveConfig.themeColors.lightBg.clone(),
      overlayTextColor: isDark ? "text-gray-300" : "text-gray-800",
    };
  }, [currentTheme, parsedActiveConfig]);

  const handleResize = useCallback(() => {
    if (cameraRef.current && rendererRef.current && canvasRef.current) {
      const parentElement = canvasRef.current.parentElement || document.body;
      let { clientWidth, clientHeight } = parentElement;

      if (clientWidth === 0 || clientHeight === 0) {
        clientWidth = window.innerWidth;
        clientHeight = window.innerHeight;
      }
      if (clientWidth === 0 || clientHeight === 0) return;

      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      cameraRef.current.aspect = clientWidth / clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(clientWidth, clientHeight);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || typeof window === "undefined" || !currentTheme) {
      return;
    }
    const canvas = canvasRef.current;

    if (!atlasDataRef.current) {
      atlasDataRef.current = createCharacterAtlas();
    }
    const { atlasTexture, charUVMap } = atlasDataRef.current;

    const currentThemeAdjust = themeConfig.themeAdjust;
    const currentBgColor = themeConfig.bgColor;

    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      });
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      sceneRef.current = new THREE.Scene();
      cameraRef.current = new THREE.PerspectiveCamera(
        parsedActiveConfig.camera.fov,
        canvas.clientWidth / canvas.clientHeight,
        parsedActiveConfig.camera.near,
        parsedActiveConfig.camera.far
      );
      cameraRef.current.position.set(
        parsedActiveConfig.camera.initialXPos,
        parsedActiveConfig.camera.initialYPos,
        parsedActiveConfig.camera.initialZPos
      );
      cameraRef.current.lookAt(
        parsedActiveConfig.camera.initialLookAtX,
        parsedActiveConfig.camera.initialLookAtY,
        parsedActiveConfig.camera.initialLookAtZ
      );
      clockRef.current = new THREE.Clock();
    }

    rendererRef.current.setClearColor(currentBgColor, 1.0);
    canvasRef.current.style.backgroundColor = "transparent";

    if (planeInstanceRef.current) {
      planeInstanceRef.current.dispose();
    }
    planeInstanceRef.current = new Plane(
      sceneRef.current!,
      currentThemeAdjust,
      parsedActiveConfig.plane
    );

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const streamCount = isMobile
      ? parsedActiveConfig.rain.streamCountMobile
      : parsedActiveConfig.rain.streamCountDesktop;
    const streamLength = isMobile
      ? parsedActiveConfig.rain.streamLengthMobile
      : parsedActiveConfig.rain.streamLengthDesktop;

    const rainAreaWidth = planeInstanceRef.current.planeSize * 0.9;
    const rainAreaDepth = planeInstanceRef.current.planeSize * 0.55;

    if (rainEffectInstanceRef.current) {
      rainEffectInstanceRef.current.dispose();
    }
    rainEffectInstanceRef.current = new RainEffect(
      sceneRef.current!,
      streamCount,
      streamLength,
      rainAreaWidth,
      rainAreaDepth,
      parsedActiveConfig.rain.yTop,
      parsedActiveConfig.rain.yBottom,
      { atlasTexture, charUVMap },
      planeInstanceRef.current.collisionMesh,
      currentThemeAdjust,
      parsedActiveConfig.rain
    );

    handleResize();
    const listenerKey = "listenersInitializedThreeSceneFinalSplashV5";
    if (!window[listenerKey as any]) {
      window.addEventListener("resize", handleResize);
      (window as any)[listenerKey] = true;
    }

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      if (
        !clockRef.current ||
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current ||
        !planeInstanceRef.current ||
        !rainEffectInstanceRef.current
      ) {
        return;
      }

      const delta = Math.min(clockRef.current.getDelta(), 0.05);

      cameraRef.current.position.set(
        cameraControls.xPos,
        cameraControls.yPos,
        cameraControls.zPos
      );
      cameraRef.current.lookAt(
        cameraControls.lookAtX,
        cameraControls.lookAtY,
        cameraControls.lookAtZ
      );

      planeInstanceRef.current.render(delta);
      rainEffectInstanceRef.current.update(delta);

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [
    handleResize,
    currentTheme,
    cameraControls,
    parsedActiveConfig,
    themeConfig,
  ]);

  useEffect(() => {
    return () => {
      const listenerKey = "listenersInitializedThreeSceneFinalSplashV5";
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if ((window as any)[listenerKey]) {
        window.removeEventListener("resize", handleResize);
        (window as any)[listenerKey] = false;
      }

      rainEffectInstanceRef.current?.dispose();
      rainEffectInstanceRef.current = null;
      planeInstanceRef.current?.dispose();
      planeInstanceRef.current = null;

      if (atlasDataRef.current) {
        atlasDataRef.current.atlasTexture.dispose();
        atlasDataRef.current = null;
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (object.material) {
              const mat = object.material as THREE.Material | THREE.Material[];
              if (Array.isArray(mat)) {
                mat.forEach((m) => m.dispose());
              } else {
                mat.dispose();
              }
            }
          }
        });
      }
      rendererRef.current?.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      clockRef.current = null;
    };
  }, [handleResize]);

  return (
    <div
      className={cn(
        className,
        "fixed top-0 left-0 w-full h-full pointer-events-none"
      )}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

declare global {
  interface Window {
    listenersInitializedThreeSceneFinalSplashV5?: boolean;
  }
}

export default ThreeScene;
