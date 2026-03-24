'use client';
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import * as THREE from 'three';

export default function SpaceshipTravel() {
    const { camera } = useThree();
    const phase = useStore(state => state.phase);
    const setPhase = useStore(state => state.setPhase);
    const cameraTarget = useStore(state => state.cameraTarget);
    const selectedPlanet = useStore(state => state.selectedPlanet);
    const orbitAngle = useRef(0);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        camera.lookAt(0, 0, 0);
    }, [camera]);

    useEffect(() => {
        timelineRef.current?.kill();
        timelineRef.current = null;

        if (phase === 'traveling' && selectedPlanet) {
            orbitAngle.current = 0;
            const tl = gsap.timeline({
                onComplete: () => {
                    setPhase('arrived');
                }
            });
            timelineRef.current = tl;

            const targetPos = cameraTarget.clone();
            const dist = selectedPlanet.size * 3 + 2;
            const startPos = camera.position.clone();
            let pullbackDirection = new THREE.Vector3().subVectors(startPos, targetPos);
            if (pullbackDirection.lengthSq() < 0.0001) {
                pullbackDirection = new THREE.Vector3(0, 0, 1);
            } else {
                pullbackDirection.normalize();
            }
            const pullbackPos = startPos
                .clone()
                .add(pullbackDirection.clone().multiplyScalar(20))
                .add(new THREE.Vector3(0, 4.5, 0));
            const finalCameraPos = new THREE.Vector3();

            // 1. Pull back from current camera position.
            tl.to(camera.position, {
                x: pullbackPos.x,
                y: pullbackPos.y,
                z: pullbackPos.z,
                duration: 0.9,
                ease: 'power2.inOut',
                onUpdate: () => {
                    camera.lookAt(targetPos);
                }
            })
                // 2. Zoom in from the exact pullback location.
                .to(camera.position, {
                    duration: 3.6,
                    ease: 'power3.inOut',
                    onStart: () => {
                        const approachDirection = new THREE.Vector3()
                            .subVectors(camera.position, targetPos)
                            .normalize();
                        finalCameraPos
                            .copy(targetPos)
                            .add(approachDirection.multiplyScalar(dist))
                            .add(new THREE.Vector3(0, selectedPlanet.size * 0.25, 0));
                    },
                    x: () => finalCameraPos.x,
                    y: () => finalCameraPos.y,
                    z: () => finalCameraPos.z,
                    onUpdate: () => {
                        camera.lookAt(targetPos);
                    }
                });
        } else if (phase === 'idle') {
            gsap.to(camera.position, {
                x: 0, y: 8, z: 40,
                duration: 1.5,
                ease: 'power2.inOut',
                onUpdate: () => {
                    camera.lookAt(0, 0, 0);
                }
            });
        }

        return () => {
            timelineRef.current?.kill();
            timelineRef.current = null;
        };
    }, [phase, cameraTarget, selectedPlanet, camera, setPhase]);

    // Handled slow orbit around planet when arrived
    useFrame((state, delta) => {
        if (phase === 'arrived' && selectedPlanet) {
            orbitAngle.current += delta * 0.1;
            const dist = selectedPlanet.size * 3 + 2;
            const targetPos = cameraTarget;

            // Slow circle around the target
            camera.position.x = targetPos.x + Math.cos(orbitAngle.current) * dist;
            camera.position.z = targetPos.z + Math.sin(orbitAngle.current) * dist;
            // keep y stable relative to the planet
            camera.lookAt(targetPos);
        }
    });

    return null;
}
