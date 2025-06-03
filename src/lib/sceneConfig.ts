import * as THREE from 'three';

export const defaultSceneConfig = {
  plane: {
    size: 256,
    visualSegments: 128,
    collisionSegments: 32,
    timeFactor: 0.1,
    darkThemeHillDarkColorHex: "#53609a",
    darkThemeHillLightColorHex: "#2A2D3A",
    lightThemeHillDarkColorHex: "#A0B3D4",
    lightThemeHillLightColorHex: "#DDE6F0",
    noiseStrength: { hill1: 6.0, hill2: 6.0, hill3: 1.6, overall: 36.0 },
    opacityFactorDark: 0.9,
    opacityFactorLight: 1,
  },
  rain: {
    charHeight: 0.7,
    charAspect: 0.9,
    streamCountMobile: 40,
    streamCountDesktop: 90,
    streamLengthMobile: 6,
    streamLengthDesktop: 13,
    yTop: 68,
    yBottom: -12,
    speedBaseMin: 4,
    speedBaseMax: 12,
    leadColorDarkHex: '#8DAAFF',
    trailColorBaseDarkHex: '#6C8CFF',
    leadColorLightHex: '#3B5998',
    trailColorBaseLightHex: '#6B7A99',
    bloomIntensity: {
      lead: 2.3,
      trail: 1.5,
      splash: 4,
    },
  },
  camera: {
    fov: 35,
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
    darkBgHex: '#050507',
    lightBgHex: '#F7F8FA',
  },
  effects: {
    fog: {
      enabled: false,
      densityDarkTheme: 0.012,
      densityLightTheme: 0.018,
    },
    bloom: {
      enabled: true,
      luminanceThreshold: 0.07,
      luminanceSmoothing: 0.93,
      intensity: 1.5,
      kernelSize: 'LARGE',
      mipmapBlur: true,
    },
  },
  splashParticles: {
    enabled: true,
    maxParticles: 1600,
    particlesPerSplash: 12,
    size: 0.16,
    speedMin: 2,
    speedMax: 6,
    lift: 1.5,
    gravity: 5.7,
    lifespan: 0.9,
    splashColorDarkThemeHex: "#80bdff",
    splashColorLightThemeHex: "#58A6FF",
    bloomIntensity: 3,
  },
};

export type SceneConfig = typeof defaultSceneConfig;

export interface ParsedPlaneConfig
  extends Omit<
    SceneConfig['plane'],
    | 'darkThemeHillDarkColorHex'
    | 'darkThemeHillLightColorHex'
    | 'lightThemeHillDarkColorHex'
    | 'lightThemeHillLightColorHex'
  > {
  hillDarkColor: THREE.Color;
  hillLightColor: THREE.Color;
}

export interface ParsedRainConfig
  extends Omit<
    SceneConfig['rain'],
    | 'leadColorDarkHex'
    | 'trailColorBaseDarkHex'
    | 'leadColorLightHex'
    | 'trailColorBaseLightHex'
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

export interface ParsedSplashParticlesConfig
  extends Omit<
    SceneConfig['splashParticles'],
    'splashColorDarkThemeHex' | 'splashColorLightThemeHex'
  > {
  splashColor: THREE.Color;
}

export interface ParsedSceneConfig {
  plane: ParsedPlaneConfig;
  rain: ParsedRainConfig;
  camera: SceneConfig['camera'];
  themeColors: ParsedThemeColorsConfig;
  effects: SceneConfig['effects'];
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
    effects: { ...defaultSceneConfig.effects, ...(configParam?.effects || {}) },
    splashParticles: {
      ...defaultSceneConfig.splashParticles,
      ...(configParam?.splashParticles || {}),
    },
  };

  const parsedPlane: any = { ...config.plane };
  if (currentTheme === 'dark') {
    parsedPlane.hillDarkColor = new THREE.Color(
      config.plane.darkThemeHillDarkColorHex
    );
    parsedPlane.hillLightColor = new THREE.Color(
      config.plane.darkThemeHillLightColorHex
    );
  } else {
    parsedPlane.hillDarkColor = new THREE.Color(
      config.plane.lightThemeHillDarkColorHex
    );
    parsedPlane.hillLightColor = new THREE.Color(
      config.plane.lightThemeHillLightColorHex
    );
  }
  delete parsedPlane.darkThemeHillDarkColorHex;
  delete parsedPlane.darkThemeHillLightColorHex;
  delete parsedPlane.lightThemeHillDarkColorHex;
  delete parsedPlane.lightThemeHillLightColorHex;

  const parsedRain: any = { ...config.rain };
  parsedRain.leadColorDark = new THREE.Color(config.rain.leadColorDarkHex);
  parsedRain.trailColorBaseDark = new THREE.Color(
    config.rain.trailColorBaseDarkHex
  );
  parsedRain.leadColorLight = new THREE.Color(config.rain.leadColorLightHex);
  parsedRain.trailColorBaseLight = new THREE.Color(
    config.rain.trailColorBaseLightHex
  );
  delete parsedRain.leadColorDarkHex;
  delete parsedRain.trailColorBaseDarkHex;
  delete parsedRain.leadColorLightHex;
  delete parsedRain.trailColorBaseLightHex;

  const parsedThemeColors: any = { ...config.themeColors };
  parsedThemeColors.darkBg = new THREE.Color(config.themeColors.darkBgHex);
  parsedThemeColors.lightBg = new THREE.Color(config.themeColors.lightBgHex);
  delete parsedThemeColors.darkBgHex;
  delete parsedThemeColors.lightBgHex;

  const parsedSplashParticles: any = { ...config.splashParticles };
  if (currentTheme === 'dark') {
    parsedSplashParticles.splashColor = new THREE.Color(
      config.splashParticles.splashColorDarkThemeHex
    );
  } else {
    parsedSplashParticles.splashColor = new THREE.Color(
      config.splashParticles.splashColorLightThemeHex
    );
  }
  delete parsedSplashParticles.splashColorDarkThemeHex;
  delete parsedSplashParticles.splashColorLightThemeHex;

  return {
    plane: parsedPlane as ParsedPlaneConfig,
    rain: parsedRain as ParsedRainConfig,
    camera: config.camera,
    themeColors: parsedThemeColors as ParsedThemeColorsConfig,
    effects: config.effects,
    splashParticles: parsedSplashParticles as ParsedSplashParticlesConfig,
  };
}
