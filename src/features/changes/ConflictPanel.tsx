import type { Conflict } from '../../domain/conflicts';

const KIND_ICON: Record<Conflict['kind'], string> = {
  attendee_overlap: '👥',
  speaker_transition: '🚶',
  venue_clash: '🏛️',
};

interface Props {
  conflicts: Conflict[];
  onProceed: () => void;
  onCancel: () => void;
}

export function ConflictPanel({ conflicts, onProceed, onCancel }: Props) {
  if (conflicts.length === 0) return null;

  const high = conflicts.filter((c) => c.severity === 'high').length;
  const medium = conflicts.length - high;

  return (
    <div className="conflict-backdrop">
      <div className="conflict-panel" role="dialog" aria-modal="true">
        <header className="conflict-head">
          <div>
            <div className="conflict-eyebrow">Conflict detected</div>
            <h3 className="conflict-title">
              This change would break {conflicts.length}{' '}
              {conflicts.length === 1 ? 'thing' : 'things'}
            </h3>
            <div className="conflict-meta">
              {high > 0 && (
                <span className="pill pill-high">{high} critical</span>
              )}
              {medium > 0 && (
                <span className="pill pill-medium">{medium} warning</span>
              )}
            </div>
          </div>
        </header>

        <div className="conflict-list">
          {conflicts.map((c, i) => (
            <div key={i} className={`conflict-item sev-${c.severity}`}>
              <div className="conflict-icon">{KIND_ICON[c.kind]}</div>
              <div className="conflict-content">
                <div className="conflict-message">{c.message}</div>
                <div className="conflict-detail">{c.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <footer className="conflict-actions">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel change
          </button>
          <button className="btn btn-danger" onClick={onProceed}>
            Proceed anyway
          </button>
        </footer>
      </div>
    </div>
  );
}