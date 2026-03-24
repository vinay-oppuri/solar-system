'use client';

import { Stars } from '@react-three/drei';
import { GraphicsQuality } from '@/store/useStore';

interface StarfieldProps {
    quality: GraphicsQuality;
}

export default function Starfield({ quality }: StarfieldProps) {
    const isCinematic = quality === 'cinematic';

    return (
        <Stars
            radius={isCinematic ? 140 : 100}
            depth={isCinematic ? 90 : 50}
            count={isCinematic ? 5200 : 2600}
            factor={isCinematic ? 4.5 : 3}
            saturation={0}
            fade
            speed={isCinematic ? 0.55 : 0.35}
        />
    );
}
