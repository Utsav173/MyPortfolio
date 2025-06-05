"use client";

import { Suspense, useEffect, useMemo, useRef, memo, useCallback } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  extend,
  ReactThreeFiber,
} from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";
import { cn } from "@/lib/utils";
import {
  type ParsedSceneConfig,
  defaultSceneConfig,
  parseConfigColors,
} from "@/lib/sceneConfig";

const getKernelSize = (sizeStr?: string): KernelSize => {
  const upperCaseSize = (sizeStr || "LARGE").toUpperCase();
  return (
    (KernelSize[upperCaseSize as keyof typeof KernelSize] as KernelSize) ??
    KernelSize.LARGE
  );
};

const planeVertexShader = `
  varying vec3 vPosition;
  uniform float time;
  uniform float uNoiseStrengthHill1;
  uniform float uNoiseStrengthHill2;
  uniform float uNoiseStrengthHill3;
  uniform float uNoiseStrengthOverall;
  uniform float uPlaneSize;

  mat4 rotateMatrixX(float rad) {
    return mat4(1.0, 0.0, 0.0, 0.0,
                0.0, cos(rad), -sin(rad), 0.0,
                0.0, sin(rad), cos(rad), 0.0,
                0.0, 0.0, 0.0, 1.0);
  }

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = vec4(Pi0.z);
    vec4 iz1 = vec4(Pi1.z);
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  void main() {
    vec3 updatedPos = (rotateMatrixX(radians(90.0)) * vec4(position, 1.0)).xyz;
    float sinFactor = sin(radians(updatedPos.x / (uPlaneSize / 2.0) * 90.0));
    vec3 noisePos = updatedPos + vec3(0.0, 0.0, time * -18.0);
    float n1 = cnoise(noisePos * 0.065);
    float n2 = cnoise(noisePos * 0.045);
    float n3 = cnoise(noisePos * 0.28);
    vec3 lastPos = updatedPos + vec3(
      0.0,
      n1 * sinFactor * uNoiseStrengthHill1 +
      n2 * sinFactor * uNoiseStrengthHill2 +
      n3 * (abs(sinFactor) * 1.7 + 0.4) * uNoiseStrengthHill3 +
      pow(sinFactor, 2.0) * uNoiseStrengthOverall,
      0.0
    );
    vPosition = lastPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(lastPos, 1.0);
  }
`;

const planeFragmentShader = `
  varying vec3 vPosition;
  uniform float uThemeAdjust;
  uniform vec3 uPlaneColorDarkTheme;
  uniform vec3 uPlaneColorLightTheme;
  uniform float uPlaneSize;
  uniform float uOpacityFactorDark;
  uniform float uOpacityFactorLight;

  void main() {
    float opacityFactor = (110.0 - length(vPosition)) / uPlaneSize;
    float currentOpacityFactor = mix(uOpacityFactorDark, uOpacityFactorLight, uThemeAdjust);
    float baseOpacity = smoothstep(0.0, 0.9, opacityFactor) * currentOpacityFactor;
    vec3 color = mix(uPlaneColorDarkTheme, uPlaneColorLightTheme, uThemeAdjust);
    gl_FragColor = vec4(color, baseOpacity);
  }
`;

const particleVertexShader = `
  attribute vec4 instanceOffset;
  attribute vec4 instanceColorOpacity;
  varying vec2 vAtlasUv;
  varying vec4 vColorOpacity;
  void main() {
    vAtlasUv = uv * instanceOffset.zw + instanceOffset.xy;
    vColorOpacity = instanceColorOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const particleFragmentShader = `
  uniform sampler2D uAtlasMap;
  varying vec2 vAtlasUv;
  varying vec4 vColorOpacity;
  void main() {
    vec4 texColor = texture2D(uAtlasMap, vAtlasUv);
    if (texColor.a < 0.05) discard;
    gl_FragColor = vec4(vColorOpacity.rgb * texColor.rgb, texColor.a * vColorOpacity.a);
  }
