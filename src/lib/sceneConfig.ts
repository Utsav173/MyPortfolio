import * as THREE from 'three';

export interface BloomConfig {
  enabled: boolean;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  intensity: number;
  kernelSize: string;
  mipmapBlur: boolean;
}

export const defaultSceneConfig = {
  plane: {
    size: 256,
    visualSegments: 64,
    collisionSegments: 24,
    timeFactor: 0.15,
    hillDarkColorHex: '#273161',
    hillLightColorHex: '#4A5568',
    noiseStrength: {
      hill1: 12,
      hill2: 9,
      hill3: 2.8,
      overall: 38,
    },
    opacityFactorDark: 0.85,
    opacityFactorLight: 0.88,
  },
  rain: {
    charHeight: 1.4,
    charAspect: 0.7,
    streamCountMobile: 25,
    streamCountDesktop: 60,
    streamCountDesktopLight: 50,
    streamLengthMobile: 5,
    streamLengthDesktop: 8,
    yTop: 85,
    yBottom: -25,
    speedBaseMin: 8,
    speedBaseMax: 32,

    leadColorDarkHex: '#a2d9ff',
    trailColorBaseDarkHex: '#0089de',
    leadColorLightHex: '#1E40AF',
    trailColorBaseLightHex: '#60A5FA',
    splashColorHex: '#82acff',
    splashColorLightHex: '#2563EB',

    bloomIntensity: {
      lead: 2.0,
      trail: 2.5,
      splash: 3.0,
    },
    bloomIntensityLight: {
      lead: 0.6,
      trail: 0.5,
      splash: 0.8,
    },
  },
  splashParticles: {
    enabled: true,
    maxParticles: 1000,
    particlesPerSplash: 5,
    size: 0.35,
    speedMin: 2,
    speedMax: 5,
    lift: 4,
    gravity: 9.8,
    lifespan: 0.6,
  },
  camera: {
    fov: 30,
    near: 5,
    far: 500,
    initialXPos: 0,
    initialYPos: 20,
    initialZPos: 130,
    initialLookAtX: 0,
    initialLookAtY: 10,
    initialLookAtZ: 0,
  },
  themeColors: {
    darkBgHex: '#05050c',
    lightBgHex: '#F0F5FF',
  },
  effects: {
    bloomDark: {
      enabled: true,
      luminanceThreshold: 0.5,
      luminanceSmoothing: 0.8,
      intensity: 2.0,
      kernelSize: 'MEDIUM',
      mipmapBlur: false,
    } as BloomConfig,
    bloomLight: {
      enabled: true,
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.3,
      intensity: 0.6,
      kernelSize: 'MEDIUM',
      mipmapBlur: false,
    } as BloomConfig,
    fog: {
      enabled: true,
      densityDarkTheme: 0.008,
      densityLightTheme: 0.009,
    },
  },
};

export type SceneConfig = typeof defaultSceneConfig;

export interface ParsedPlaneConfig
  extends Omit<SceneConfig['plane'], 'hillDarkColorHex' | 'hillLightColorHex'> {
  planeColorForDarkTheme: THREE.Color;
  planeColorForLightTheme: THREE.Color;
}

export interface ParsedRainConfig
  extends Omit<
    SceneConfig['rain'],
    | 'leadColorDarkHex'
    | 'trailColorBaseDarkHex'
    | 'leadColorLightHex'
    | 'trailColorBaseLightHex'
    | 'splashColorHex'
    | 'splashColorLightHex'
    | 'bloomIntensity'
    | 'bloomIntensityLight'
  > {
  leadColorDark: THREE.Color;
  trailColorBaseDark: THREE.Color;
  leadColorLight: THREE.Color;
  trailColorBaseLight: THREE.Color;
}

export interface ParsedThemeColorsConfig
  extends Omit<SceneConfig['themeColors'], 'darkBgHex' | 'lightBgHex'> {
  darkBg: THREE.Color;
  lightBg: THREE.Color;
}

export interface SplashParticlesConfig {
  enabled: boolean;
  maxParticles: number;
  particlesPerSplash: number;
  size: number;
  speedMin: number;
  speedMax: number;
  lift: number;
  gravity: number;
  lifespan: number;
}

