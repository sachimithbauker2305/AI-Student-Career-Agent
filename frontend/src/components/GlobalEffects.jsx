import React, { useEffect } from 'react';

export default function GlobalEffects() {
  useEffect(() => {
    const root = document.body;
    let lastRipple = 0;

    const handlePointerMove = (event) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`);
      root.style.setProperty('--pointer-y', `${event.clientY}px`);
    };

    const handleClick = (event) => {
      const now = Date.now();
      if (now - lastRipple < 90) return;
      lastRipple = now;

      const target = event.target?.closest?.('button, a, [role="button"], input, select, textarea');
      if (!target || target.disabled) return;

      const ripple = document.createElement('span');
      ripple.className = 'global-click-ripple';
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      document.body.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 650);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      root.style.removeProperty('--pointer-x');
      root.style.removeProperty('--pointer-y');
    };
  }, []);

  return (
    <div className="global-ambient-layer" aria-hidden="true">
      <span className="global-ambient-orb global-ambient-orb-one" />
      <span className="global-ambient-orb global-ambient-orb-two" />
      <span className="global-ambient-orb global-ambient-orb-three" />
      <span className="global-ambient-dot global-ambient-dot-one" />
      <span className="global-ambient-dot global-ambient-dot-two" />
      <span className="global-ambient-dot global-ambient-dot-three" />
      <span className="global-pointer-glow" />
    </div>
  );
}
