import { DataProvider } from './app/DataProvider';
import { ScheduleView } from './features/schedule/ScheduleView';
import { ChangePanel } from './features/changes/ChangePanel';

export default function App() {
  return (
    <DataProvider>
      <main style={{ fontFamily: 'system-ui', padding: 24 }}>
        <h1>Live Event Manager</h1>
        <ScheduleView />
        <hr />
        <ChangePanel />
      </main>
    </DataProvider>
  );
}