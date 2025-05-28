// src/lib/sceneConfig.ts
import * as THREE from "three";

export const defaultSceneConfig = {
  plane: {
    size: 256,
    visualSegments: 128,
    collisionSegments: 32,
    timeFactor: 0.1,
    darkThemeHillDarkColorHex: "#53609a",
    darkThemeHillLightColorHex: "#2A2D3A",
    lightThemeHillDarkColorHex: "#D1D3D9",
    lightThemeHillLightColorHex: "#E3E4E9",
    noiseStrength: { hill1: 6.0, hill2: 6.0, hill3: 1.6, overall: 36.0 },
    opacityFactorDark: 0.9,
    opacityFactorLight: 0.98,
  },
  rain: {
    charHeight: 0.9,
    charAspect: 0.49,
    streamCountMobile: 40,
    streamCountDesktop: 115,
    streamLengthMobile: 6,
    streamLengthDesktop: 10,
    yTop: 68,
    yBottom: -12,
    speedBaseMin: 6,
    speedBaseMax: 11,
    leadColorDarkHex: "#8DAAFF",
    trailColorBaseDarkHex: "#6C8CFF",
    leadColorLightHex: "#171B29",
    trailColorBaseLightHex: "#404659",
    splashColorDarkThemeHex: "#E0E2EE",
    splashColorLightThemeHex: "#6A6AFF",
    splashDuration: 0.2,
    splashScaleFactor: 1.5,
  },
  camera: {
    fov: 50,
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
    darkBgHex: "#050507",
    lightBgHex: "#F8F8FC",
  },
};

export type SceneConfig = typeof defaultSceneConfig;

export function parseConfigColors(
  config: Partial<SceneConfig>,
  currentTheme: "light" | "dark" = "dark"
): any {
  const newConfig: any = {};

  const basePlaneConfig = {
    ...defaultSceneConfig.plane,
    ...(config.plane || {}),
  };
  newConfig.plane = { ...basePlaneConfig };
  if (currentTheme === "dark") {
    newConfig.plane.hillDarkColor = new THREE.Color(
      basePlaneConfig.darkThemeHillDarkColorHex
    );
    newConfig.plane.hillLightColor = new THREE.Color(
      basePlaneConfig.darkThemeHillLightColorHex
    );
  } else {
    newConfig.plane.hillDarkColor = new THREE.Color(
      basePlaneConfig.lightThemeHillDarkColorHex
    );
    newConfig.plane.hillLightColor = new THREE.Color(
      basePlaneConfig.lightThemeHillLightColorHex
    );
  }
  delete newConfig.plane.darkThemeHillDarkColorHex;
  delete newConfig.plane.darkThemeHillLightColorHex;
  delete newConfig.plane.lightThemeHillDarkColorHex;
  delete newConfig.plane.lightThemeHillLightColorHex;

  const baseRainConfig = { ...defaultSceneConfig.rain, ...(config.rain || {}) };
  newConfig.rain = { ...baseRainConfig };
  newConfig.rain.leadColorDark = new THREE.Color(
    baseRainConfig.leadColorDarkHex
  );
  newConfig.rain.trailColorBaseDark = new THREE.Color(
    baseRainConfig.trailColorBaseDarkHex
  );
  newConfig.rain.leadColorLight = new THREE.Color(
    baseRainConfig.leadColorLightHex
  );
  newConfig.rain.trailColorBaseLight = new THREE.Color(
    baseRainConfig.trailColorBaseLightHex
  );
  if (currentTheme === "dark") {
    newConfig.rain.splashColor = new THREE.Color(
      baseRainConfig.splashColorDarkThemeHex
    );
  } else {
    newConfig.rain.splashColor = new THREE.Color(
      baseRainConfig.splashColorLightThemeHex
    );
  }
  delete newConfig.rain.splashColorDarkThemeHex;
  delete newConfig.rain.splashColorLightThemeHex;

  const baseThemeColorsConfig = {
    ...defaultSceneConfig.themeColors,
    ...(config.themeColors || {}),
  };
  newConfig.themeColors = { ...baseThemeColorsConfig };
  newConfig.themeColors.darkBg = new THREE.Color(
    baseThemeColorsConfig.darkBgHex
  );
  newConfig.themeColors.lightBg = new THREE.Color(
    baseThemeColorsConfig.lightBgHex
  );

  const baseCameraConfig = {
    ...defaultSceneConfig.camera,
    ...(config.camera || {}),
  };
  newConfig.camera = { ...baseCameraConfig };

  return newConfig as SceneConfig;
}
