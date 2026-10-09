/**
 * 2026 Interactive Spatial 3D & Spotlight Engine
 * Bridges Desktop Mouse Perspective and Mobile Spatial Interactions:
 * 1. Desktop: Cursor tracking, dynamic specular spotlight & micro-tilt
 * 2. Mobile Gyroscope: Physical device orientation (gamma roll & beta pitch) moves 3D cards & specular glints
 * 3. Mobile Scroll Parallax: Viewport offset & scroll velocity pitch tilt (dynamic leaning into scroll)
 * 4. Mobile Tactile Touch: Active 3D compression and spring return
 */

export interface MobileSpatialTiltDetail {
  tiltX: number;
  tiltY: number;
  gamma: number;
  beta: number;
}

export function initCardSpotlights(): () => void {
  const selector =
    '.card, .event-card, .stat-card, .overview-stat-card, .my-event-card-item, .active-event-quicklink, .category-bento-tile, .manager-event-card';

  // Desktop active hover card tracking
  let activeHoverCard: HTMLElement | null = null;

  // Mobile / Spatial Engine State
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches);

  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  let lastScrollTime = typeof performance !== 'undefined' ? performance.now() : 0;
  let scrollVelocity = 0;
  let isScrolling = false;
  let scrollTimeout: number | null = null;

  let targetGyroTiltX = 0;
  let targetGyroTiltY = 0;
  let currentGyroTiltX = 0;
  let currentGyroTiltY = 0;

  let rafId: number | null = null;
  let isRunning = true;

  // ── 1. Desktop Pointer Tracking ───────────────────────────────────────────
  const handlePointerMove = (e: PointerEvent) => {
    // If it's a touch contact on mobile, let touch interaction / scroll handle it
    if (e.pointerType === 'touch') return;

    const cards = document.querySelectorAll<HTMLElement>(selector);

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // When cursor is within the card bounds
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        activeHoverCard = card;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Calculate subtle desktop 3D tilt (-4.5deg to +4.5deg)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -4.5;
        const tiltY = ((x - centerX) / centerX) * 4.5;

        card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      } else if (
        e.clientX >= rect.left - 80 &&
        e.clientX <= rect.right + 80 &&
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80
      ) {
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      } else if (card === activeHoverCard) {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      }
    });
  };

  const handlePointerLeave = () => {
    activeHoverCard = null;
    const cards = document.querySelectorAll<HTMLElement>(selector);
    cards.forEach((card) => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  };

  // ── 2. Mobile Device Orientation (Gyroscope) ──────────────────────────────
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return;

    // Roll (gamma: left/right tilt -90 to +90)
    // Clamp to ±25 deg, normalize to ±3.8 deg tilt
    const normGamma = Math.max(-25, Math.min(25, e.gamma));
    targetGyroTiltY = (normGamma / 25) * 3.8;

    // Pitch (beta: front/back tilt)
    // Typical mobile holding angle is ~38-42 deg towards user face
    const relativeBeta = Math.max(-25, Math.min(25, e.beta - 40));
    targetGyroTiltX = (relativeBeta / 25) * -3.2;

    // Dispatch custom event for Codi and standalone 3D components
    window.dispatchEvent(
      new CustomEvent<MobileSpatialTiltDetail>('mobile-spatial-tilt', {
        detail: {
          tiltX: targetGyroTiltX,
          tiltY: targetGyroTiltY,
          gamma: e.gamma,
          beta: e.beta
        }
      })
    );
  };

  // ── 3. Mobile Scroll Parallax & Velocity Tracking ─────────────────────────
  const handleScroll = () => {
    const now = performance.now();
    const currentY = window.scrollY;
    const deltaY = currentY - lastScrollY;
    const deltaTime = Math.max(14, now - lastScrollTime);

    // Compute scroll velocity (pixels per ms, scaled)
    scrollVelocity = (deltaY / deltaTime) * 12;
    scrollVelocity = Math.max(-4.5, Math.min(4.5, scrollVelocity));

    lastScrollY = currentY;
    lastScrollTime = now;
    isScrolling = true;

    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout);
    }
    scrollTimeout = window.setTimeout(() => {
      isScrolling = false;
    }, 100);
  };

  // ── 4. Unified RAF Spatial Render Loop ────────────────────────────────────
  const updateSpatialLoop = () => {
    if (!isRunning) return;

    // Smoothly interpolate gyroscope values
    currentGyroTiltX += (targetGyroTiltX - currentGyroTiltX) * 0.12;
    currentGyroTiltY += (targetGyroTiltY - currentGyroTiltY) * 0.12;

    // Smoothly decay scroll velocity when scroll pauses
    if (!isScrolling) {
      scrollVelocity *= 0.88;
      if (Math.abs(scrollVelocity) < 0.04) {
        scrollVelocity = 0;
      }
    }

    // Only update mobile cards when on touch/mobile or screen <= 1024px
    const isMobileView = isTouchDevice || window.innerWidth <= 1024;

    if (isMobileView) {
      const cards = document.querySelectorAll<HTMLElement>(selector);
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      cards.forEach((card) => {
        // Skip card if currently actively hovered by desktop cursor
        if (card === activeHoverCard) return;

        const rect = card.getBoundingClientRect();

        // Cull offscreen elements for maximum battery efficiency
        if (rect.bottom < -60 || rect.top > viewportHeight + 60) return;

        // Compute viewport vertical offset (-1 at top, 0 at center, +1 at bottom)
        const cardCenterY = rect.top + rect.height / 2;
        const normY = Math.max(-1, Math.min(1, (cardCenterY - viewportCenter) / (viewportHeight * 0.65)));

        // Subtle pitch tilt from scroll position + dynamic scroll velocity lean
        const scrollPitch = normY * 2.2 + scrollVelocity * 0.7;

        // Combine gyro tilt + scroll tilt
        const totalTiltX = Math.max(-6, Math.min(6, currentGyroTiltX + scrollPitch));
        const totalTiltY = Math.max(-6, Math.min(6, currentGyroTiltY));

        card.style.setProperty('--tilt-x', `${totalTiltX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${totalTiltY.toFixed(2)}deg`);

        // Move the specular glass sheen glint across the card surface in sync with tilt
        const specularX = rect.width / 2 + (totalTiltY / 4.0) * (rect.width * 0.38);
        const specularY = rect.height / 2 - (totalTiltX / 4.0) * (rect.height * 0.38);
        card.style.setProperty('--mouse-x', `${specularX.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${specularY.toFixed(1)}px`);
      });
    }

    rafId = requestAnimationFrame(updateSpatialLoop);
  };

  // ── Event Listeners Registration ──────────────────────────────────────────
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });

  if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
  }

  // Start smooth spatial RAF loop
  rafId = requestAnimationFrame(updateSpatialLoop);

  // Return Cleanup
  return () => {
    isRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (scrollTimeout) window.clearTimeout(scrollTimeout);

    window.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('mouseleave', handlePointerLeave);
    window.removeEventListener('scroll', handleScroll);

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.removeEventListener('deviceorientation', handleOrientation);
    }
  };
}
