'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { planets } from '@/data/planets';
import Sun from './Sun';
import Planet from './Planet';
import Orbit from './Orbit';
import Starfield from './Starfield';
import SpaceshipTravel from './SpaceshipTravel';
import * as THREE from 'three';
import { Suspense } from 'react';
import LoadingBridge from './LoadingBridge';


export default function SolarSystemCanvas() {
    return (
        <Canvas
            camera={{ position: [0, 8, 40], fov: 45 }}
            gl={{ antialias: false, alpha: false }}
            dpr={[1, 2]}
        >
            <color attach="background" args={['#020408']} />
            <ambientLight intensity={0.1} />
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

                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        intensity={1.5}
                        mipmapBlur
                    />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    );
}
