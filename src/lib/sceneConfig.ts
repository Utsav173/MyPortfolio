import * as THREE from "three";

export const defaultSceneConfig = {
  plane: {
    size: 256,
    visualSegments: 128,
    collisionSegments: 32,
    timeFactor: 0.2,
    hillDarkColorHex: "#1e294d",
    hillLightColorHex: "#81a6e6",
    noiseStrength: {
      hill1: 15,
      hill2: 11.3,
      hill3: 3.2,
      overall: 46.5,
    },
    opacityFactorDark: 0.87,
    opacityFactorLight: 0.87,
  },
  rain: {
    charHeight: 1.35,
    charAspect: 0.56,
    streamCountMobile: 40,
    streamCountDesktop: 110,
    streamLengthMobile: 6,
    streamLengthDesktop: 10,
    yTop: 89,
    yBottom: -30,
    speedBaseMin: 6,
    speedBaseMax: 29,
    leadColorDarkHex: "#a2d9ff",
    trailColorBaseDarkHex: "#0089de",
    leadColorLightHex: "#4A70B0",
    trailColorBaseLightHex: "#7996C7",
    splashColorHex: "#82acff",
    bloomIntensity: {
      lead: 2.9,
      trail: 3.7,
      splash: 4.7,
    },
  },
  splashParticles: {
    enabled: true,
    maxParticles: 2000,
    particlesPerSplash: 8,
    size: 0.28,
    speedMin: 2,
    speedMax: 6,
    lift: 4.6,
    gravity: 9.8,
    lifespan: 0.8,
  },
  camera: {
    fov: 30,
    near: 5,
    far: 1000,
    initialXPos: 0,
    initialYPos: 35,
    initialZPos: 130,
    initialLookAtX: 0,
    initialLookAtY: 10,
    initialLookAtZ: 0,
  },
  themeColors: {
    darkBgHex: "#05050c",
    lightBgHex: "#E6EFFF",
  },
  effects: {
    bloom: {
      enabled: true,
      luminanceThreshold: 0.32,
      luminanceSmoothing: 1,
      intensity: 1.35,
      kernelSize: "LARGE",
      mipmapBlur: true,
    },
    fog: {
      enabled: true,
      densityDarkTheme: 0.01,
      densityLightTheme: 0.012,
    },
  },
} as const;

export type SceneConfig = typeof defaultSceneConfig;

export type ParsedPlaneConfig = Omit<
  SceneConfig["plane"],
  "hillDarkColorHex" | "hillLightColorHex"
> & {
  planeColorForDarkTheme: THREE.Color;
  planeColorForLightTheme: THREE.Color;
};

export type ParsedRainConfig = Omit<
  SceneConfig["rain"],
  | "leadColorDarkHex"
  | "trailColorBaseDarkHex"
  | "leadColorLightHex"
  | "trailColorBaseLightHex"
  | "splashColorHex"
> & {
  leadColorDark: THREE.Color;
  trailColorBaseDark: THREE.Color;
  leadColorLight: THREE.Color;
  trailColorBaseLight: THREE.Color;
};

export type ParsedThemeColorsConfig = Omit<
  SceneConfig["themeColors"],
  "darkBgHex" | "lightBgHex"
> & {
  darkBg: THREE.Color;
  lightBg: THREE.Color;
};

export type ParsedSplashParticlesConfig = SceneConfig["splashParticles"] & {
  splashColor: THREE.Color;
};

export interface ParsedSceneConfig {
  plane: ParsedPlaneConfig;
  rain: ParsedRainConfig;
  camera: SceneConfig["camera"];
  themeColors: ParsedThemeColorsConfig;
  effects: SceneConfig["effects"];
  splashParticles: ParsedSplashParticlesConfig;
}

export function parseConfigColors(
  configParam?: Partial<SceneConfig>
): ParsedSceneConfig {
  const config = { ...defaultSceneConfig, ...configParam };

  return {
    plane: {
      ...config.plane,
      planeColorForDarkTheme: new THREE.Color(config.plane.hillDarkColorHex),
      planeColorForLightTheme: new THREE.Color(config.plane.hillLightColorHex),
    },
    rain: {
      ...config.rain,
      leadColorDark: new THREE.Color(config.rain.leadColorDarkHex),
      trailColorBaseDark: new THREE.Color(config.rain.trailColorBaseDarkHex),
      leadColorLight: new THREE.Color(config.rain.leadColorLightHex),
      trailColorBaseLight: new THREE.Color(config.rain.trailColorBaseLightHex),
    },
    camera: config.camera,
    themeColors: {
      ...config.themeColors,
      darkBg: new THREE.Color(config.themeColors.darkBgHex),
      lightBg: new THREE.Color(config.themeColors.lightBgHex),
    },
    effects: config.effects,
    splashParticles: {
      ...config.splashParticles,
      splashColor: new THREE.Color(config.rain.splashColorHex),
    },
  };
}
