'use client';

import { Stars } from '@react-three/drei';
import { GraphicsQuality } from '@/store/useStore';

interface StarfieldProps {
    quality: GraphicsQuality;
}

export default function Starfield({ quality }: StarfieldProps) {
    const isCinematic = quality === 'cinematic';

    return (
        <group>
            <Stars
                radius={isCinematic ? 205 : 165}
                depth={isCinematic ? 142 : 106}
                count={isCinematic ? 32000 : 20000}
                factor={isCinematic ? 2.05 : 1.8}
                saturation={0}
                fade
                speed={isCinematic ? 0.12 : 0.1}
            />
            <Stars
                radius={isCinematic ? 146 : 118}
                depth={isCinematic ? 86 : 62}
                count={isCinematic ? 9000 : 5200}
                factor={isCinematic ? 3.7 : 3.1}
                saturation={0.2}
                fade
                speed={isCinematic ? 0.24 : 0.18}
            />
            <Stars
                radius={isCinematic ? 110 : 88}
                depth={isCinematic ? 52 : 36}
                count={isCinematic ? 3400 : 1600}
                factor={isCinematic ? 5.4 : 4.6}
                saturation={0.35}
                fade
                speed={isCinematic ? 0.34 : 0.24}
            />
            <Stars
                radius={isCinematic ? 84 : 68}
                depth={isCinematic ? 28 : 20}
                count={isCinematic ? 460 : 240}
                factor={isCinematic ? 8.2 : 7.2}
                saturation={0.5}
                fade
                speed={isCinematic ? 0.45 : 0.32}
            />
        </group>
    );
}
