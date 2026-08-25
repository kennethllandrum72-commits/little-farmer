// Four-way facing for Little Farmer.
// Keeps the existing run animation but makes the character visibly face the
// dominant movement direction: down, up, left, or right.
(() => {
  if (typeof player !== 'function') return;

  const animatedPlayer = player;
  let facing = 'down';

  function updateFacing() {
    const x = Number(joy.x || 0);
    const y = Number(joy.y || 0);
    if (Math.abs(x) + Math.abs(y) < 0.12) return;

    if (Math.abs(x) > Math.abs(y)) facing = x < 0 ? 'left' : 'right';
    else facing = y < 0 ? 'up' : 'down';
  }

  function drawFacingCue() {
    // Add a lightweight directional treatment over the existing pixel sprite.
    // Down keeps the normal front view. Up covers the facial area to read as a
    // back view. Left/right add a side-facing cap/face profile cue.
    X.save();

    if (facing === 'up') {
      X.fillStyle = '#1c0a18';
      X.fillRect(p.x - 15, p.y - 35, 30, 14);
      X.fillStyle = '#38242e';
      X.fillRect(p.x - 12, p.y - 39, 24, 6);
      X.fillStyle = '#6b4749';
      X.fillRect(p.x - 9, p.y - 21, 18, 6);
    } else if (facing === 'left' || facing === 'right') {
      const dir = facing === 'left' ? -1 : 1;
      X.fillStyle = '#38242e';
      X.fillRect(p.x - 13 + dir * 2, p.y - 39, 26, 6);
      X.fillStyle = '#e68e5b';
      X.fillRect(p.x + dir * 7, p.y - 31, 5 * dir, 8);
      X.fillStyle = '#000';
      X.fillRect(p.x + dir * 8, p.y - 29, 2 * dir, 2);
    }

    X.restore();
  }

  player = function directionalPlayer(dt) {
    updateFacing();
    animatedPlayer(dt);
    drawFacingCue();
  };

  window.littleFarmerFacing = () => facing;
})();
