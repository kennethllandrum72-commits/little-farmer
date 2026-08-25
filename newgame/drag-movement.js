// Drag-anywhere mobile movement for Little Farmer.
// Touch anywhere outside an interactive control, then slide in the direction
// you want the player to run. Screen direction maps directly to world direction.
(() => {
  const joystick = document.getElementById('joy');
  const stick = document.getElementById('stick');
  if (!joystick || !stick) return;

  joystick.style.pointerEvents = 'none';
  joystick.style.opacity = '0.72';

  let activeTouchId = null;
  let startX = 0;
  let startY = 0;
  const maxDrag = 64;
  const deadZone = 7;
  const target = { x: 0, y: 0 };
  const smooth = 0.22;

  function isInteractive(targetEl) {
    return !!targetEl.closest('button, input, select, textarea, a, [role="button"]');
  }

  function setTarget(x, y) {
    target.x = x;
    target.y = y;
  }

  function resetMovement() {
    activeTouchId = null;
    setTarget(0, 0);
  }

  function applyMovement(clientX, clientY) {
    const dx = clientX - startX;
    const dy = clientY - startY;
    const distance = Math.hypot(dx, dy);

    if (distance < deadZone) {
      setTarget(0, 0);
      return;
    }

    const strength = Math.min(1, distance / maxDrag);
    setTarget((dx / distance) * strength, (dy / distance) * strength);
  }

  function smoothMovement() {
    joy.x += (target.x - joy.x) * smooth;
    joy.y += (target.y - joy.y) * smooth;

    if (Math.abs(target.x) < 0.001 && Math.abs(joy.x) < 0.015) joy.x = 0;
    if (Math.abs(target.y) < 0.001 && Math.abs(joy.y) < 0.015) joy.y = 0;

    stick.style.transform = `translate(${joy.x * 28}px, ${joy.y * 28}px)`;
    requestAnimationFrame(smoothMovement);
  }
  requestAnimationFrame(smoothMovement);

  document.addEventListener('touchstart', (event) => {
    if (activeTouchId !== null || isInteractive(event.target)) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    activeTouchId = touch.identifier;
    startX = touch.clientX;
    startY = touch.clientY;
    setTarget(0, 0);
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
