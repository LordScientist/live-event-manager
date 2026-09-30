import type { ChangeEvent } from 'react';
import { useView, type ViewAs } from '../../app/ViewContext';
import { people } from '../../data/mock/mockData';

export function ViewSwitcher() {
  const { viewAs, setViewAs } = useView();

  const value =
    viewAs.kind === 'organizer' ? 'organizer' : viewAs.personId;

  function onChange(e: ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (v === 'organizer') {
      setViewAs({ kind: 'organizer' });
    } else {
      setViewAs({ kind: 'person', personId: v });
    }
  }

  return (
    <div className="view-switcher">
      <label htmlFor="view-as">Viewing as</label>
      <select id="view-as" value={value} onChange={onChange}>
        <option value="organizer">Organizer — full control</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} · {p.roles[0]}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ViewBanner() {
  const { viewAs } = useView();
  if (viewAs.kind === 'organizer') return null;

  const person = people.find((p) => p.id === viewAs.personId);
  if (!person) return null;

  return (
    <div className="view-banner">
      <span className="view-banner-dot" />
      You are viewing as <strong>{person.name}</strong>{' '}
      <span className={`role-tag role-${person.roles[0]}`}>
        {person.roles[0]}
      </span>
    </div>
  );
}

// Type-only re-export for convenience
export type { ViewAs };