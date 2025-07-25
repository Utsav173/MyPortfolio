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
    size: 312,
    visualSegments: 128,
    collisionSegments: 32,
    timeFactor: 0.2,
    hillDarkColorHex: '#273161',
    hillLightColorHex: '#4A5568',
    noiseStrength: {
      hill1: 15,
      hill2: 11.3,
      hill3: 3.2,
      overall: 46.5,
    },
    opacityFactorDark: 0.87,
    opacityFactorLight: 0.91,
  },
  rain: {
    charHeight: 1.35,
    charAspect: 0.7,
    streamCountMobile: 40,
    streamCountDesktop: 90,
    streamCountDesktopLight: 75,
    streamLengthMobile: 6,
    streamLengthDesktop: 10,
    yTop: 89,
    yBottom: -30,
    speedBaseMin: 6,
    speedBaseMax: 29,
    leadColorDarkHex: '#a2d9ff',
    trailColorBaseDarkHex: '#0089de',
    leadColorLightHex: '#1E40AF',
    trailColorBaseLightHex: '#60A5FA',
    splashColorHex: '#82acff',
    splashColorLightHex: '#2563EB',
    bloomIntensity: {
      lead: 2.9,
      trail: 3.7,
      splash: 4.7,
    },
    bloomIntensityLight: {
      lead: 0.8,
      trail: 0.6,
      splash: 1.2,
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
      luminanceThreshold: 0.38,
      luminanceSmoothing: 1.3,
      intensity: 3,
      kernelSize: 'LARGE',
      mipmapBlur: true,
    } as BloomConfig,
    bloomLight: {
      enabled: true,
      luminanceThreshold: 0.75,
      luminanceSmoothing: 0.5,
      intensity: 0.9,
      kernelSize: 'MEDIUM',
      mipmapBlur: true,
    } as BloomConfig,
    fog: {
      enabled: true,
      densityDarkTheme: 0.01,
      densityLightTheme: 0.012,
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
