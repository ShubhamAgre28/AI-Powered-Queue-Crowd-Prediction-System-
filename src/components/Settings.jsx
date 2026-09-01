import React from 'react';
import { Moon, Sun, Bell, Shield, Database } from 'lucide-react';

const Settings = ({ theme, setTheme }) => {
  return (
    <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div className="clay-card">
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sun size={20} /> Appearance
        </h3>
        <div className="flex-between" style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--clay-inner)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {theme === 'dark' ? <Moon size={24} color="var(--primary-blue)" /> : <Sun size={24} color="var(--status-orange)" />}
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Dark Mode</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Toggle between light and dark dashboard themes</p>
            </div>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg-color)', borderRadius: '100px', padding: '4px', boxShadow: 'var(--clay-outer-sm)' }}>
            <button 
              className={`btn ${theme === 'light' ? 'primary' : ''}`}
              onClick={() => setTheme('light')}
              style={{ borderRadius: '100px', padding: '8px 24px', background: theme === 'light' ? 'var(--primary-blue)' : 'transparent', color: theme === 'light' ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Light
            </button>
            <button 
              className={`btn ${theme === 'dark' ? 'primary' : ''}`}
              onClick={() => setTheme('dark')}
              style={{ borderRadius: '100px', padding: '8px 24px', background: theme === 'dark' ? 'var(--primary-blue)' : 'transparent', color: theme === 'dark' ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Dark
            </button>
          </div>
        </div>
      </div>

      <div className="clay-card">
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={20} /> Notifications
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="flex-between" style={{ padding: '16px', borderBottom: '1px solid var(--text-secondary)' + '20' }}>
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Overcrowding Alerts</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Receive alerts when wait times exceed 10 mins</p>
            </div>
            <div style={{ width: '40px', height: '24px', background: 'var(--status-green)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
            </div>
          </div>
          <div className="flex-between" style={{ padding: '16px' }}>
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Weekly Reports</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Receive automated PDF reports via email</p>
            </div>
            <div style={{ width: '40px', height: '24px', background: 'var(--text-secondary)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="clay-card">
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} /> System Configuration
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Advanced configurations will be unlocked in the final release phase.
        </p>
        <button className="clay-button" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <Shield size={16} /> Advanced Settings
        </button>
      </div>

    </div>
  );
};

export default Settings;
