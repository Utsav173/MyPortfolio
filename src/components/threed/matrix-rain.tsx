"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import * as THREE from "three";
import {
  type MatrixRainConfig,
  defaultConfig as DefaultMatrixConfig,
} from "./matrix-rain-config";

const DEBUG_MODE = false;
const DEBUG_HELPERS = false;

interface SpriteUserData {
  originalChar: string;
  baseScale: number;
  isLeading: boolean;
  isTail: boolean;
  tailIndex: number;
  streamId: number;
  baseYVelocity: number;
  currentYVelocity: number;
  opacity: number;
  targetOpacity: number;
  lastInteractionFactor: number;
  normalizedZ: number;
  rippleOffsetY: number;
  rippleTargetOffsetY: number;
  currentPushOffsetX: number;
  targetPushOffsetX: number;
  interactionTargetScale: number;
}
interface StreamInfo {
  id: number;
  group: THREE.Group;
  lastSpawnTime: number;
  spawnInterval: number;
  horizontalDriftPhase: number;
  horizontalDriftAmplitude: number;
  normalizedZ: number;
  currentLeaderSprite: THREE.Sprite | null;
  currentTailSprites: THREE.Sprite[];
  boxHelper?: THREE.BoxHelper;
}

interface MatrixRainProps {
  className?: string;
  config?: Partial<MatrixRainConfig>;
  theme?: "light" | "dark" | string;
}

const ndcMouse = new THREE.Vector2();
const tempWorldPos = new THREE.Vector3();

const log = (level: "log" | "warn" | "error", ...args: any[]) => {
  if (DEBUG_MODE) {
    console[level]("[MatrixRain]", ...args);
  }
};

const getRgbaFromCssColor = (colorSource: string, alpha: number): string => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    if (colorSource.startsWith("#")) {
      const r = parseInt(colorSource.slice(1, 3), 16);
      const g = parseInt(colorSource.slice(3, 5), 16);
      const b = parseInt(colorSource.slice(5, 7), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return `rgba(${r},${g},${b},${alpha})`;
      }
    }
    return `rgba(128,128,128,${alpha})`;
  }

  const tempDiv = document.createElement("div");
  tempDiv.style.color = colorSource;
  tempDiv.style.position = "fixed";
  tempDiv.style.left = "-9999px";
  document.body.appendChild(tempDiv);

  let computedColor = "rgb(128, 128, 128)";
  try {
    computedColor = window.getComputedStyle(tempDiv).color;
  } catch (e) {
    log("warn", `Could not compute style for colorSource: ${colorSource}`, e);
  }

  document.body.removeChild(tempDiv);

  const match = computedColor.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
  );
  if (match) {
    return `rgba(${match[1]},${match[2]},${match[3]},${alpha})`;
  }

  log(
    "warn",
    `Failed to parse computed color: ${computedColor} for source: ${colorSource}`
  );
  return `rgba(128,128,128,${alpha})`;
};

