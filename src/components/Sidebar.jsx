import React from 'react';
import { LayoutDashboard, Upload, Users, BarChart3, LineChart, Bell, FileText, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Analyze', icon: Upload },
    { id: 'counters', label: 'Counters', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'predictions', label: 'Predictions', icon: LineChart },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar animate-enter stagger-0">
      <div className="brand animate-enter stagger-1">
        <h1>WLWF</h1>
        <p>Wait Less, Work Fast.</p>
      </div>

      <nav className="nav-links animate-enter stagger-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
