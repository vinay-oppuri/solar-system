'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Environment, Lightformer } from '@react-three/drei';
import { planets } from '@/data/planets';
import Sun from './Sun';
import Planet from './Planet';
import Orbit from './Orbit';
import Starfield from './Starfield';
import SpaceshipTravel from './SpaceshipTravel';
import AsteroidFlyby from './AsteroidFlyby';
import * as THREE from 'three';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import LoadingBridge from './LoadingBridge';
import { useStore } from '@/store/useStore';

function RuntimeStabilityGuard({ enabled, onClamp }: { enabled: boolean; onClamp: () => void }) {
    const { gl } = useThree();
    const elapsedRef = useRef(0);
    const lowFrameDebtRef = useRef(0);
    const clampedRef = useRef(false);

    useEffect(() => {
        if (!enabled) return;

        const canvas = gl.domElement;
        const onContextLost = (event: Event) => {
            event.preventDefault();
            if (!clampedRef.current) {
                clampedRef.current = true;
                onClamp();
            }
        };

        canvas.addEventListener('webglcontextlost', onContextLost as EventListener, { passive: false });

        return () => {
            canvas.removeEventListener('webglcontextlost', onContextLost as EventListener);
        };
    }, [enabled, gl, onClamp]);

    useFrame((_, delta) => {
        if (!enabled || clampedRef.current) return;

        elapsedRef.current += delta;
        // Ignore initial shader/textures warm-up period.
        if (elapsedRef.current < 4) return;

        if (delta > 0.09) {
            lowFrameDebtRef.current += delta;
        } else {
            lowFrameDebtRef.current = Math.max(0, lowFrameDebtRef.current - delta * 0.5);
        }

        if (lowFrameDebtRef.current > 1.2) {
            clampedRef.current = true;
            onClamp();
        }
    });

    return null;
}

export default function SolarSystemCanvas() {
    const graphicsQuality = useStore(state => state.graphicsQuality);
    const setGraphicsQuality = useStore(state => state.setGraphicsQuality);
    const [forceBalanced, setForceBalanced] = useState(false);
    const [safetyClamp, setSafetyClamp] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
        const cpuCores = navigator.hardwareConcurrency ?? 8;
        // Hard fallback only for very constrained hardware or reduced-motion preference.
        setForceBalanced(reducedMotion || (memory !== undefined && memory <= 2) || cpuCores <= 2);
    }, []);

    useEffect(() => {
        // Reset runtime clamp when user explicitly changes graphics mode.
        setSafetyClamp(false);
    }, [graphicsQuality]);

    const isCinematicRequested = graphicsQuality === 'cinematic' && !forceBalanced;
    const isCinematicStable = isCinematicRequested && !safetyClamp;
    const dprRange: [number, number] = isCinematicRequested
        ? (isCinematicStable ? [1, 1.45] : [1, 1.25])
        : [1, 1.2];
    const postFxEnabled = isCinematicRequested && !safetyClamp;
    const sceneQuality = isCinematicRequested ? 'cinematic' : 'balanced';

    const handleSafetyClamp = useCallback(() => {
        setSafetyClamp(true);
    }, []);

    const hardFallbackToBalanced = useCallback(() => {
        setSafetyClamp(true);
        setGraphicsQuality('balanced');
    }, [setGraphicsQuality]);

    return (
        <Canvas
            key={isCinematicRequested ? (safetyClamp ? 'cinematic-safe' : 'cinematic') : 'balanced'}
            camera={{ position: [0, 8, 40], fov: 45, near: 0.1, far: 300 }}
            gl={{
                antialias: false,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
            }}
            shadows={isCinematicStable}
            dpr={dprRange}
            style={{ width: '100%', height: '100%' }}
            onCreated={({ gl, camera }) => {
                camera.lookAt(0, 0, 0);
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = isCinematicRequested ? 1.46 : 1.32;
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.shadowMap.enabled = isCinematicStable;
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
                // Final guard: if driver reports very low multisample support, avoid heavy mode.
                const maxSamples = gl.capabilities.maxSamples ?? 0;
                if (isCinematicRequested && maxSamples < 2) {
                    hardFallbackToBalanced();
                }
            }}
        >
            <color attach="background" args={['#02050b']} />
            <ambientLight intensity={isCinematicRequested ? 0.22 : 0.18} />
            <hemisphereLight args={['#9ec3ef', '#08101c', isCinematicRequested ? 0.48 : 0.38]} />
            <directionalLight
                position={[26, 18, -10]}
                intensity={isCinematicRequested ? 0.52 : 0.34}
                color="#8db4ff"
                castShadow={isCinematicStable}
                shadow-mapSize-width={isCinematicStable ? 1024 : 512}
                shadow-mapSize-height={isCinematicStable ? 1024 : 512}
            />
            <pointLight
                position={[0, 0, 0]}
                intensity={isCinematicRequested ? 15.4 : 12.6}
                distance={260}
                decay={1.1}
                color="#ffd780"
                castShadow={false}
            />
            <pointLight
                position={[0, 0, 0]}
                intensity={isCinematicRequested ? 4.3 : 3.2}
                distance={260}
                decay={0.75}
                color="#fff1d8"
            />

            <Suspense fallback={<group><mesh><sphereGeometry args={[2, 16, 16]} /><meshBasicMaterial color="red" /></mesh></group>}>
                <RuntimeStabilityGuard enabled={isCinematicRequested} onClamp={handleSafetyClamp} />
                <LoadingBridge />
                <Environment resolution={isCinematicRequested ? 256 : 128}>
                    <Lightformer
                        intensity={isCinematicRequested ? 1.9 : 1.35}
                        color="#ffd79d"
                        position={[0, 0, -12]}
                        scale={[12, 12, 1]}
                    />
                    <Lightformer
                        intensity={isCinematicRequested ? 0.72 : 0.5}
                        color="#8eb8ff"
                        position={[38, 12, -42]}
                        scale={[20, 20, 1]}
                    />
                    <Lightformer
                        intensity={isCinematicRequested ? 0.52 : 0.36}
                        color="#6f8ac2"
                        position={[-36, -14, 30]}
                        scale={[18, 18, 1]}
                    />
                </Environment>
                <Starfield quality={sceneQuality} />
                <Sun quality={sceneQuality} />
                <AsteroidFlyby quality={sceneQuality} />

                {planets.map((planet, i) => (
                    <group key={planet.id}>
                        <Orbit radius={planet.orbitRadius} index={i} quality={sceneQuality} />
                        <Planet data={planet} index={i} quality={sceneQuality} />
                    </group>
                ))}

                <SpaceshipTravel />

                {postFxEnabled && (
                    <EffectComposer multisampling={0} enableNormalPass={false}>
                        <Bloom
                            luminanceThreshold={0.16}
                            luminanceSmoothing={0.9}
                            intensity={1.42}
                            mipmapBlur={false}
                        />
                        <Noise premultiply opacity={0.015} />
                        <Vignette eskil={false} offset={0.1} darkness={0.64} />
                    </EffectComposer>
                )}
            </Suspense>
        </Canvas>
    );
}
