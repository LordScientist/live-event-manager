import { DataProvider } from './app/DataProvider';
import { ScheduleView } from './features/schedule/ScheduleView';
import { ChangeFeed } from './features/changes/ChangeFeed';

export default function App() {
  return (
    <DataProvider>
      <div className="app">
        <header className="header">
          <h1>Live Event Manager</h1>
          <p>One change. Everyone affected. In real time.</p>
        </header>
        <div className="layout">
          <ScheduleView />
          <ChangeFeed />
        </div>
      </div>
    </DataProvider>
  );
}