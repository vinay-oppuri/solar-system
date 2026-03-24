'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { planets } from '@/data/planets';
import Sun from './Sun';
import Planet from './Planet';
import Orbit from './Orbit';
import Starfield from './Starfield';
import SpaceshipTravel from './SpaceshipTravel';
import * as THREE from 'three';
import { Suspense, useEffect, useState } from 'react';
import LoadingBridge from './LoadingBridge';
import { useStore } from '@/store/useStore';

export default function SolarSystemCanvas() {
    const graphicsQuality = useStore(state => state.graphicsQuality);
    const [forceBalanced, setForceBalanced] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
        const cpuCores = navigator.hardwareConcurrency ?? 8;
        // Hard fallback only for very constrained hardware or reduced-motion preference.
        setForceBalanced(reducedMotion || (memory !== undefined && memory <= 2) || cpuCores <= 2);
    }, []);

    const isCinematic = graphicsQuality === 'cinematic' && !forceBalanced;
    const dprRange: [number, number] = isCinematic ? [1, 1.8] : [1, 1.35];

    return (
        <Canvas
            key={isCinematic ? 'cinematic' : 'balanced'}
            camera={{ position: [0, 8, 40], fov: 45, near: 0.1, far: 300 }}
            gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
            }}
            shadows={isCinematic}
            dpr={dprRange}
            style={{ width: '100%', height: '100%' }}
            onCreated={({ gl, camera }) => {
                camera.lookAt(0, 0, 0);
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = isCinematic ? 1.22 : 1.08;
                gl.outputColorSpace = THREE.SRGBColorSpace;
                gl.shadowMap.enabled = isCinematic;
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
        >
            <color attach="background" args={['#020408']} />
            <fog attach="fog" args={['#020408', 105, 240]} />
            <ambientLight intensity={isCinematic ? 0.25 : 0.2} />
            <hemisphereLight args={['#7fa7ff', '#04070f', isCinematic ? 0.52 : 0.38]} />
            <directionalLight
                position={[26, 18, -10]}
                intensity={isCinematic ? 0.5 : 0.28}
                color="#8db4ff"
            />
            <pointLight
                position={[0, 0, 0]}
                intensity={isCinematic ? 2.9 : 2.5}
                distance={160}
                decay={1.35}
                color="#ffd780"
                castShadow={isCinematic}
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0004}
            />

            <Suspense fallback={<group><mesh><sphereGeometry args={[2, 16, 16]} /><meshBasicMaterial color="red" /></mesh></group>}>
                <LoadingBridge />
                <Starfield quality={isCinematic ? 'cinematic' : 'balanced'} />
                <Sun quality={isCinematic ? 'cinematic' : 'balanced'} />

                {planets.map((planet, i) => (
                    <group key={planet.id}>
                        <Orbit radius={planet.orbitRadius} index={i} />
                        <Planet data={planet} index={i} quality={isCinematic ? 'cinematic' : 'balanced'} />
                    </group>
                ))}

                <SpaceshipTravel />

                <EffectComposer multisampling={isCinematic ? 4 : 0} enableNormalPass={false}>
                    <Bloom
                        luminanceThreshold={isCinematic ? 0.16 : 0.24}
                        luminanceSmoothing={isCinematic ? 0.9 : 0.85}
                        intensity={isCinematic ? 1.5 : 1.05}
                        mipmapBlur={isCinematic}
                    />
                    <Noise premultiply opacity={isCinematic ? 0.045 : 0.018} />
                    <Vignette eskil={false} offset={0.1} darkness={isCinematic ? 1.06 : 0.9} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    );
}
