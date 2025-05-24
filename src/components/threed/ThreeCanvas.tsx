"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

interface ThreeCanvasProps {
  sketch: (params: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    parent: HTMLElement;
    composer?: EffectComposer;
  }) =>
    | (() => void)
    | {
        update?: (deltaTime: number) => void;
        cleanup?: () => void;
        resize?: (width: number, height: number) => void;
      }
    | void;
  className?: string;
  onReady?: (params: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    composer?: EffectComposer;
  }) => void;
  cameraType?: "perspective" | "orthographic";
  cameraProps?:
    | Partial<
        Omit<THREE.PerspectiveCamera, "position" | "rotation" | "scale"> & {
          position?: Partial<THREE.Vector3>;
          rotation?: Partial<THREE.Euler>;
          scale?: Partial<THREE.Vector3>;
        }
      >
    | Partial<
        Omit<THREE.OrthographicCamera, "position" | "rotation" | "scale"> & {
          position?: Partial<THREE.Vector3>;
          rotation?: Partial<THREE.Euler>;
          scale?: Partial<THREE.Vector3>;
        }
      >;
  useComposer?: boolean;
  pixelRatio?: number;
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = memo(
  ({
    sketch,
    className,
    onReady,
    cameraType = "perspective",
    cameraProps = {},
    useComposer = false,
    pixelRatio = typeof window !== "undefined"
      ? Math.min(window.devicePixelRatio, 2)
      : 1,
  }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const composerRef = useRef<EffectComposer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<
      THREE.PerspectiveCamera | THREE.OrthographicCamera | null
    >(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const sketchControlsRef = useRef<{
      update?: (deltaTime: number) => void;
      cleanup?: () => void;
      resize?: (width: number, height: number) => void;
    } | null>(null);

    const isIntersectingRef = useRef(true);
    const isContextLostRef = useRef(false);
    const clockRef = useRef(new THREE.Clock());

    const stopAnimationLoop = useCallback(() => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (clockRef.current.running) {
        clockRef.current.stop();
      }
    }, []);

    const animationLoop = useCallback(() => {
      animationFrameIdRef.current = requestAnimationFrame(animationLoop);

      const shouldPauseRendering =
        isContextLostRef.current ||
        !isIntersectingRef.current ||
        (typeof document !== "undefined" &&
          document.visibilityState !== "visible");

      if (shouldPauseRendering) {
        if (clockRef.current.running) {
          clockRef.current.stop();
        }
        return;
      }

      if (!clockRef.current.running) {
        clockRef.current.start();
      }

      let deltaTime = clockRef.current.getDelta();
      const maxDeltaTime = 1 / 30;
      deltaTime = Math.min(deltaTime, maxDeltaTime);

      sketchControlsRef.current?.update?.(deltaTime);

      if (composerRef.current && useComposer) {
        composerRef.current.render(deltaTime);
      } else if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }, [useComposer]);

    const startAnimation = useCallback(() => {
      if (animationFrameIdRef.current === null) {
        if (
          !clockRef.current.running &&
          isIntersectingRef.current &&
          (typeof document === "undefined" ||
            document.visibilityState === "visible")
        ) {
          clockRef.current.start();
        }
        animationLoop();
      }
    }, [animationLoop]);

    const fullCleanup = useCallback(() => {
      stopAnimationLoop();
      sketchControlsRef.current?.cleanup?.();
      sketchControlsRef.current = null;

      composerRef.current?.dispose();
      composerRef.current = null;

      if (rendererRef.current) {
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(
            rendererRef.current.domElement
          );
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
            (object as THREE.Mesh).geometry?.dispose();
            const material = (object as THREE.Mesh).material;
            if (Array.isArray(material)) {
              material.forEach((mat) => {
                mat.dispose();
                Object.values(mat).forEach((value) => {
                  if (value instanceof THREE.Texture) value.dispose();
                });
              });
            } else if (material) {
              (material as THREE.Material).dispose();
              Object.values(material).forEach((value) => {
                if (value instanceof THREE.Texture) value.dispose();
              });
            }
          } else if (object instanceof THREE.Sprite) {
            object.material?.dispose();
            object.material?.map?.dispose();
          }
        });
        sceneRef.current.clear();
        sceneRef.current = null;
      }
      cameraRef.current = null;
    }, [stopAnimationLoop]);

    const initThree = useCallback(() => {
      if (
        !mountRef.current ||
        rendererRef.current ||
        typeof window === "undefined"
      )
        return;
      isContextLostRef.current = false;

      const parent = mountRef.current;
      let width = parent.offsetWidth;
      let height = parent.offsetHeight;

      if (width === 0 || height === 0) {
        const tempResizeObserver = new ResizeObserver(() => {
          if (parent.offsetWidth > 0 && parent.offsetHeight > 0) {
            tempResizeObserver.disconnect();
            initThree();
          }
        });
        tempResizeObserver.observe(parent);
        return;
      }

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
      const { position, rotation, scale, ...otherCameraProps } =
        cameraProps as any;

      if (cameraType === "orthographic") {
        camera = new THREE.OrthographicCamera(
          width / -2,
          width / 2,
          height / 2,
          height / -2,
          (otherCameraProps as Partial<THREE.OrthographicCamera>)?.near ?? 0.1,
          (otherCameraProps as Partial<THREE.OrthographicCamera>)?.far ?? 1000
        );
      } else {
        camera = new THREE.PerspectiveCamera(
          (otherCameraProps as Partial<THREE.PerspectiveCamera>)?.fov ?? 75,
          width / height,
          (otherCameraProps as Partial<THREE.PerspectiveCamera>)?.near ?? 0.1,
          (otherCameraProps as Partial<THREE.PerspectiveCamera>)?.far ?? 1000
        );
      }
      Object.assign(camera, otherCameraProps);
      if (position)
        camera.position.set(
          position.x ?? camera.position.x,
          position.y ?? camera.position.y,
          position.z ?? camera.position.z
        );
      else if (cameraType === "perspective") camera.position.z = 5;
      else camera.position.z = 10;
      if (rotation)
        camera.rotation.set(
          rotation.x ?? camera.rotation.x,
          rotation.y ?? camera.rotation.y,
          rotation.z ?? camera.rotation.z,
          (rotation as THREE.Euler).order ?? camera.rotation.order
        );
      if (scale)
        camera.scale.set(
          scale.x ?? camera.scale.x,
          scale.y ?? camera.scale.y,
          scale.z ?? camera.scale.z
        );
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);

      renderer.domElement.addEventListener(
        "webglcontextlost",
        (event) => {
          event.preventDefault();
          isContextLostRef.current = true;
          stopAnimationLoop();
        },
        false
      );

      renderer.domElement.addEventListener(
        "webglcontextrestored",
        () => {
          isContextLostRef.current = false;
          fullCleanup();
          initThree();
        },
        false
      );

      parent.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      let composerInstance: EffectComposer | undefined;
      if (useComposer) {
        composerInstance = new EffectComposer(renderer);
        composerInstance.setSize(width, height);
        composerInstance.setPixelRatio(pixelRatio);
        composerRef.current = composerInstance;
      }

      const sketchParams: any = { scene, camera, renderer, parent };
      if (composerInstance) sketchParams.composer = composerInstance;

      const sketchResult = sketch(sketchParams);
      if (typeof sketchResult === "function") {
        sketchControlsRef.current = { cleanup: sketchResult };
      } else if (
        sketchResult &&
        (sketchResult.update || sketchResult.cleanup || sketchResult.resize)
      ) {
        sketchControlsRef.current = sketchResult;
      }

      onReady?.({ scene, camera, renderer, composer: composerInstance });

      if (
        isIntersectingRef.current &&
        (typeof document === "undefined" ||
          document.visibilityState === "visible")
      ) {
        startAnimation();
      }
    }, [
      sketch,
      onReady,
      cameraType,
      cameraProps,
      useComposer,
      pixelRatio,
      fullCleanup,
      startAnimation,
      stopAnimationLoop,
    ]);

    useEffect(() => {
      const currentMount = mountRef.current;
      if (!currentMount || typeof window === "undefined") return;

      isIntersectingRef.current = true;

      const intersectionObs = new IntersectionObserver(
        ([entry]) => {
          const oldIntersecting = isIntersectingRef.current;
          isIntersectingRef.current = entry.isIntersecting;
          if (
            entry.isIntersecting &&
            !oldIntersecting &&
            rendererRef.current &&
            !isContextLostRef.current
          ) {
            startAnimation();
          }
        },
        { threshold: 0.01 }
      );
      intersectionObs.observe(currentMount);

      const visibilityChangeListener = () => {
        if (
          document.visibilityState === "visible" &&
          isIntersectingRef.current &&
          rendererRef.current &&
          !isContextLostRef.current
        ) {
          startAnimation();
        }
      };
      document.addEventListener("visibilitychange", visibilityChangeListener);

      initThree();

      const handleResize = () => {
        if (
          rendererRef.current &&
          cameraRef.current &&
          currentMount &&
          !isContextLostRef.current
        ) {
          const width = currentMount.offsetWidth;
          const height = currentMount.offsetHeight;
          if (width === 0 || height === 0) return;

          rendererRef.current.setSize(width, height);
          composerRef.current?.setSize(width, height);

          if (cameraRef.current instanceof THREE.PerspectiveCamera) {
            cameraRef.current.aspect = width / height;
          } else if (cameraRef.current instanceof THREE.OrthographicCamera) {
            cameraRef.current.left = width / -2;
            cameraRef.current.right = width / 2;
            cameraRef.current.top = height / 2;
            cameraRef.current.bottom = height / -2;
          }
          cameraRef.current.updateProjectionMatrix();
          sketchControlsRef.current?.resize?.(width, height);
        }
      };

      const resizeObs = new ResizeObserver(handleResize);
      resizeObs.observe(currentMount);

      return () => {
        intersectionObs.disconnect();
        document.removeEventListener(
          "visibilitychange",
          visibilityChangeListener
        );
        resizeObs.disconnect();
        fullCleanup();
      };
    }, [initThree, fullCleanup, startAnimation]);

    return <div ref={mountRef} className={className || "w-full h-full"} />;
  }
);

ThreeCanvas.displayName = "ThreeCanvas";
export default ThreeCanvas;
