import { createContext, useContext, useState, type ReactNode } from 'react';

export type ViewAs =
  | { kind: 'organizer' }
  | { kind: 'person'; personId: string };

interface ViewContextValue {
  viewAs: ViewAs;
  setViewAs: (v: ViewAs) => void;
  isOrganizer: boolean;
  currentPersonId: string | null;
}

const ViewContext = createContext<ViewContextValue | null>(null);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [viewAs, setViewAs] = useState<ViewAs>({ kind: 'organizer' });

  const value: ViewContextValue = {
    viewAs,
    setViewAs,
    isOrganizer: viewAs.kind === 'organizer',
    currentPersonId: viewAs.kind === 'person' ? viewAs.personId : null,
  };

  return (
    <ViewContext.Provider value={value}>{children}</ViewContext.Provider>
  );
}

export function useView() {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error('useView must be used inside ViewProvider');
  return ctx;
}