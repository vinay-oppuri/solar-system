const https = require('https');
const fs = require('fs');
const path = require('path');

const textures = [
    { url: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg', filename: 'mercury.jpg' },
    { url: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg', filename: 'venus.jpg' },
    { url: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg', filename: 'earth.jpg' },
    { url: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg', filename: 'mars.jpg' },
    { url: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg', filename: 'jupiter.jpg' },
    { url: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg', filename: 'saturn.jpg' },
    { url: 'https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png', filename: 'saturn_ring.png' },
    { url: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg', filename: 'uranus.jpg' },
    { url: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg', filename: 'neptune.jpg' }
];

const targetDir = path.join(__dirname, 'public', 'textures');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function main() {
    console.log(`Resolving textures to and from ${targetDir}`);
    for (const tex of textures) {
        const dest = path.join(targetDir, tex.filename);
        console.log(`Downloading ${tex.url}...`);
        try {
            await download(tex.url, dest);
            console.log(`Successfully downloaded ${tex.filename}`);
        } catch (err) {
            console.error(`Error downloading ${tex.filename}:`, err.message);
        }
    }
}

main();
