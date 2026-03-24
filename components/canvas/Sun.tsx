'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BackSide, Color, Mesh, ShaderMaterial } from 'three';
import { useStore } from '@/store/useStore';
import gsap from 'gsap';
import { GraphicsQuality } from '@/store/useStore';

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uNoiseScale;
varying vec2 vUv;
varying vec3 vPosition;

// Simple 3D noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) { 
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i); 
  vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  float noise = snoise(vec3(vPosition * uNoiseScale + uTime * 0.2));
  float noise2 = snoise(vec3(vPosition * (uNoiseScale * 2.0) - uTime * 0.4));
  float finalNoise = (noise + noise2) * 0.5 + 0.5;
  
  vec3 color = mix(uColor1, uColor2, finalNoise);
  gl_FragColor = vec4(color, 1.0);
}
`;

const haloVertexShader = `
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;
uniform float uTime;
varying float vWave;
void main() {
  float waveA = sin(position.y * 17.0 + uTime * 2.6);
  float waveB = sin(position.x * 21.0 - uTime * 2.1);
  float wave = waveA * 0.58 + waveB * 0.42;
  vWave = wave;

  vec3 displaced = position + normal * wave * 0.15;
  vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
  vWorldPosition = worldPos.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const haloFragmentShader = `
uniform vec3 uColorInner;
uniform vec3 uColorOuter;
uniform float uIntensity;
uniform float uTime;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying float vWave;
void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDir), 0.0), 2.1);

  // Animated UV turbulence gives visible heat waves without creating a solid shell.
  float heatA = sin(vUv.y * 16.0 + uTime * 2.4);
  float heatB = sin(vUv.x * 22.0 - uTime * 1.8);
  float heat = 0.5 + 0.5 * (heatA * 0.6 + heatB * 0.4);
  float ripple = 0.85 + 0.15 * sin((vUv.x + vUv.y) * 30.0 - uTime * 3.0);
  float wave = mix(0.72, 1.0, clamp(heat, 0.0, 1.0)) * ripple * (0.9 + 0.1 * vWave);
  float rim = smoothstep(0.34, 0.985, fresnel);
  float colorMix = clamp(0.2 + fresnel * 0.68 + (heat - 0.5) * 0.15, 0.0, 1.0);
  vec3 color = mix(uColorInner, uColorOuter, colorMix);
  gl_FragColor = vec4(color, rim * uIntensity * wave);
}
`;

interface SunProps {
    quality: GraphicsQuality;
}

export default function Sun({ quality }: SunProps) {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<ShaderMaterial>(null);
    const haloMaterialRef = useRef<ShaderMaterial>(null);
    const isCinematic = quality === 'cinematic';
    const haloUniforms = useMemo(() => ({
        uColorInner: { value: new Color('#ff9532') },
        uColorOuter: { value: new Color('#ffd36a') },
        uIntensity: { value: isCinematic ? 0.74 : 0.54 },
        uTime: { value: 0 }
    }), [isCinematic]);
    const setPhase = useStore(state => state.setPhase);
    const phase = useStore(state => state.phase);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor1: { value: new Color('#ff6b35') },
        uColor2: { value: new Color('#ffd700') },
        uNoiseScale: { value: 1.5 }
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
        if (haloMaterialRef.current) {
            haloMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    const handlePointerEnter = () => {
        if (phase === 'idle') {
            setPhase('sun-hovered');
            document.body.style.cursor = 'crosshair';
            if (meshRef.current) {
                gsap.to(meshRef.current.scale, { x: 1.1, y: 1.1, z: 1.1, duration: 0.4, ease: 'power2.out' });
            }
        }
    };

    const handlePointerLeave = () => {
        if (phase === 'sun-hovered') {
            document.body.style.cursor = 'auto';
            if (meshRef.current) {
                gsap.to(meshRef.current.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.4, ease: 'power2.out' });
            }
        }
    };

    return (
        <group>
            <mesh
                ref={meshRef}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                castShadow={isCinematic}
            >
                <sphereGeometry args={[4, isCinematic ? 64 : 48, isCinematic ? 64 : 48]} />
                <shaderMaterial
                    ref={materialRef}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                />
            </mesh>

            <mesh scale={isCinematic ? 1.16 : 1.12} raycast={() => null}>
                <sphereGeometry args={[4, isCinematic ? 52 : 42, isCinematic ? 52 : 42]} />
                <shaderMaterial
                    ref={haloMaterialRef}
                    vertexShader={haloVertexShader}
                    fragmentShader={haloFragmentShader}
                    uniforms={haloUniforms}
                    transparent
                    blending={AdditiveBlending}
                    side={BackSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}
