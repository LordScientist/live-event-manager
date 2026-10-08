/**
 * 2026 Interactive 3D Spotlight & Perspective Engine
 * Inspired by tactile spatial glass UI & award-winning 3D microinteractions
 * Computes --mouse-x, --mouse-y, --tilt-x, and --tilt-y for GPU-accelerated specular spotlights
 */

export function initCardSpotlights(): () => void {
  const selector = '.card, .event-card, .stat-card, .overview-stat-card, .my-event-card-item, .active-event-quicklink, .category-bento-tile';

  const handlePointerMove = (e: PointerEvent) => {
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
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Calculate subtle 3D tilt (-4.5deg to +4.5deg)
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
      } else {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      }
    });
  };

  const handlePointerLeave = () => {
    const cards = document.querySelectorAll<HTMLElement>(selector);
    cards.forEach((card) => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  document.addEventListener('mouseleave', handlePointerLeave, { passive: true });

  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('mouseleave', handlePointerLeave);
  };
}
