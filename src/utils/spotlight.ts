/**
 * 2026 Interactive 3D Spotlight Engine
 * Computes --mouse-x, --mouse-y, --tilt-x, and --tilt-y for GPU-accelerated specular spotlights
 * Exclusively active on devices with a fine pointer (mouse/trackpad).
 * Completely bypassed on touch/mobile devices for 120 FPS buttery-smooth scrolling.
 */

export function initCardSpotlights(): () => void {
  // If running in SSR or on a touch/mobile device with no mouse, bypass completely
  if (
    typeof window === 'undefined' ||
    !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ) {
    return () => {};
  }

  const selector =
    '.card, .event-card, .stat-card, .overview-stat-card, .my-event-card-item, .active-event-quicklink, .category-bento-tile, .manager-event-card';

  let currentCard: HTMLElement | null = null;

  const handlePointerMove = (e: PointerEvent) => {
    // Strictly mouse/trackpad pointer
    if (e.pointerType !== 'mouse') return;

    const target = e.target as HTMLElement | null;
    const card = target ? (target.closest(selector) as HTMLElement | null) : null;

    if (card) {
      if (currentCard && currentCard !== card) {
        currentCard.style.setProperty('--tilt-x', '0deg');
        currentCard.style.setProperty('--tilt-y', '0deg');
      }
      currentCard = card;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -4.5;
      const tiltY = ((x - centerX) / centerX) * 4.5;

      card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    } else if (currentCard) {
      currentCard.style.setProperty('--tilt-x', '0deg');
      currentCard.style.setProperty('--tilt-y', '0deg');
      currentCard = null;
    }
  };

  const handlePointerLeave = () => {
    if (currentCard) {
      currentCard.style.setProperty('--tilt-x', '0deg');
      currentCard.style.setProperty('--tilt-y', '0deg');
      currentCard = null;
    }
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('mouseleave', handlePointerLeave);
    if (currentCard) {
      currentCard.style.setProperty('--tilt-x', '0deg');
      currentCard.style.setProperty('--tilt-y', '0deg');
      currentCard = null;
    }
  };
}
