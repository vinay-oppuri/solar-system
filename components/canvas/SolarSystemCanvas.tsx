'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { planets } from '@/data/planets';
import Sun from './Sun';
import Planet from './Planet';
import Orbit from './Orbit';
import Starfield from './Starfield';
import SpaceshipTravel from './SpaceshipTravel';
import { Suspense, useEffect, useState } from 'react';
import LoadingBridge from './LoadingBridge';


export default function SolarSystemCanvas() {
    const [effectsEnabled, setEffectsEnabled] = useState(false);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isLikelyHighCostDisplay = window.devicePixelRatio > 1.5;
        // Bloom/vignette can be unstable on some laptop GPUs at high DPR.
        setEffectsEnabled(!reducedMotion && !isLikelyHighCostDisplay);
    }, []);

    return (
        <Canvas
            camera={{ position: [0, 8, 40], fov: 45, near: 0.1, far: 300 }}
            gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                stencil: false,
            }}
            dpr={[1, 1.35]}
            style={{ width: '100%', height: '100%' }}
            onCreated={({ camera }) => {
                camera.lookAt(0, 0, 0);
            }}
        >
            <color attach="background" args={['#020408']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={2.5} distance={150} decay={1.5} color="#ffd700" />

            <Suspense fallback={<group><mesh><sphereGeometry args={[2, 16, 16]} /><meshBasicMaterial color={"red"} /></mesh></group>}>
                <LoadingBridge />
                <Starfield />
                <Sun />

                {planets.map((planet, i) => (
                    <group key={planet.id}>
                        <Orbit radius={planet.orbitRadius} index={i} />
                        <Planet data={planet} index={i} />
                    </group>
                ))}

                <SpaceshipTravel />

                {effectsEnabled && (
                    <EffectComposer multisampling={0} enableNormalPass={false}>
                        <Bloom
                            luminanceThreshold={0.24}
                            luminanceSmoothing={0.85}
                            intensity={1.05}
                            mipmapBlur={false}
                        />
                        <Vignette eskil={false} offset={0.08} darkness={0.95} />
                    </EffectComposer>
                )}
            </Suspense>
        </Canvas>
    );
}
