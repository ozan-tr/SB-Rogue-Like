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

function onScreen(obj){
    const objHitbox = {
        x: player.pos.x+obj.pos.x,
        y: player.pos.y+obj.pos.y,
        w: obj.size.width,
        h: obj.size.height
    }
    const screenPosHitbox = {
        x: 0,
        y: 0,
        w: c.width,
        h: c.height
    }
    return doesCollide(screenPosHitbox,objHitbox)
}