`;

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
  planeVertexShader,
  planeFragmentShader
);
const ParticleShaderMaterial = shaderMaterial(
  { uAtlasMap: new THREE.Texture() },
  particleVertexShader,
  particleFragmentShader
);

extend({ PlaneShaderMaterial, ParticleShaderMaterial });

const GLYPH_CHARS =
  "0123456789ABCDEF!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン".split(
    ""
  );

const createCharacterAtlas = () => {
  const canvas = document.createElement("canvas");
  const textureSize = 64,
    charsPerRow = 10;
  const numRows = Math.ceil(GLYPH_CHARS.length / charsPerRow);
  canvas.width = charsPerRow * textureSize;
  canvas.height = numRows * textureSize;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2D context failed");
  context.fillStyle = "white";
  context.font = `bold ${textureSize * 0.75}px monospace`;
  context.textAlign = "center";
  context.textBaseline = "middle";

  const charUVMap = new Map<
    string,
    { u: number; v: number; w: number; h: number }
  >();
  const cellW = 1 / charsPerRow,
    cellH = 1 / numRows;

  GLYPH_CHARS.forEach((char, i) => {
    const x = i % charsPerRow,
      y = Math.floor(i / charsPerRow);
    context.fillText(
      char,
      x * textureSize + textureSize / 2,
      y * textureSize + textureSize / 2
    );
    charUVMap.set(char, {
      u: x * cellW,
      v: 1 - (y + 1) * cellH,
      w: cellW,
      h: cellH,
    });
  });

  const atlasTexture = new THREE.Texture(canvas);
  atlasTexture.needsUpdate = true;
  return { atlasTexture, charUVMap };
};

interface MatrixRainProps {
  currentTheme?: string;
  cameraControls: CameraControlsRef;
}
interface CameraControlsRef {
  xPos: number;
  yPos: number;
  zPos: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
}
interface SceneContentProps extends MatrixRainProps {
  parsedConfig: ParsedSceneConfig;
}

const SceneContent = memo(
  ({ currentTheme, cameraControls, parsedConfig }: SceneContentProps) => {
    const { camera, gl } = useThree();
    const atlasData = useMemo(createCharacterAtlas, []);

    useEffect(() => () => atlasData.atlasTexture.dispose(), [atlasData]);

    const { isDark, themeAdjust, backgroundColor } = useMemo(() => {
      const dark = currentTheme === "dark";
      return {
        isDark: dark,
        themeAdjust: dark ? 0 : 1,
        backgroundColor: dark
          ? parsedConfig.themeColors.darkBg
          : parsedConfig.themeColors.lightBg,
      };
    }, [currentTheme, parsedConfig.themeColors]);

    useEffect(() => {
      const pCam = camera as THREE.PerspectiveCamera;
      pCam.fov = parsedConfig.camera.fov;
      pCam.near = parsedConfig.camera.near;
      pCam.far = parsedConfig.camera.far;
      pCam.updateProjectionMatrix();
      gl.setClearColor(backgroundColor, 1.0);
    }, [camera, gl, parsedConfig.camera, backgroundColor]);

    useFrame(() => {
      camera.position.set(
        cameraControls.xPos,
        cameraControls.yPos,
        cameraControls.zPos
      );
      camera.lookAt(
        cameraControls.lookAtX,
        cameraControls.lookAtY,
        cameraControls.lookAtZ
      );
    });

    const fogDensity = isDark
      ? parsedConfig.effects.fog.densityDarkTheme
      : parsedConfig.effects.fog.densityLightTheme;

    return (
      <>
        {parsedConfig.effects.fog.enabled && (
          <fogExp2 attach="fog" args={[backgroundColor, fogDensity]} />
        )}
        <PlaneComponent
          themeAdjust={themeAdjust}
          planeConfig={parsedConfig.plane}
        />
        <RainSystem
          rainConfig={parsedConfig.rain}
          planeSize={parsedConfig.plane.size}
          atlasData={atlasData}
          themeAdjust={themeAdjust}
        />
      </>
    );
  }
);
SceneContent.displayName = "SceneContent";

const PlaneComponent = memo(
  ({
    themeAdjust,
    planeConfig,
  }: {
    themeAdjust: number;
    planeConfig: ParsedSceneConfig["plane"];
  }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);
    useFrame((_, delta) => {
      if (materialRef.current)
        materialRef.current.uniforms.time.value +=
          delta * planeConfig.timeFactor;
    });
    const materialProps = useMemo(
      () => ({
        uThemeAdjust: themeAdjust,
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
      [themeAdjust, planeConfig]
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
        />
      </mesh>
    );
  }
);
PlaneComponent.displayName = "PlaneComponent";

interface RainParticle {
  y: number;
  x: number;
  z: number;
  speedY: number;
  streamIndex: number;
  charMap: { u: number; v: number; w: number; h: number };
  color: THREE.Color;
  opacity: number;
}
const RainSystem = memo(
  ({
    rainConfig,
    planeSize,
    atlasData,
    themeAdjust,
  }: {
    rainConfig: ParsedSceneConfig["rain"];
    planeSize: number;
    atlasData: {
      atlasTexture: THREE.Texture;
      charUVMap: Map<string, { u: number; v: number; w: number; h: number }>;
    };
    themeAdjust: number;
  }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const particles = useRef<RainParticle[]>([]).current;
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const { width: screenWidth } = useThree((state) => state.size);

    const { count, length, xSpread, zSpread } = useMemo(() => {
      const isMobile = screenWidth < 768;
      return {
        count: isMobile
          ? rainConfig.streamCountMobile
          : rainConfig.streamCountDesktop,
        length: isMobile
          ? rainConfig.streamLengthMobile
          : rainConfig.streamLengthDesktop,
        xSpread: (planeSize / 2) * (isMobile ? 0.35 : 0.45),
        zSpread: (planeSize / 2) * (isMobile ? 0.25 : 0.35),
      };
    }, [screenWidth, rainConfig, planeSize]);

    const maxParticles = count * length;

    const { leadColor, trailColorBase } = useMemo(
      () => ({
        leadColor: (themeAdjust === 0
          ? rainConfig.leadColorDark
          : rainConfig.leadColorLight
        )
          .clone()
          .multiplyScalar(rainConfig.bloomIntensity.lead),
        trailColorBase: (themeAdjust === 0
          ? rainConfig.trailColorBaseDark
          : rainConfig.trailColorBaseLight
        )
          .clone()
          .multiplyScalar(rainConfig.bloomIntensity.trail),
      }),
      [themeAdjust, rainConfig]
    );

    const getTrailColor = useCallback(
      (idx: number) =>
        trailColorBase
          .clone()
          .multiplyScalar(Math.max(0.35, 1 - (idx / length) * 0.6)),
      [trailColorBase, length]
    );
    const getRandomCharMap = useCallback(
      () =>
        atlasData.charUVMap.get(
          GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)]
        )!,
      [atlasData.charUVMap]
    );

    useEffect(() => {
      if (!atlasData || !maxParticles || particles.length === maxParticles)
        return;
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        const sX = THREE.MathUtils.randFloatSpread(xSpread * 2);
        const sZ = THREE.MathUtils.randFloatSpread(zSpread * 2);
        const bS = THREE.MathUtils.randFloat(
          rainConfig.speedBaseMin,
          rainConfig.speedBaseMax
        );
        for (let j = 0; j < length; j++) {
          particles.push({
            x: sX,
            z: sZ,
            y:
              rainConfig.yTop -
              j * rainConfig.charHeight * 0.9 +
              Math.random() * 3,
            speedY: bS * (j === 0 ? 1 : THREE.MathUtils.randFloat(0.82, 0.95)),
            streamIndex: j,
            charMap: getRandomCharMap(),
            color: j === 0 ? leadColor : getTrailColor(j),
            opacity: j === 0 ? 0.99 : Math.max(0.15, 0.9 - (j / length) * 0.85),
          });
        }
      }
    }, [
      atlasData,
      count,
      length,
      xSpread,
      zSpread,
      rainConfig,
      leadColor,
      getTrailColor,
      getRandomCharMap,
      particles,
      maxParticles,
    ]);

    useFrame((_, delta) => {
      if (!meshRef.current || particles.length === 0) return;
      const dt = Math.min(delta, 0.05);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY * dt;
        if (p.y < rainConfig.yBottom) {
          p.y = rainConfig.yTop;
          if (p.streamIndex === 0) {
            const streamStartIndex = i - p.streamIndex;
            const newX = THREE.MathUtils.randFloatSpread(xSpread * 2);
            const newZ = THREE.MathUtils.randFloatSpread(zSpread * 2);
            for (let j = 0; j < length; j++) {
              if (particles[streamStartIndex + j]) {
                particles[streamStartIndex + j].x = newX;
                particles[streamStartIndex + j].z = newZ;
              }
            }
          }
        }
        dummy.position.set(p.x, p.y, p.z);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, maxParticles]}
        frustumCulled={false}
      >
        <planeGeometry
          args={[
            rainConfig.charHeight * rainConfig.charAspect,
            rainConfig.charHeight,
          ]}
        />
        {/* @ts-ignore */}
        <particleShaderMaterial
          uAtlasMap={atlasData.atlasTexture}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    );
  }
);
RainSystem.displayName = "RainSystem";

const MatrixRain = ({ currentTheme, cameraControls }: MatrixRainProps) => {
  const parsedConfig = useMemo(() => parseConfigColors(defaultSceneConfig), []);
  const bloomConfig = parsedConfig.effects.bloom;

  return (
    <div className={cn("absolute inset-0 w-full h-full pointer-events-none")}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 35, 130], fov: 30, near: 5, far: 1000 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
          dpr={
            typeof window !== "undefined"
              ? Math.min(window.devicePixelRatio, 1.5)
              : 1
          }
          style={{ background: "transparent" }}
          frameloop="always"
          shadows={false}
        >
          <PerformanceMonitor
            onDecline={() => console.warn("Performance declined.")}
          />
          {bloomConfig.enabled ? (
            <EffectComposer>
              <Bloom
                luminanceThreshold={bloomConfig.luminanceThreshold}
                luminanceSmoothing={bloomConfig.luminanceSmoothing}
                intensity={bloomConfig.intensity}
                kernelSize={getKernelSize(bloomConfig.kernelSize)}
                mipmapBlur={bloomConfig.mipmapBlur}
              />
              <SceneContent
                currentTheme={currentTheme}
                cameraControls={cameraControls}
                parsedConfig={parsedConfig}
              />
            </EffectComposer>
          ) : (
            <SceneContent
              currentTheme={currentTheme}
              cameraControls={cameraControls}
              parsedConfig={parsedConfig}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  );
};
export default memo(MatrixRain);
