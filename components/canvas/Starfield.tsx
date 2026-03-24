'use client';

import { Stars } from '@react-three/drei';

export default function Starfield() {
    return (
        <Stars
            radius={100}
            depth={50}
            count={2600}
            factor={3}
            saturation={0}
            fade
            speed={0.35}
        />
    );
}
