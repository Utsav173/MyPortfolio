import * as THREE from 'three';

export const defaultSceneConfig = {
	plane: {
		size: 300,
		visualSegments: 160,
		collisionSegments: 32,
		timeFactor: 0.15,
		hillDarkColorHex: '#001a4d',
		hillLightColorHex: '#4da6ff',
		noiseStrength: {
			hill1: 15,
			hill2: 11.3,
			hill3: 3.2,
			overall: 55,
		},
		opacityFactorDark: 0.9,
		opacityFactorLight: 0.95,
	},
	rain: {
		charHeight: 1.8,
		charAspect: 0.56,
		streamCountMobile: 35,
		streamCountDesktop: 60,
		streamLengthMobile: 6,
		streamLengthDesktop: 10,
		yTop: 89,
		yBottom: -30,
		speedBaseMin: 6,
		speedBaseMax: 29,
		leadColorDarkHex: '#a2d9ff',
		trailColorBaseDarkHex: '#0089de',
		leadColorLightHex: '#4A70B0',
		trailColorBaseLightHex: '#7996C7',
		splashColorHex: '#82acff',
		splashColorLightHex: '#b3d7ff', // Added light mode splash color
		bloomIntensity: {
			lead: 3.5,
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
		fov: 35, // Wide IMAX-style FOV
		near: 2,
		far: 2000,
		initialXPos: 0,
		initialYPos: 100, // Calculated for 30° angle (150 * tan(30°))
		initialZPos: 200, // Base distance
		initialLookAtX: 0,
		initialLookAtY: 0, // Looking at ground level
		initialLookAtZ: 0, // Target point at ground
	},
	effects: {
		bloom: {
			enabled: true,
			luminanceThreshold: 0.2,
			luminanceSmoothing: 0.9,
			intensity: 2.0,
			kernelSize: 'LARGE',
			mipmapBlur: true,
		},
		fog: {
			enabled: true,
			densityDarkTheme: 0.008,
			densityLightTheme: 0.006,
		},
	},
	themeColors: {
		darkBgHex: '#03050F',
		lightBgHex: '#f0f5ff',
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
	parsedPlane.planeColorForDarkTheme = new THREE.Color(
		config.plane.hillDarkColorHex
	);
	parsedPlane.planeColorForLightTheme = new THREE.Color(
		config.plane.hillLightColorHex
	);
	delete parsedPlane.hillDarkColorHex;
	delete parsedPlane.hillLightColorHex;

	delete parsedPlane.darkColorHex;
	delete parsedPlane.lightColorHex;

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
	// Use splash color based on currentTheme
	parsedSplashParticles.splashColor = new THREE.Color(
		currentTheme === 'light'
			? config.rain.splashColorLightHex || config.rain.splashColorHex
			: config.rain.splashColorHex
	);

	return {
		plane: parsedPlane as ParsedPlaneConfig,
		rain: parsedRain as ParsedRainConfig,
		camera: config.camera,
		themeColors: parsedThemeColors as ParsedThemeColorsConfig,
		effects: config.effects,
		splashParticles: parsedSplashParticles as ParsedSplashParticlesConfig,
	};
}
