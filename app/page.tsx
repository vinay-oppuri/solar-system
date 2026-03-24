'use client';

import dynamic from 'next/dynamic';

const SolarSystemCanvas = dynamic(() => import('@/components/canvas/SolarSystemCanvas'), { ssr: false });
const HoverCard = dynamic(() => import('@/components/ui/HoverCard'), { ssr: false });
const PlanetDetailPanel = dynamic(() => import('@/components/ui/PlanetDetailPanel'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/ui/LoadingScreen'), { ssr: false });
const GraphicsPreset = dynamic(() => import('@/components/ui/GraphicsPreset'), { ssr: false });

export default function Home() {
    return (
        <main className="w-screen h-screen relative bg-spaceBlack overflow-hidden">
            <div className="absolute inset-0 z-0">
                <SolarSystemCanvas />
            </div>

            <HoverCard />
            <PlanetDetailPanel />
            <GraphicsPreset />
            <LoadingScreen />
        </main>
    );
}
