export type PlanetType = 'Terrestrial' | 'Gas Giant' | 'Ice Giant' | 'Dwarf';

export interface Planet {
    id: string;
    name: string;
    textureUrl: string;
    orbitRadius: number;
    size: number;
    orbitalSpeed: number;
    rotationSpeed: number;
    axialTilt: number;
    hasRings: boolean;
    ringTextureUrl?: string;
    color: string;
    type: PlanetType;
    distanceAU: number;
    diameterKm: number;
    massKg: string;
    gravityMs2: number;
    dayLength: string;
    yearLength: string;
    avgTempC: number;
    moons: number;
    atmosphere: string[];
    funFacts: string[];
    description: string;
}

export const planets: Planet[] = [
    {
        id: 'mercury',
        name: 'Mercury',
        textureUrl: '/textures/mercury.jpg?v=1',
        orbitRadius: 10,
        size: 0.8,
        orbitalSpeed: 0.8,
        rotationSpeed: 0.05,
        axialTilt: 0.034,
        hasRings: false,
        color: '#8c8c8c',
        type: 'Terrestrial',
        distanceAU: 0.39,
        diameterKm: 4879,
        massKg: '3.30 × 10^23',
        gravityMs2: 3.7,
        dayLength: '176 Earth days',
        yearLength: '88 Earth days',
        avgTempC: 167,
        moons: 0,
        atmosphere: ['Oxygen', 'Sodium', 'Hydrogen'],
        funFacts: [
            'Smallest planet in our solar system.',
            'Has a heavily cratered surface akin to Earth\'s moon.',
            'Experiences extreme temperature fluctuations.'
        ],
        description: 'Mercury is the closest planet to the Sun and the smallest planet in our solar system. It has no moons and no significant atmosphere, resulting in extreme temperature variations between its day and night sides.'
    },
    {
        id: 'venus',
        name: 'Venus',
        textureUrl: '/textures/venus.jpg?v=1',
        orbitRadius: 15,
        size: 1.5,
        orbitalSpeed: 0.6,
        rotationSpeed: -0.02,
        axialTilt: 177.36,
        hasRings: false,
        color: '#e3bb76',
        type: 'Terrestrial',
        distanceAU: 0.72,
        diameterKm: 12104,
        massKg: '4.87 × 10^24',
        gravityMs2: 8.87,
        dayLength: '243 Earth days',
        yearLength: '225 Earth days',
        avgTempC: 464,
        moons: 0,
        atmosphere: ['Carbon Dioxide', 'Nitrogen'],
        funFacts: [
            'Hottest planet in the solar system due to a runaway greenhouse effect.',
            'Rotates in the opposite direction to most planets.',
            'Often called Earth\'s "sister planet" due to its similar size.'
        ],
        description: 'Venus is the second planet from the Sun and is covered in thick, toxic clouds of sulfuric acid. Its dense atmosphere traps heat, making it the hottest planet in our solar system.',
    },
    {
        id: 'earth',
        name: 'Earth',
        textureUrl: '/textures/earth.jpg?v=1',
        orbitRadius: 21,
        size: 1.6,
        orbitalSpeed: 0.5,
        rotationSpeed: 0.1,
        axialTilt: 23.44,
        hasRings: false,
        color: '#4fc3f7',
        type: 'Terrestrial',
        distanceAU: 1,
        diameterKm: 12742,
        massKg: '5.97 × 10^24',
        gravityMs2: 9.8,
        dayLength: '24 hours',
        yearLength: '365.25 days',
        avgTempC: 15,
        moons: 1,
        atmosphere: ['Nitrogen', 'Oxygen', 'Argon'],
        funFacts: [
            'The only known planet to harbor life.',
            'Surface is about 71% water.',
            'Its atmosphere protects the planet from incoming meteoroids.'
        ],
        description: 'Our home planet, Earth, is the third planet from the Sun and the only place we know of so far that\'s inhabited by living things.',
    },
    {
        id: 'mars',
        name: 'Mars',
        textureUrl: '/textures/mars.jpg?v=1',
        orbitRadius: 28,
        size: 1.1,
        orbitalSpeed: 0.4,
        rotationSpeed: 0.09,
        axialTilt: 25.19,
        hasRings: false,
        color: '#ff6b35',
        type: 'Terrestrial',
        distanceAU: 1.52,
        diameterKm: 6779,
        massKg: '6.39 × 10^23',
        gravityMs2: 3.71,
        dayLength: '24.6 hours',
        yearLength: '687 Earth days',
        avgTempC: -65,
        moons: 2,
        atmosphere: ['Carbon Dioxide', 'Nitrogen', 'Argon'],
        funFacts: [
            'Known as the "Red Planet" due to iron oxide on its surface.',
            'Home to Olympus Mons, the largest volcano in the solar system.',
            'Has two small moons, Phobos and Deimos.'
        ],
        description: 'Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence Mars was—billions of years ago—wetter and warmer, with a thicker atmosphere.',
    },
    {
        id: 'jupiter',
        name: 'Jupiter',
        textureUrl: '/textures/jupiter.jpg?v=1',
        orbitRadius: 40,
        size: 3.5,
        orbitalSpeed: 0.2,
        rotationSpeed: 0.25,
        axialTilt: 3.13,
        hasRings: true,
        color: '#d39c7e',
        type: 'Gas Giant',
        distanceAU: 5.20,
        diameterKm: 139820,
        massKg: '1.90 × 10^27',
        gravityMs2: 24.79,
        dayLength: '9.93 hours',
        yearLength: '11.86 Earth years',
        avgTempC: -110,
        moons: 95,
        atmosphere: ['Hydrogen', 'Helium'],
        funFacts: [
            'The largest planet in the solar system.',
            'The Great Red Spot is a giant storm that has raged for centuries.',
            'Has a faint ring system.'
        ],
        description: 'Jupiter is more than twice as massive as all the other planets combined. Its iconic Great Red Spot is a giant storm bigger than Earth that has raged for hundreds of years.',
    },
    {
        id: 'saturn',
        name: 'Saturn',
        textureUrl: '/textures/saturn.jpg?v=1',
        orbitRadius: 52,
        size: 2.9,
        orbitalSpeed: 0.15,
        rotationSpeed: 0.23,
        axialTilt: 26.73,
        hasRings: true,
        ringTextureUrl: '/textures/saturn_ring.png?v=1',
        color: '#ead6b8',
        type: 'Gas Giant',
        distanceAU: 9.54,
        diameterKm: 116460,
        massKg: '5.68 × 10^26',
        gravityMs2: 10.44,
        dayLength: '10.7 hours',
        yearLength: '29.45 Earth years',
        avgTempC: -140,
        moons: 146,
        atmosphere: ['Hydrogen', 'Helium'],
        funFacts: [
            'Known for its prominent, complex ring system.',
            'Is the least dense planet—it could float in a large enough body of water.',
            'Its moon Titan has a thick atmosphere and liquid methane lakes.'
        ],
        description: 'Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system. The other giant planets have rings, but none are as spectacular as Saturn\'s.',
    },
    {
        id: 'uranus',
        name: 'Uranus',
        textureUrl: '/textures/uranus.jpg?v=1',
        orbitRadius: 65,
        size: 2.0,
        orbitalSpeed: 0.1,
        rotationSpeed: -0.15,
        axialTilt: 97.77,
        hasRings: true,
        color: '#ace5ee',
        type: 'Ice Giant',
        distanceAU: 19.22,
        diameterKm: 50724,
        massKg: '8.68 × 10^25',
        gravityMs2: 8.69,
        dayLength: '17.2 hours',
        yearLength: '84 Earth years',
        avgTempC: -195,
        moons: 28,
        atmosphere: ['Hydrogen', 'Helium', 'Methane'],
        funFacts: [
            'Rotates on its side, unlike any other planet.',
            'Often referred to as an "ice giant" because of its composition.',
            'Has a faint ring system.'
        ],
        description: 'Uranus is the seventh planet from the Sun and has the third-largest diameter in our solar system. It rotates at a nearly 90-degree angle from the plane of its orbit.',
    },
    {
        id: 'neptune',
        name: 'Neptune',
        textureUrl: '/textures/neptune.jpg?v=1',
        orbitRadius: 78,
        size: 1.9,
        orbitalSpeed: 0.08,
        rotationSpeed: 0.16,
        axialTilt: 28.32,
        hasRings: true,
        color: '#5b5ddf',
        type: 'Ice Giant',
        distanceAU: 30.06,
        diameterKm: 49244,
        massKg: '1.02 × 10^26',
        gravityMs2: 11.15,
        dayLength: '16 hours',
        yearLength: '165 Earth years',
        avgTempC: -200,
        moons: 16,
        atmosphere: ['Hydrogen', 'Helium', 'Methane'],
        funFacts: [
            'The farthest known planet from the Sun.',
            'Has the strongest winds in the solar system, up to 2,000 km/h.',
            'Its blue color comes from methane in its atmosphere.'
        ],
        description: 'Dark, cold, and whipped by supersonic winds, ice giant Neptune is the eighth and most distant planet in our solar system. Neptune is the only planet not visible to the naked eye.',
    }
];
