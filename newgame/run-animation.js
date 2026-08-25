// Running animation layer for Little Farmer.
// Adds bounce, alternating footsteps, and small dust puffs while moving.
(() => {
  if (typeof player !== 'function') return;

  const basePlayer = player;
  let phase = 0;
  let dustTimer = 0;
  const dust = [];

  function movingAmount() {
    return Math.min(1, Math.hypot(joy.x || 0, joy.y || 0));
  }

  function spawnDust() {
    const speed = movingAmount();
    if (speed < 0.35) return;
    const backX = p.x - (joy.x || 0) * 10;
    const backY = p.y - (joy.y || 0) * 6 + 18;
    dust.push({
      x: backX + (Math.random() - 0.5) * 8,
      y: backY + (Math.random() - 0.5) * 4,
      life: 1,
      size: 2 + Math.random() * 2
    });
    if (dust.length > 18) dust.shift();
  }

  function drawDust(dt) {
    for (let i = dust.length - 1; i >= 0; i--) {
      const d = dust[i];
      d.life -= dt * 0.0028;
      d.y += dt * 0.01;
      if (d.life <= 0) {
        dust.splice(i, 1);
        continue;
      }
      X.save();
      X.globalAlpha = Math.max(0, d.life) * 0.32;
      X.fillStyle = '#d8c08d';
      X.fillRect(d.x, d.y, d.size, d.size);
      X.restore();
    }
  }

  player = function animatedPlayer(dt) {
    const speed = movingAmount();
    const moving = speed > 0.12;

    if (moving) {
      phase += dt * (0.018 + speed * 0.012);
      dustTimer += dt;
      if (dustTimer > 120) {
        dustTimer = 0;
        spawnDust();
      }
    } else {
      dustTimer = 0;
    }

    drawDust(dt);

    const originalX = p.x;
    const originalY = p.y;

    if (moving) {
      // Body bounce and tiny side-to-side shift make the fixed pixel sprite feel alive.
      p.y += Math.sin(phase * 2) * 2.2 * speed;
      p.x += Math.cos(phase) * 0.7 * speed;
    }

    basePlayer(dt);

    // Alternating boot motion over the existing sprite.
    if (moving) {
      const step = Math.sin(phase * 2);
      X.save();
      X.fillStyle = '#2f2f35';
      X.fillRect(originalX - 9 + step * 2.5, originalY + 7, 7, 4);
      X.fillRect(originalX + 2 - step * 2.5, originalY + 7, 7, 4);
      X.restore();
    }

    p.x = originalX;
    p.y = originalY;
  };
})();