export interface ParsedSplashParticlesConfig extends SplashParticlesConfig {
  splashColor: THREE.Color;
}

export interface ParsedSceneConfig {
  plane: ParsedPlaneConfig;
  rain: ParsedRainConfig;
  camera: SceneConfig['camera'];
  themeColors: ParsedThemeColorsConfig;
  effects: {
    bloom: BloomConfig;
    fog: SceneConfig['effects']['fog'];
  };
  splashParticles: ParsedSplashParticlesConfig;
}

export function parseConfigColors(
  configParam?: Partial<SceneConfig>,
  currentTheme: 'light' | 'dark' = 'dark'
): ParsedSceneConfig {
  const config = {
    plane: { ...defaultSceneConfig.plane, ...(configParam?.plane || {}) },
    rain: { ...defaultSceneConfig.rain, ...(configParam?.rain || {}) },
    camera: { ...defaultSceneConfig.camera, ...(configParam?.camera || {}) },
    themeColors: {
      ...defaultSceneConfig.themeColors,
      ...(configParam?.themeColors || {}),
    },
    effects: {
      ...defaultSceneConfig.effects,
      ...(configParam?.effects || {}),
      fog: { ...defaultSceneConfig.effects.fog, ...(configParam?.effects?.fog || {}) },
    },
    splashParticles: {
      ...defaultSceneConfig.splashParticles,
      ...(configParam?.splashParticles || {}),
    },
  };

  const parsedPlane: any = { ...config.plane };
  parsedPlane.planeColorForDarkTheme = new THREE.Color(config.plane.hillDarkColorHex);
  parsedPlane.planeColorForLightTheme = new THREE.Color(config.plane.hillLightColorHex);
  delete parsedPlane.hillDarkColorHex;
  delete parsedPlane.hillLightColorHex;

  const bloomIntensity =
    currentTheme === 'light' ? config.rain.bloomIntensityLight : config.rain.bloomIntensity;

  const parsedRain: any = { ...config.rain };
  parsedRain.leadColorDark = new THREE.Color(config.rain.leadColorDarkHex).multiplyScalar(
    bloomIntensity.lead
  );
  parsedRain.trailColorBaseDark = new THREE.Color(config.rain.trailColorBaseDarkHex).multiplyScalar(
    bloomIntensity.trail
  );
  parsedRain.leadColorLight = new THREE.Color(config.rain.leadColorLightHex).multiplyScalar(
    bloomIntensity.lead
  );
  parsedRain.trailColorBaseLight = new THREE.Color(
    config.rain.trailColorBaseLightHex
  ).multiplyScalar(bloomIntensity.trail);
  delete parsedRain.leadColorDarkHex;
  delete parsedRain.trailColorBaseDarkHex;
  delete parsedRain.leadColorLightHex;
  delete parsedRain.trailColorBaseLightHex;
  delete parsedRain.splashColorHex;
  delete parsedRain.splashColorLightHex;
  delete parsedRain.bloomIntensity;
  delete parsedRain.bloomIntensityLight;

  const parsedThemeColors: any = { ...config.themeColors };
  parsedThemeColors.darkBg = new THREE.Color(config.themeColors.darkBgHex);
  parsedThemeColors.lightBg = new THREE.Color(config.themeColors.lightBgHex);
  delete parsedThemeColors.darkBgHex;
  delete parsedThemeColors.lightBgHex;

  const parsedSplashParticles: any = { ...config.splashParticles };
  parsedSplashParticles.splashColor = new THREE.Color(
    currentTheme === 'light' ? config.rain.splashColorLightHex : config.rain.splashColorHex
  ).multiplyScalar(bloomIntensity.splash);

  const parsedEffects = {
    bloom: currentTheme === 'light' ? config.effects.bloomLight : config.effects.bloomDark,
    fog: config.effects.fog,
  };

  return {
    plane: parsedPlane as ParsedPlaneConfig,
    rain: parsedRain as ParsedRainConfig,
    camera: config.camera,
    themeColors: parsedThemeColors as ParsedThemeColorsConfig,
    effects: parsedEffects,
    splashParticles: parsedSplashParticles as ParsedSplashParticlesConfig,
  };
}
