"use client";

import React, { useEffect, useRef, useCallback, memo } from "react";
import * as THREE from "three";

interface ThreeCanvasProps {
  sketch: (params: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    parent: HTMLElement;
  }) => (() => void) | { update?: () => void; cleanup?: () => void } | void;
  className?: string;
  onReady?: (params: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
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
}

const ThreeCanvas: React.FC<ThreeCanvasProps> = memo(
  ({
    sketch,
    className,
    onReady,
    cameraType = "perspective",
    cameraProps = {},
  }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<
      THREE.PerspectiveCamera | THREE.OrthographicCamera | null
    >(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const sketchControlsRef = useRef<{
      update?: () => void;
      cleanup?: () => void;
    } | null>(null);

    const destroySketch = useCallback(() => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      if (sketchControlsRef.current?.cleanup) {
        sketchControlsRef.current.cleanup();
      }
      sketchControlsRef.current = null;

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentElement) {
          rendererRef.current.domElement.parentElement.removeChild(
            rendererRef.current.domElement
          );
        }
        rendererRef.current = null;
      }
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => {
                material.dispose();
                if ((material as any).map) (material as any).map.dispose();
              });
            } else if (object.material) {
              (object.material as THREE.Material).dispose();
              if ((object.material as any).map)
                (object.material as any).map.dispose();
            }
          } else if (object instanceof THREE.Sprite && object.material) {
            object.material.dispose();
            if (object.material.map) object.material.map.dispose();
          } else if (object instanceof THREE.Points) {
            if (object.geometry) object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else if (object.material) {
              (object.material as THREE.Material).dispose();
            }
          }
        });
        sceneRef.current = null;
      }
      cameraRef.current = null;
    }, []);

    const initThree = useCallback(() => {
      if (!mountRef.current || rendererRef.current) return;

      const parent = mountRef.current;
      let width = parent.offsetWidth;
      let height = parent.offsetHeight;

      if (width === 0 || height === 0) {
        const observer = new ResizeObserver(() => {
          if (parent.offsetWidth > 0 && parent.offsetHeight > 0) {
            observer.disconnect();
            initThree();
          }
        });
        observer.observe(parent);
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

      if (position) {
        if (typeof position.x === "number") camera.position.x = position.x;
        if (typeof position.y === "number") camera.position.y = position.y;
        if (typeof position.z === "number") camera.position.z = position.z;
      } else {
        camera.position.z = cameraType === "orthographic" ? 10 : 5;
      }

      if (rotation) {
        if (typeof rotation.x === "number") camera.rotation.x = rotation.x;
        if (typeof rotation.y === "number") camera.rotation.y = rotation.y;
        if (typeof rotation.z === "number") camera.rotation.z = rotation.z;
        if (typeof (rotation as THREE.Euler).order === "string")
          camera.rotation.order = (rotation as THREE.Euler)
            .order as THREE.EulerOrder;
      }

      if (scale) {
        if (typeof scale.x === "number") camera.scale.x = scale.x;
        if (typeof scale.y === "number") camera.scale.y = scale.y;
        if (typeof scale.z === "number") camera.scale.z = scale.z;
      }

      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      parent.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const sketchResult = sketch({ scene, camera, renderer, parent });
      if (typeof sketchResult === "function") {
        sketchControlsRef.current = { cleanup: sketchResult };
      } else if (
        sketchResult &&
        (typeof sketchResult.update === "function" ||
          typeof sketchResult.cleanup === "function")
      ) {
        sketchControlsRef.current = sketchResult;
      }

      if (onReady) {
        onReady({ scene, camera, renderer });
      }

      const animate = () => {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        if (sketchControlsRef.current?.update) {
          sketchControlsRef.current.update();
        }
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      animate();
    }, [sketch, onReady, cameraType, cameraProps, destroySketch]);

    useEffect(() => {
      initThree();
      const currentMountRef = mountRef.current;

      const handleResize = () => {
        if (rendererRef.current && cameraRef.current && currentMountRef) {
          const width = currentMountRef.offsetWidth;
          const height = currentMountRef.offsetHeight;
          if (width === 0 || height === 0) return;

          rendererRef.current.setSize(width, height);
          if (cameraRef.current instanceof THREE.PerspectiveCamera) {
            cameraRef.current.aspect = width / height;
          } else if (cameraRef.current instanceof THREE.OrthographicCamera) {
            cameraRef.current.left = width / -2;
            cameraRef.current.right = width / 2;
            cameraRef.current.top = height / 2;
            cameraRef.current.bottom = height / -2;
          }
          cameraRef.current.updateProjectionMatrix();
        }
      };

      const resizeObserver = new ResizeObserver(handleResize);
      if (currentMountRef) {
        resizeObserver.observe(currentMountRef);
      }

      return () => {
        if (currentMountRef) {
          resizeObserver.unobserve(currentMountRef);
        }
        destroySketch();
      };
    }, [initThree, destroySketch]);

    return <div ref={mountRef} className={className || "w-full h-full"} />;
  }
);

ThreeCanvas.displayName = "ThreeCanvas";
export default ThreeCanvas;
