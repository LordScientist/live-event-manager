import { createContext, useContext, type ReactNode } from 'react';
import type { EventDataService } from '../data/EventDataService';
import { MockEventDataService } from '../data/mock/MockEventDataService';

const DataContext = createContext<EventDataService | null>(null);

const service: EventDataService = new MockEventDataService();

export function DataProvider({ children }: { children: ReactNode }) {
  return <DataContext.Provider value={service}>{children}</DataContext.Provider>;
}

export function useDataService(): EventDataService {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataService must be used inside DataProvider');
  return ctx;
}