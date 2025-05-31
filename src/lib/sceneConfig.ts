import * as THREE from "three";

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
    charHeight: 1,
    charAspect: 0.7,
    streamCountMobile: 40,
    streamCountDesktop: 110,
    streamLengthMobile: 6,
    streamLengthDesktop: 13,
    yTop: 68,
    yBottom: -12,
    speedBaseMin: 5,
    speedBaseMax: 12,
    leadColorDarkHex: "#8DAAFF",
    trailColorBaseDarkHex: "#6C8CFF",
    leadColorLightHex: "#3B5998",
    trailColorBaseLightHex: "#6B7A99",
    splashColorDarkThemeHex: "#80bdff",
    splashColorLightThemeHex: "#58A6FF",
    splashDuration: 0.3,
    splashScaleFactor: 3,
  },
  camera: {
    fov: 45,
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
    lightBgHex: "#F7F8FA",
  },
};

export type SceneConfig = typeof defaultSceneConfig;

export interface ParsedPlaneConfig
  extends Omit<
    SceneConfig["plane"],
    | "darkThemeHillDarkColorHex"
    | "darkThemeHillLightColorHex"
    | "lightThemeHillDarkColorHex"
    | "lightThemeHillLightColorHex"
  > {
  hillDarkColor: THREE.Color;
  hillLightColor: THREE.Color;
}

export interface ParsedRainConfig
  extends Omit<
    SceneConfig["rain"],
    | "leadColorDarkHex"
    | "trailColorBaseDarkHex"
    | "leadColorLightHex"
    | "trailColorBaseLightHex"
    | "splashColorDarkThemeHex"
    | "splashColorLightThemeHex"
  > {
  leadColorDark: THREE.Color;
  trailColorBaseDark: THREE.Color;
  leadColorLight: THREE.Color;
  trailColorBaseLight: THREE.Color;
  splashColor: THREE.Color;
}

export interface ParsedThemeColorsConfig
  extends Omit<SceneConfig["themeColors"], "darkBgHex" | "lightBgHex"> {
  darkBg: THREE.Color;
  lightBg: THREE.Color;
}

export interface ParsedSceneConfig {
  plane: ParsedPlaneConfig;
  rain: ParsedRainConfig;
  camera: SceneConfig["camera"];
  themeColors: ParsedThemeColorsConfig;
}

export function parseConfigColors(
  config: Partial<SceneConfig>,
  currentTheme: "light" | "dark" = "dark"
): ParsedSceneConfig {
  const newConfig: any = {
    plane: {},
    rain: {},
    themeColors: {},
    camera: {},
  };

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
  delete newConfig.rain.leadColorDarkHex;
  delete newConfig.rain.trailColorBaseDarkHex;
  delete newConfig.rain.leadColorLightHex;
  delete newConfig.rain.trailColorBaseLightHex;
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
  delete newConfig.themeColors.darkBgHex;
  delete newConfig.themeColors.lightBgHex;

  const baseCameraConfig = {
    ...defaultSceneConfig.camera,
    ...(config.camera || {}),
  };
  newConfig.camera = { ...baseCameraConfig };

  return newConfig as ParsedSceneConfig;
}
