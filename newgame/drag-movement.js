// Drag-anywhere mobile movement for Little Farmer.
// Touch anywhere outside an interactive control, then slide in the direction
// you want the player to run. Screen direction maps directly to world direction.
(() => {
  const joystick = document.getElementById('joy');
  const stick = document.getElementById('stick');
  if (!joystick || !stick) return;

  // Keep the joystick as a visual direction indicator, but movement no longer
  // requires the player to start their touch inside it.
  joystick.style.pointerEvents = 'none';
  joystick.style.opacity = '0.72';

  let activeTouchId = null;
  let startX = 0;
  let startY = 0;
  const maxDrag = 64;
  const deadZone = 7;

  function isInteractive(target) {
    return !!target.closest('button, input, select, textarea, a, [role="button"]');
  }

  function resetMovement() {
    activeTouchId = null;
    joy.x = 0;
    joy.y = 0;
    stick.style.transform = '';
  }

  function applyMovement(clientX, clientY) {
    const dx = clientX - startX;
    const dy = clientY - startY;
    const distance = Math.hypot(dx, dy);

    if (distance < deadZone) {
      joy.x = 0;
      joy.y = 0;
      stick.style.transform = '';
      return;
    }

    const strength = Math.min(1, distance / maxDrag);
    joy.x = (dx / distance) * strength;
    joy.y = (dy / distance) * strength;

    // Visual feedback only. Positive X = right, positive Y = down.
    stick.style.transform = `translate(${joy.x * 28}px, ${joy.y * 28}px)`;
  }

  document.addEventListener('touchstart', (event) => {
    if (activeTouchId !== null || isInteractive(event.target)) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    activeTouchId = touch.identifier;
    startX = touch.clientX;
    startY = touch.clientY;
    joy.x = 0;
    joy.y = 0;
  }, { passive: true, capture: true });

  document.addEventListener('touchmove', (event) => {
    if (activeTouchId === null) return;
    const touch = Array.from(event.touches).find(t => t.identifier === activeTouchId);
    if (!touch) return;
    event.preventDefault();
    applyMovement(touch.clientX, touch.clientY);
  }, { passive: false, capture: true });

  document.addEventListener('touchend', (event) => {
    if (activeTouchId === null) return;
    const ended = Array.from(event.changedTouches).some(t => t.identifier === activeTouchId);
    if (ended) resetMovement();
  }, { passive: true, capture: true });

  document.addEventListener('touchcancel', resetMovement, { passive: true, capture: true });
})();
