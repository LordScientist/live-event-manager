/**
 * 2026 Interactive Spotlight Engine
 * Tracks pointer coordinates relative to frosted glass cards
 * Sets CSS custom properties `--mouse-x` and `--mouse-y` for GPU-accelerated specular spotlights
 */

export function initCardSpotlights(): () => void {
  const handlePointerMove = (e: PointerEvent) => {
    const cards = document.querySelectorAll<HTMLElement>('.card, .event-card, .stat-card, .overview-stat-card, .my-event-card-item');

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only calculate if the pointer is within reasonable proximity of the card
      if (
        e.clientX >= rect.left - 80 &&
        e.clientX <= rect.right + 80 &&
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80
      ) {
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    });
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });

  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
  };
}
