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
            radius={isCinematic ? 145 : 112}
            depth={isCinematic ? 96 : 62}
            count={isCinematic ? 6200 : 3600}
            factor={isCinematic ? 4.2 : 3.2}
            saturation={0}
            fade
            speed={isCinematic ? 0.55 : 0.4}
        />
    );
}
