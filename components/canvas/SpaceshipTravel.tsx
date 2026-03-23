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

    useEffect(() => {
        if (phase === 'traveling' && selectedPlanet) {
            const tl = gsap.timeline({
                onComplete: () => {
                    setPhase('arrived');
                }
            });

            const targetPos = cameraTarget;
            const dist = selectedPlanet.size * 3 + 2;
            const direction = new THREE.Vector3().subVectors(camera.position, targetPos).normalize();
            const finalCameraPos = new THREE.Vector3().copy(targetPos).add(direction.multiplyScalar(dist));

            // 1. Pull back
            tl.to(camera.position, {
                z: camera.position.z + 20,
                y: camera.position.y + 5,
                duration: 0.8,
                ease: 'power1.inOut'
            })
                // 2 & 3. Rush forward
                .to(camera.position, {
                    x: finalCameraPos.x,
                    y: finalCameraPos.y,
                    z: finalCameraPos.z,
                    duration: 3.7,
                    ease: 'power3.inOut', // using power3 for a rushing feel
                    onUpdate: () => {
                        camera.lookAt(targetPos);
                    }
                }, '+=0');

            // We start arrived state right after
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
