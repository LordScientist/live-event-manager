import { DataProvider } from './app/DataProvider';
import { ViewProvider } from './app/ViewContext';
import { ViewSwitcher, ViewBanner } from './features/view/ViewSwitcher';
import { ScheduleView } from './features/schedule/ScheduleView';
import { ChangeFeed } from './features/changes/ChangeFeed';

export default function App() {
  return (
    <DataProvider>
      <ViewProvider>
        <div className="app">
          <header className="header">
            <div className="header-row">
              <div>
                <h1>Live Event Manager</h1>
                <p>One change. Everyone affected. In real time.</p>
              </div>
              <ViewSwitcher />
            </div>
            <ViewBanner />
          </header>
          <div className="layout">
            <ScheduleView />
            <ChangeFeed />
          </div>
        </div>
      </ViewProvider>
    </DataProvider>
  );
}