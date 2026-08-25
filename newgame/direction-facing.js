// Improved four-way facing art for Little Farmer.
// Adds fuller side/back pixel poses over the existing character while preserving
// drag-anywhere movement and the running animation layer.
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

  function rect(x, y, w, h, color) {
    X.fillStyle = color;
    X.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawBackPose() {
    const x = p.x, y = p.y;
    X.save();
    // Hair / hat back.
    rect(x - 15, y - 39, 30, 7, '#38242e');
    rect(x - 18, y - 33, 36, 12, '#1c0a18');
    rect(x - 14, y - 22, 28, 5, '#6b4749');
    // Shirt back and shoulders.
    rect(x - 16, y - 17, 32, 8, '#662623');
    rect(x - 19, y - 9, 38, 19, '#6b4749');
    rect(x - 22, y - 7, 6, 15, '#e68e5b');
    rect(x + 16, y - 7, 6, 15, '#e68e5b');
    // Belt / pants.
    rect(x - 16, y + 10, 32, 5, '#4a2123');
    rect(x - 14, y + 15, 12, 15, '#2f2f35');
    rect(x + 2, y + 15, 12, 15, '#2f2f35');
    rect(x - 15, y + 29, 13, 5, '#1c0a18');
    rect(x + 2, y + 29, 13, 5, '#1c0a18');
    X.restore();
  }

  function drawSidePose(dir) {
    const x = p.x, y = p.y;
    X.save();
    // Side-facing hat/hair silhouette.
    rect(x - 14, y - 39, 27, 6, '#38242e');
    rect(x - 12, y - 33, 25, 14, '#1c0a18');
    rect(x + dir * 10 - (dir < 0 ? 5 : 0), y - 31, 5, 10, '#e68e5b');
    // One visible eye toward movement direction.
    rect(x + dir * 11 - (dir < 0 ? 2 : 0), y - 28, 2, 2, '#000000');
    // Torso turned sideways.
    rect(x - 12, y - 18, 24, 26, '#6b4749');
    rect(x - 10, y + 8, 20, 5, '#4a2123');
    // Arms swing front/back depending on run phase.
    const swing = Math.sin((typeof walk === 'number' ? walk : 0) * 2.5) * 4;
    rect(x + dir * 10 - (dir < 0 ? 5 : 0), y - 12 + swing, 5, 17, '#e68e5b');
    rect(x - dir * 15 - (dir > 0 ? 0 : 5), y - 11 - swing, 5, 15, '#e68e5b');
    // Side-view legs with alternating stride.
    const stride = Math.sin((typeof walk === 'number' ? walk : 0) * 3) * 4;
    rect(x - 8 + stride, y + 13, 8, 18, '#2f2f35');
    rect(x + 1 - stride, y + 13, 8, 18, '#2f2f35');
    rect(x - 9 + stride, y + 29, 9, 5, '#1c0a18');
    rect(x + 1 - stride, y + 29, 9, 5, '#1c0a18');
    X.restore();
  }

  function drawDirectionalPose() {
    if (facing === 'up') drawBackPose();
    else if (facing === 'left') drawSidePose(-1);
    else if (facing === 'right') drawSidePose(1);
    // Down uses the detailed original front-facing sprite.
  }

  player = function directionalPlayer(dt) {
    updateFacing();
    animatedPlayer(dt);
    drawDirectionalPose();
  };

  window.littleFarmerFacing = () => facing;
})();
