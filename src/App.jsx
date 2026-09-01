import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadSection from './components/UploadSection';
import CounterConfig from './components/CounterConfig';
import Settings from './components/Settings';
import { AnalyticsMock, PredictionsMock, AlertsMock, ReportsMock } from './components/MockPages';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [mediaData, setMediaData] = useState(null);
  const [detectionMode, setDetectionMode] = useState('queue'); // 'queue' or 'crowd'
  const [cameraAngle, setCameraAngle] = useState('top'); // 'top' or 'bottom'
  
  // Apply theme to document body
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const [counters, setCounters] = useState([
    { id: 1, name: 'Counter 1', serviceRate: 2.0, region: { x: 0, y: 0.4, w: 0.33, h: 0.6 }, queueCount: 0, waitTime: 0, status: 'GREEN' },
    { id: 2, name: 'Counter 2', serviceRate: 1.5, region: { x: 0.33, y: 0.4, w: 0.33, h: 0.6 }, queueCount: 0, waitTime: 0, status: 'GREEN' },
    { id: 3, name: 'Counter 3', serviceRate: 3.0, region: { x: 0.66, y: 0.4, w: 0.33, h: 0.6 }, queueCount: 0, waitTime: 0, status: 'GREEN' },
  ]);
  
  const [totalPeople, setTotalPeople] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            counters={counters} 
            totalPeople={totalPeople} 
            mediaData={mediaData}
            setCounters={setCounters}
            setTotalPeople={setTotalPeople}
            detectionMode={detectionMode}
            setDetectionMode={setDetectionMode}
            cameraAngle={cameraAngle}
            setCameraAngle={setCameraAngle}
          />
        );
      case 'upload':
        return (
          <UploadSection onMediaReady={(data) => {
            setMediaData(data);
            setActiveTab('dashboard');
          }} />
        );
      case 'counters':
        return <CounterConfig counters={counters} setCounters={setCounters} />;
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} />;
      case 'analytics':
        return <AnalyticsMock counters={counters} totalPeople={totalPeople} detectionMode={detectionMode} />;
      case 'predictions':
        return <PredictionsMock counters={counters} totalPeople={totalPeople} detectionMode={detectionMode} />;
      case 'alerts':
        return <AlertsMock counters={counters} totalPeople={totalPeople} detectionMode={detectionMode} />;
      case 'reports':
        return <ReportsMock counters={counters} totalPeople={totalPeople} detectionMode={detectionMode} />;
      default:
        return (
          <div className="clay-card" style={{ padding: '64px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>Under Construction</h3>
            <p>This section will be built in upcoming phases.</p>
          </div>
        );
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'upload': return 'Upload & Analyze';
      case 'counters': return 'Counter Configuration';
      case 'analytics': return 'Queue Analytics';
      case 'predictions': return 'Future Predictions';
      case 'alerts': return 'System Alerts';
      case 'reports': return 'Detailed Reports';
      case 'settings': return 'System Settings';
      default: return 'Overview';
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <header className="header flex-between">
          <div>
            <h2>{getTabTitle()}</h2>
            <p>Here's what's happening with your queues.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="badge green">System Online</div>
            <div className="clay-card" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
              Admin User
            </div>
          </div>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