const MatrixRain: React.FC<MatrixRainProps> = ({
  className,
  config: userConfig,
  theme: currentTheme = "dark",
}) => {
  const resolvedTheme = useMemo(
    () => (currentTheme === "system" || !currentTheme ? "dark" : currentTheme),
    [currentTheme]
  );

  const config = useMemo<MatrixRainConfig>(() => {
    const baseDefaults = DefaultMatrixConfig;
    let mergedConfig = { ...baseDefaults };
    if (userConfig) {
      mergedConfig = {
        ...mergedConfig,
        ...userConfig,
        LIGHT_THEME_COLORS: {
          ...baseDefaults.LIGHT_THEME_COLORS,
          ...(userConfig.LIGHT_THEME_COLORS || {}),
        },
        DARK_THEME_COLORS: {
          ...baseDefaults.DARK_THEME_COLORS,
          ...(userConfig.DARK_THEME_COLORS || {}),
        },
      };
    }
    const activeThemeColorsConfig =
      resolvedTheme === "light"
        ? mergedConfig.LIGHT_THEME_COLORS
        : mergedConfig.DARK_THEME_COLORS;

    const effectiveRegularRgba = getRgbaFromCssColor(
      activeThemeColorsConfig.REGULAR_CHAR_COLOR_SOURCE,
      activeThemeColorsConfig.REGULAR_CHAR_ALPHA
    );
    const effectiveLeadingRgba = getRgbaFromCssColor(
      activeThemeColorsConfig.LEADING_CHAR_COLOR_SOURCE,
      activeThemeColorsConfig.LEADING_CHAR_ALPHA
    );

    mergedConfig.EFFECTIVE_REGULAR_CHAR_RGBA = effectiveRegularRgba;
    mergedConfig.EFFECTIVE_LEADING_CHAR_RGBA = effectiveLeadingRgba;

    return mergedConfig;
  }, [userConfig, resolvedTheme]);

  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const streamsRef = useRef<StreamInfo[]>([]);
  const allSpritesRef = useRef<THREE.Sprite[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const lastTimeRef = useRef(0);
  const pointerPos = useRef({ x: -10000, y: -10000 });
  const mousePlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );
  const pointerIntersectionPoint = useMemo(
    () => new THREE.Vector3(Infinity, Infinity, Infinity),
    []
  );
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const characterTexturesCache = useMemo(
    () => new Map<string, THREE.CanvasTexture>(),
    []
  );
  const frameCountRef = useRef(0);
  const dynamicSpawnVolumeYHalfHeightRef = useRef(
    config.SPAWN_VOLUME_Y_HALF_HEIGHT
  );

  const getCharacterTexture = useCallback(
    (
      char: string,
      color: string,
      spriteBaseScale: number,
      isLeadingOrTail: boolean
    ): THREE.CanvasTexture => {
      const textureDrawFontSize =
        config.FONT_SIZE_PX *
        config.TEXTURE_RESOLUTION_MULTIPLIER *
        spriteBaseScale;
      const cacheKey = `${char}_${color}_${textureDrawFontSize.toFixed(
        1
      )}_${isLeadingOrTail}`;
      if (characterTexturesCache.has(cacheKey))
        return characterTexturesCache.get(cacheKey)!;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      const font = `bold ${textureDrawFontSize}px monospace`;
      context.font = font;
      const textMetrics = context.measureText(char);
      const charConfigHeightUnscaled =
        config.FONT_SIZE_PX * config.CHAR_BASE_HEIGHT_PX_FACTOR;
      const textureDrawCharHeight =
        charConfigHeightUnscaled *
        config.TEXTURE_RESOLUTION_MULTIPLIER *
        spriteBaseScale;
      let glowEffectSize = 0;
      if (
        isLeadingOrTail &&
        config.LEADING_CHAR_GLOW_OPACITY > 0 &&
        config.LEADING_CHAR_GLOW_BLUR > 0
      ) {
        glowEffectSize =
          config.LEADING_CHAR_GLOW_BLUR *
          config.TEXTURE_RESOLUTION_MULTIPLIER *
          spriteBaseScale *
          2;
      }
      const scaledPadding = Math.ceil(4 * config.TEXTURE_RESOLUTION_MULTIPLIER);
      canvas.width = Math.ceil(
        Math.max(textureDrawFontSize, textMetrics.width) +
          glowEffectSize +
          scaledPadding
      );
      canvas.height = Math.ceil(
        textureDrawCharHeight + glowEffectSize + scaledPadding
      );
      context.font = font;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      if (
        isLeadingOrTail &&
        config.LEADING_CHAR_GLOW_OPACITY > 0 &&
        config.LEADING_CHAR_GLOW_BLUR > 0
      ) {
        const baseColorRGBMatch = color.match(/rgba?\(([^,]+,[^,]+,[^,]+)/);
        const shadowColorBase = baseColorRGBMatch
          ? baseColorRGBMatch[1]
          : "200,255,200";
        context.shadowColor = `rgba(${shadowColorBase}, ${config.LEADING_CHAR_GLOW_OPACITY})`;
        context.shadowBlur =
          config.LEADING_CHAR_GLOW_BLUR *
          config.TEXTURE_RESOLUTION_MULTIPLIER *
          spriteBaseScale;
      }
      context.fillStyle = color;
      context.fillText(char, centerX, centerY);
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.premultiplyAlpha = true;
      texture.needsUpdate = true;
      characterTexturesCache.set(cacheKey, texture);
      return texture;
    },
    [characterTexturesCache, config]
  );

  const createCharacterSprite = useCallback(
    (
      char: string,
      streamId: number,
      isLeading: boolean,
      yPosInWorld: number,
      isTail: boolean = false,
      tailIndex: number = -1
    ): THREE.Sprite => {
      const stream = streamsRef.current[streamId];
      if (!stream) {
        log("error", `CreateSprite: Stream ${streamId} not found.`);
        const errorMat = new THREE.SpriteMaterial({
          color: 0xff0000,
          depthTest: false,
        });
        const errorSprite = new THREE.Sprite(errorMat);
        errorMat.dispose();
        return errorSprite;
      }
      const spriteBaseScaleVariation =
        config.MIN_SPRITE_SCALE +
        Math.random() * (config.MAX_SPRITE_SCALE - config.MIN_SPRITE_SCALE);
      const normalizedZ = stream.normalizedZ;
      let currentOpacityFactor = 1.0;
      if (isTail) {
        const lerpVal =
          (tailIndex + 1) / Math.max(1, config.LEADING_CHAR_TAIL_LENGTH);
        currentOpacityFactor = THREE.MathUtils.lerp(
          config.LEADING_CHAR_TAIL_DIM_FACTOR_START,
          config.LEADING_CHAR_TAIL_DIM_FACTOR_END,
          lerpVal
        );
      }
      const colorToUse =
        isLeading || isTail
          ? config.EFFECTIVE_LEADING_CHAR_RGBA
          : config.EFFECTIVE_REGULAR_CHAR_RGBA;
      const texture = getCharacterTexture(
        char,
        colorToUse,
        spriteBaseScaleVariation,
        isLeading || isTail
      );
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthTest: false,
        sizeAttenuation: true,
      });
      const sprite = new THREE.Sprite(material);
      const worldFontSize = config.FONT_SIZE_PX * spriteBaseScaleVariation;
      const worldCharHeight =
        config.FONT_SIZE_PX *
        config.CHAR_BASE_HEIGHT_PX_FACTOR *
        spriteBaseScaleVariation;
      sprite.scale.set(worldFontSize, worldCharHeight, 1);
      sprite.position.y = yPosInWorld;
      sprite.position.x = 0;
      const charBaseHeightForVelocity =
        config.FONT_SIZE_PX * config.CHAR_BASE_HEIGHT_PX_FACTOR;
      const velMin =
        config.BASE_Y_VELOCITY_MIN_FACTOR * (charBaseHeightForVelocity * 0.1);
      const velMax =
        config.BASE_Y_VELOCITY_MAX_FACTOR * (charBaseHeightForVelocity * 0.1);
      const baseSpriteVelocity = velMin + Math.random() * (velMax - velMin);
      const zBasedSpeedFactor =
        config.STREAM_MIN_DEPTH_FACTOR +
        normalizedZ *
          (config.STREAM_MAX_DEPTH_FACTOR - config.STREAM_MIN_DEPTH_FACTOR);
      const zBasedOpacityFactor =
        config.STREAM_MIN_DEPTH_FACTOR +
        normalizedZ *
          (config.STREAM_MAX_DEPTH_FACTOR - config.STREAM_MIN_DEPTH_FACTOR);
      (sprite.userData as SpriteUserData) = {
        originalChar: char,
        baseScale: spriteBaseScaleVariation,
        isLeading,
        isTail,
        tailIndex,
        streamId: stream.id,
        baseYVelocity: baseSpriteVelocity * zBasedSpeedFactor,
        currentYVelocity: 0,
        opacity: 0,
        targetOpacity:
          (isLeading
            ? config.TARGET_OPACITY_LEADING
            : isTail
            ? config.TARGET_OPACITY_LEADING * currentOpacityFactor
            : config.MIN_TARGET_OPACITY_REGULAR +
              Math.random() *
                (config.MAX_TARGET_OPACITY_REGULAR -
                  config.MIN_TARGET_OPACITY_REGULAR)) * zBasedOpacityFactor,
        lastInteractionFactor: 0,
        normalizedZ: normalizedZ,
        rippleOffsetY: 0,
        rippleTargetOffsetY: 0,
        currentPushOffsetX: 0,
        targetPushOffsetX: 0,
        interactionTargetScale: spriteBaseScaleVariation,
      };
      sprite.userData.currentYVelocity = sprite.userData.baseYVelocity;
      return sprite;
    },
    [getCharacterTexture, config]
  );

  const runSimulationStep = useCallback(
    (deltaTime: number, isPrefill: boolean = false) => {
      if (
        !sceneRef.current ||
        !cameraRef.current ||
        dimensionsRef.current.width <= 0 ||
        dimensionsRef.current.height <= 0 ||
        deltaTime <= 0
      )
        return;
      const now = isPrefill
        ? lastTimeRef.current + deltaTime * 1000
        : performance.now();
      const { height, width } = dimensionsRef.current;
      const spawnY = dynamicSpawnVolumeYHalfHeightRef.current;
      const despawnY = -dynamicSpawnVolumeYHalfHeightRef.current;
      const charEffectiveHeight =
        config.FONT_SIZE_PX * config.CHAR_BASE_HEIGHT_PX_FACTOR;
      if (!isPrefill && cameraRef.current) {
        ndcMouse.x = (pointerPos.current.x / width) * 2 - 1;
        ndcMouse.y = -(pointerPos.current.y / height) * 2 + 1;
        raycaster.setFromCamera(ndcMouse, cameraRef.current);
        mousePlane.setComponents(
          0,
          0,
          1,
          -config.MOUSE_INTERACTION_MAX_Z_DEPTH
        );
        if (
          !raycaster.ray.intersectPlane(mousePlane, pointerIntersectionPoint)
        ) {
          pointerIntersectionPoint.set(Infinity, Infinity, Infinity);
        }
      }
      streamsRef.current.forEach((stream) => {
        stream.horizontalDriftPhase +=
          deltaTime * config.HORIZONTAL_DRIFT_SPEED_FACTOR;
        if (now - stream.lastSpawnTime > stream.spawnInterval) {
          stream.lastSpawnTime = now;
          stream.spawnInterval =
            config.MIN_SPAWN_INTERVAL_MS +
            Math.random() *
              (config.MAX_SPAWN_INTERVAL_MS - config.MIN_SPAWN_INTERVAL_MS);
          stream.currentLeaderSprite = null;
          stream.currentTailSprites = [];
          const charSetToUse = config.LEADING_CHAR_SUBSET || config.CHAR_SET;
          const leaderChar =
            charSetToUse[Math.floor(Math.random() * charSetToUse.length)];
          const yPos =
            spawnY + charEffectiveHeight * (0.5 + Math.random() * 0.5);
          const leaderSprite = createCharacterSprite(
            leaderChar,
            stream.id,
            true,
            yPos,
            false,
            -1
          );
          stream.group.add(leaderSprite);
          allSpritesRef.current.push(leaderSprite);
          stream.currentLeaderSprite = leaderSprite;
          let previousSpriteY = yPos;
          const leaderSpriteUserData = leaderSprite.userData as SpriteUserData;
          const leaderBaseScale = leaderSpriteUserData?.baseScale || 1.0;
          for (let i = 0; i < config.LEADING_CHAR_TAIL_LENGTH; i++) {
            const tailChar =
              config.CHAR_SET[
                Math.floor(Math.random() * config.CHAR_SET.length)
              ];
            const tailSpriteY =
              previousSpriteY -
              charEffectiveHeight *
                leaderBaseScale *
                (0.7 + Math.random() * 0.3);
            const tailSprite = createCharacterSprite(
              tailChar,
              stream.id,
              false,
              tailSpriteY,
              true,
              i
            );
            stream.group.add(tailSprite);
            allSpritesRef.current.push(tailSprite);
            stream.currentTailSprites.push(tailSprite);
            previousSpriteY = tailSpriteY;
          }
        }
      });
      const spritesToRemove: THREE.Sprite[] = [];
      allSpritesRef.current.forEach((sprite) => {
        const userData = sprite.userData as SpriteUserData;
        const material = sprite.material as THREE.SpriteMaterial;
        const stream = streamsRef.current[userData.streamId];
        if (!stream || !userData) {
          spritesToRemove.push(sprite);
          return;
        }
        sprite.getWorldPosition(tempWorldPos);
        let interactionFactor = 0;
        userData.interactionTargetScale = userData.baseScale;
        if (
          !isPrefill &&
          tempWorldPos.z < config.MOUSE_INTERACTION_MAX_Z_DEPTH &&
          tempWorldPos.z > config.MIN_STREAM_Z_DEPTH &&
          pointerIntersectionPoint.x !== Infinity
        ) {
          const dxWorld = tempWorldPos.x - pointerIntersectionPoint.x;
          const dyWorld = tempWorldPos.y - pointerIntersectionPoint.y;
          const distanceToPointer3D = Math.sqrt(
            dxWorld * dxWorld + dyWorld * dyWorld
          );
          const zAdjustedInteractionRadius =
            config.MOUSE_INTERACTION_RADIUS *
            (0.5 + userData.normalizedZ * 0.75);
          if (distanceToPointer3D < zAdjustedInteractionRadius) {
            interactionFactor =
              1 - distanceToPointer3D / zAdjustedInteractionRadius;
            interactionFactor = Math.max(
              0,
              interactionFactor * interactionFactor
            );
            userData.currentYVelocity =
              userData.baseYVelocity *
              (1 +
                (config.MOUSE_SPEED_INCREASE_FACTOR - 1) * interactionFactor);
            userData.rippleTargetOffsetY =
              Math.sin(
                distanceToPointer3D * 0.05 +
                  now * 0.002 * config.MOUSE_RIPPLE_FREQUENCY_FACTOR
              ) *
              config.MOUSE_RIPPLE_STRENGTH_FACTOR *
              interactionFactor *
              charEffectiveHeight *
              0.3;
            const pushStrength =
              config.FONT_SIZE_PX *
              config.MOUSE_PUSH_STRENGTH_FACTOR *
              (0.4 + userData.normalizedZ * 0.8);
            if (Math.abs(dxWorld) > 1.0) {
              const pushDirection = dxWorld > 0 ? 1 : -1;
              userData.targetPushOffsetX =
                pushDirection * pushStrength * interactionFactor;
            } else {
              userData.targetPushOffsetX = 0;
            }
            if (config.MOUSE_INTERACTION_SCALE_FACTOR !== 1.0) {
              userData.interactionTargetScale =
                userData.baseScale *
                (1 +
                  (config.MOUSE_INTERACTION_SCALE_FACTOR - 1) *
                    interactionFactor);
            }
          } else {
            userData.currentYVelocity = userData.baseYVelocity;
            userData.rippleTargetOffsetY = 0;
            userData.targetPushOffsetX = 0;
          }
          userData.lastInteractionFactor = THREE.MathUtils.lerp(
            userData.lastInteractionFactor,
            interactionFactor,
            config.INTERACTION_LERP_SPEED
          );
        } else {
          userData.currentYVelocity = userData.baseYVelocity;
          userData.lastInteractionFactor = THREE.MathUtils.lerp(
            userData.lastInteractionFactor,
            0,
            config.INTERACTION_LERP_SPEED
          );
          userData.rippleTargetOffsetY = 0;
          userData.targetPushOffsetX = 0;
        }
        userData.currentPushOffsetX = THREE.MathUtils.lerp(
          userData.currentPushOffsetX,
          userData.targetPushOffsetX,
          config.INTERACTION_LERP_SPEED
        );
        userData.rippleOffsetY = THREE.MathUtils.lerp(
          userData.rippleOffsetY,
          userData.rippleTargetOffsetY,
          config.MOUSE_RIPPLE_LERP_SPEED
        );
        const currentRippleOffset = userData.rippleOffsetY;
        const undisturbedStreamDriftX =
          Math.sin(
            stream.horizontalDriftPhase +
              (sprite.position.y + currentRippleOffset) *
                config.HORIZONTAL_DRIFT_Y_POS_FACTOR
          ) * stream.horizontalDriftAmplitude;
        sprite.position.x =
          undisturbedStreamDriftX + userData.currentPushOffsetX;
        sprite.position.y -=
          userData.currentYVelocity *
          deltaTime *
          config.Y_VELOCITY_DELTA_MULTIPLIER;
        sprite.position.y += currentRippleOffset;
        const currentWorldFontSize =
          config.FONT_SIZE_PX * userData.interactionTargetScale;
        const currentWorldCharHeight =
          config.FONT_SIZE_PX *
          config.CHAR_BASE_HEIGHT_PX_FACTOR *
          userData.interactionTargetScale;
        sprite.scale.x = THREE.MathUtils.lerp(
          sprite.scale.x,
          currentWorldFontSize,
          config.INTERACTION_LERP_SPEED
        );
        sprite.scale.y = THREE.MathUtils.lerp(
          sprite.scale.y,
          currentWorldCharHeight,
          config.INTERACTION_LERP_SPEED
        );
        const fadeInDist =
          charEffectiveHeight * config.SPRITE_FADE_IN_DISTANCE_CHARS;
        const fadeOutDist =
          charEffectiveHeight * config.SPRITE_FADE_OUT_DISTANCE_CHARS;
        const localY = sprite.position.y;
        const lifeSpanProgress = THREE.MathUtils.clamp(
          (spawnY + fadeInDist - localY) / fadeInDist,
          0,
          1
        );
        const endLifeProgress = THREE.MathUtils.clamp(
          (localY - (despawnY - fadeOutDist)) / fadeOutDist,
          0,
          1
        );
        let finalTargetOpacity = userData.targetOpacity;
        if (localY > spawnY) {
          finalTargetOpacity *= lifeSpanProgress;
        } else if (localY < despawnY + fadeOutDist) {
          finalTargetOpacity *= 1 - endLifeProgress;
        }
        if (isPrefill) {
          const clampedOpacity = Math.max(0, Math.min(1, finalTargetOpacity));
          material.opacity = clampedOpacity;
          userData.opacity = clampedOpacity;
        } else {
          const clampedTargetOpacity = Math.max(
            0,
            Math.min(1, finalTargetOpacity)
          );
          userData.opacity = THREE.MathUtils.lerp(
            userData.opacity,
            clampedTargetOpacity,
            config.OPACITY_LERP_SPEED
          );
          material.opacity = userData.opacity;
        }
        if (
          !userData.isTail &&
          Math.random() <
            (userData.isLeading
              ? config.LEADING_CHAR_CHANGE_CHANCE
              : config.NON_LEADING_CHAR_CHANGE_CHANCE)
        ) {
          const charSetToUse =
            userData.isLeading && config.LEADING_CHAR_SUBSET
              ? config.LEADING_CHAR_SUBSET
              : config.CHAR_SET;
          userData.originalChar =
            charSetToUse[Math.floor(Math.random() * charSetToUse.length)];
          material.map = getCharacterTexture(
            userData.originalChar,
            userData.isLeading || userData.isTail
              ? config.EFFECTIVE_LEADING_CHAR_RGBA
              : config.EFFECTIVE_REGULAR_CHAR_RGBA,
            userData.baseScale,
            userData.isLeading || userData.isTail
          );
        }

        const absoluteDespawnY = despawnY - charEffectiveHeight * 4;
        if (sprite.position.y < absoluteDespawnY) {
          spritesToRemove.push(sprite);
        } else if (
          material.opacity < 0.005 &&
          sprite.position.y <
            spawnY -
              charEffectiveHeight *
                (config.SPRITE_FADE_IN_DISTANCE_CHARS +
                  config.LEADING_CHAR_TAIL_LENGTH +
                  2.5)
        ) {
          spritesToRemove.push(sprite);
        }
      });
      spritesToRemove.forEach((sprite) => {
        if (sprite.parent) sprite.parent.remove(sprite);
        const mat = sprite.material as THREE.SpriteMaterial;
        mat.map?.dispose();
        mat.dispose();
        const indexInAll = allSpritesRef.current.indexOf(sprite);
        if (indexInAll > -1) allSpritesRef.current.splice(indexInAll, 1);
      });
    },
    [
      createCharacterSprite,
      getCharacterTexture,
      config,
      pointerPos,
      dimensionsRef,
      raycaster,
      mousePlane,
      pointerIntersectionPoint,
      dynamicSpawnVolumeYHalfHeightRef,
    ]
  );

  const initializeAndPrefill = useCallback(() => {
    if (
      !sceneRef.current ||
      !cameraRef.current ||
      dimensionsRef.current.width <= 0 ||
      dimensionsRef.current.height <= 0
    )
      return;
    allSpritesRef.current.forEach((sprite) => {
      if (sprite.parent) sprite.parent.remove(sprite);
      const mat = sprite.material as THREE.SpriteMaterial;
      mat.map?.dispose();
      mat.dispose();
    });
    allSpritesRef.current = [];
    streamsRef.current.forEach((stream) => {
      if (stream.boxHelper && stream.boxHelper.parent)
        stream.boxHelper.parent.remove(stream.boxHelper);
      stream.boxHelper?.dispose();
      if (stream.group && sceneRef.current) {
        while (stream.group.children.length > 0) {
          const child = stream.group.children[0] as THREE.Sprite;
          const childMat = child.material as THREE.SpriteMaterial;
          childMat.map?.dispose();
          childMat.dispose();
          stream.group.remove(child);
        }
        sceneRef.current.remove(stream.group);
      }
    });
    streamsRef.current = [];
    const { width, height } = dimensionsRef.current;
    const columnActualWidth =
      config.FONT_SIZE_PX * config.COLUMN_BASE_WIDTH_PX_FACTOR;
    const halfFovRadians = THREE.MathUtils.degToRad(config.CAMERA_FOV / 2);
    const camDistToZZero = Math.abs(cameraRef.current.position.z);
    const visibleWidthAtZZero =
      2 * camDistToZZero * Math.tan(halfFovRadians) * cameraRef.current.aspect;
    const averageStreamZ =
      (config.MIN_STREAM_Z_DEPTH + config.MAX_STREAM_Z_DEPTH) / 2;
    const distanceToAverageStreamPlane = Math.abs(
      cameraRef.current.position.z - averageStreamZ
    );
    const visibleHeightAtAverageZ =
      2 * distanceToAverageStreamPlane * Math.tan(halfFovRadians);
    dynamicSpawnVolumeYHalfHeightRef.current =
      (visibleHeightAtAverageZ / 2) * 1.1;
    const numColumns = Math.max(
      1,
      Math.floor(
        (visibleWidthAtZZero / columnActualWidth) *
          config.SPAWN_VOLUME_X_SPREAD_FACTOR
      ) + 6
    );
    for (let i = 0; i < numColumns; i++) {
      const streamGroup = new THREE.Group();
      streamGroup.position.x =
        i * columnActualWidth -
        (numColumns * columnActualWidth) / 2 +
        columnActualWidth / 2;
      const streamZ =
        config.MIN_STREAM_Z_DEPTH +
        Math.random() * (config.MAX_STREAM_Z_DEPTH - config.MIN_STREAM_Z_DEPTH);
      streamGroup.position.z = streamZ;
      const range = config.MAX_STREAM_Z_DEPTH - config.MIN_STREAM_Z_DEPTH;
      const normalizedZ =
        (streamZ - config.MIN_STREAM_Z_DEPTH) / Math.max(0.01, range);
      sceneRef.current.add(streamGroup);
      let boxHelperInstance: THREE.BoxHelper | undefined = undefined;
      if (DEBUG_HELPERS && i < 3 && sceneRef.current) {
        boxHelperInstance = new THREE.BoxHelper(streamGroup, 0xffff00);
        sceneRef.current.add(boxHelperInstance);
      }
      const driftAmpMin =
        columnActualWidth * config.HORIZONTAL_DRIFT_AMPLITUDE_MIN_FACTOR;
      const driftAmpMax =
        columnActualWidth * config.HORIZONTAL_DRIFT_AMPLITUDE_MAX_FACTOR;
      streamsRef.current.push({
        id: i,
        group: streamGroup,
        lastSpawnTime:
          performance.now() + Math.random() * config.MAX_SPAWN_INTERVAL_MS,
        spawnInterval:
          config.MIN_SPAWN_INTERVAL_MS +
          Math.random() *
            (config.MAX_SPAWN_INTERVAL_MS - config.MIN_SPAWN_INTERVAL_MS),
        horizontalDriftPhase: Math.random() * Math.PI * 2,
        horizontalDriftAmplitude:
          driftAmpMin + Math.random() * (driftAmpMax - driftAmpMin),
        normalizedZ: Math.max(0, Math.min(1, normalizedZ)),
        currentLeaderSprite: null,
        currentTailSprites: [],
        boxHelper: boxHelperInstance,
      });
    }
    if (config.PREFILL_DURATION_SECONDS > 0) {
      const prefillSteps = Math.floor(
        config.PREFILL_DURATION_SECONDS * (1 / 0.033)
      );
      const prefillDelta = 0.033;
      let simulatedTime = 0;
      for (let i = 0; i < prefillSteps; i++) {
        lastTimeRef.current = simulatedTime;
        runSimulationStep(prefillDelta, true);
        simulatedTime += prefillDelta * 1000;
      }
    }
    lastTimeRef.current = performance.now();
  }, [config, runSimulationStep, dynamicSpawnVolumeYHalfHeightRef]);

  const animateLiveLoop = useCallback(() => {
    animationFrameIdRef.current = requestAnimationFrame(animateLiveLoop);
    const now = performance.now();
    let delta = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;
    frameCountRef.current++;
    delta = Math.min(delta, 1 / 10);
    if (delta <= 0) return;
    runSimulationStep(delta, false);
    if (DEBUG_HELPERS) {
      streamsRef.current.forEach((stream) => stream.boxHelper?.update());
    }
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [runSimulationStep]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    dimensionsRef.current = {
      width: container.clientWidth,
      height: container.clientHeight,
    };
    if (dimensionsRef.current.width <= 0 || dimensionsRef.current.height <= 0) {
      dimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      if (dimensionsRef.current.width <= 0 || dimensionsRef.current.height <= 0)
        return;
    }
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      config.CAMERA_FOV,
      dimensionsRef.current.width / Math.max(1, dimensionsRef.current.height),
      config.CAMERA_NEAR_PLANE,
      config.CAMERA_FAR_PLANE
    );
    cameraRef.current.position.z = config.CAMERA_INITIAL_Z_POS;
    const lookAtZ = (config.MIN_STREAM_Z_DEPTH + config.MAX_STREAM_Z_DEPTH) / 2;
    cameraRef.current.lookAt(0, 0, lookAtZ);
    sceneRef.current.fog = null;
    if (DEBUG_HELPERS && sceneRef.current) {
      const axesHelper = new THREE.AxesHelper(
        dynamicSpawnVolumeYHalfHeightRef.current
      );
      sceneRef.current.add(axesHelper);
    }
    try {
      rendererRef.current = new THREE.WebGLRenderer({
        alpha: true,
        antialias: config.RENDERER_ANTIALIAS,
      });
      rendererRef.current.setSize(
        dimensionsRef.current.width,
        dimensionsRef.current.height
      );
      rendererRef.current.setPixelRatio(
        Math.min(window.devicePixelRatio, config.RENDERER_PIXEL_RATIO_CAP)
      );
      container.appendChild(rendererRef.current.domElement);
    } catch (error) {
      log("error", "[MatrixRain] ERROR creating WebGLRenderer:", error);
      if (
        rendererRef.current &&
        rendererRef.current.domElement &&
        container.contains(rendererRef.current.domElement)
      ) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current = null;
      return;
    }
    initializeAndPrefill();
    const handleMouseMove = (event: MouseEvent) => {
      pointerPos.current = { x: event.clientX, y: event.clientY };
    };
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        pointerPos.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        pointerPos.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }
    };
    const handleTouchEnd = (event: TouchEvent) => {};
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    lastTimeRef.current = performance.now();
    animationFrameIdRef.current = requestAnimationFrame(animateLiveLoop);
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || !entries.length) return;
      const { width, height } = entries[0].contentRect;
      if (width <= 0 || height <= 0) return;
      dimensionsRef.current = { width, height };
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / Math.max(1, height);
        cameraRef.current.updateProjectionMatrix();
        sceneRef.current.fog = null;
        initializeAndPrefill();
      }
    });
    if (container) resizeObserver.observe(container);
    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (container) resizeObserver.unobserve(container);
      resizeObserver.disconnect();
      allSpritesRef.current.forEach((s) => {
        if (s.material) {
          const mat = s.material as THREE.SpriteMaterial;
          if (mat.map) mat.map.dispose();
          mat.dispose();
        }
        if (s.parent) s.parent.remove(s);
      });
      allSpritesRef.current = [];
      streamsRef.current.forEach((st) => {
        if (st.group) {
          if (st.boxHelper && st.boxHelper.parent)
            st.boxHelper.parent.remove(st.boxHelper);
          st.boxHelper?.dispose();
          while (st.group.children.length > 0) {
            const child = st.group.children[0] as THREE.Sprite;
            if (child.material) {
              const mat = child.material as THREE.SpriteMaterial;
              if (mat.map) mat.map.dispose();
              mat.dispose();
            }
            st.group.remove(child);
          }
          if (sceneRef.current) sceneRef.current.remove(st.group);
        }
      });
      streamsRef.current = [];
      if (sceneRef.current) {
        const axes = sceneRef.current.children.find(
          (c) => c instanceof THREE.AxesHelper
        );
        if (axes) {
          if (axes.parent) axes.parent.remove(axes);
          (axes as THREE.AxesHelper).dispose?.();
        }
      }
      characterTexturesCache.forEach((t) => t.dispose());
      characterTexturesCache.clear();
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (
          container &&
          rendererRef.current.domElement &&
          container.contains(rendererRef.current.domElement)
        ) {
          try {
            container.removeChild(rendererRef.current.domElement);
          } catch (e) {
            log("warn", "Error removing renderer DOM element:", e);
          }
        }
      }
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, [initializeAndPrefill, animateLiveLoop, config, resolvedTheme]);

  return (
    <div
      ref={mountRef}
      className={className || "w-full h-full"}
      style={{ overflow: "hidden", touchAction: "none" }}
    />
  );
};
export default MatrixRain;
