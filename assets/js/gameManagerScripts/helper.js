const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
    ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

const formatStatName = str => str.split(/(?=[A-Z])/).filter(Boolean).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

function proc(chance) {
    const threshold = Math.random() < chance;
    return threshold
}


function doesCollide(hitbox, mob) {
    return !(
        (hitbox.y + hitbox.h < mob.y) ||
        (hitbox.y > mob.y + mob.h) ||
        (hitbox.x + hitbox.w < mob.x) ||
        (hitbox.x > mob.x + mob.w)
    );
}

function onScreen(obj) {
    const objHitbox = {
        x: player.pos.x + obj.pos.x,
        y: player.pos.y + obj.pos.y,
        w: obj.size.width,
        h: obj.size.height
    }
    const screenPosHitbox = {
        x: 0,
        y: 0,
        w: c.width,
        h: c.height
    }
    return doesCollide(screenPosHitbox, objHitbox)
}

function generateSmoothRainbowColors(timestamp, numColors = 360, baseColor = 25) {
    return Array.from({ length: numColors }, (_, index) => {
        const hue = ((timestamp / 1000) + (index / numColors)) % 1;
        const rgb = hslToRgb(hue, 0.8, 0.5);
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2] + baseColor})`;
    });
}
// Convert HSL to RGB
function hslToRgb(h, s, l) {
    let r, g, b
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}