import React, { useState } from 'react';
import { BarChart2, LineChart, Bell, FileText, Download, Activity, Users, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

export const AnalyticsMock = ({ counters, totalPeople, detectionMode }) => {
  const maxWait = Math.max(...counters.map(c => c.waitTime), 10); // Minimum scale of 10
  
  return (
    <div className="dashboard-content animate-enter stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="clay-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <BarChart2 size={24} color="var(--primary-blue)" /> Live Queue Analytics
        </h3>
        
        {detectionMode === 'queue' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--clay-inner)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Peak Wait Time</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-red)' }}>{Math.max(...counters.map(c => c.waitTime), 0)} mins</div>
              </div>
              <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--clay-inner)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Customers</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>{counters.reduce((sum, c) => sum + c.queueCount, 0)}</div>
              </div>
              <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--clay-inner)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Avg Service Speed</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-green)' }}>{(counters.reduce((sum, c) => sum + c.serviceRate, 0) / (counters.length || 1)).toFixed(1)} m/p</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)' }}>
              <span>Wait Times (mins)</span>
              <span>Counters</span>
            </div>
            <div style={{ height: '300px', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--clay-inner)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '24px' }}>
              {counters.map(counter => {
                const heightPercentage = Math.min((counter.waitTime / maxWait) * 100, 100);
                return (
                  <div key={counter.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', width: '20%', height: '100%' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{counter.waitTime}m</span>
                    
                    {/* 3D Bar Track & Fill */}
                    <div style={{ 
                      width: '50px', 
                      flex: 1, 
                      background: 'var(--bg-color)', 
                      borderRadius: '50px', 
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      boxShadow: 'var(--clay-inner)',
                      padding: '6px'
                    }}>
                      <div style={{ 
                        width: '100%', 
                        height: `${Math.max(heightPercentage, 2)}%`, 
                        background: counter.status === 'RED' ? 'linear-gradient(145deg, #fca5a5, #dc2626)' : 
                                    counter.status === 'ORANGE' ? 'linear-gradient(145deg, #fdba74, #ea580c)' : 
                                    counter.status === 'YELLOW' ? 'linear-gradient(145deg, #fde047, #ca8a04)' : 
                                    'linear-gradient(145deg, #93c5fd, #2563eb)', 
                        animation: `fluctuate ${2 + (counter.id * 0.5)}s ease-in-out infinite`,
                        transformOrigin: 'bottom',
                        borderRadius: '50px', 
                        transition: 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        boxShadow: 'inset 3px 3px 6px rgba(255, 255, 255, 0.5), inset -3px -3px 6px rgba(0, 0, 0, 0.15), 0 10px 15px -3px rgba(0,0,0,0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* 3D Glossy Top Highlight */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '10%',
                          width: '80%',
                          height: '20px',
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
                          borderRadius: '50px'
                        }} />
                      </div>
                    </div>

                    <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{counter.name}</span>
                  </div>
                );
              })}
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '16px' }}>
              Real-time comparative analysis of active counter wait times.
            </p>
          </>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Activity size={48} color="var(--primary-blue)" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h4>Crowd Traffic: {totalPeople} Individuals</h4>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Detailed historical crowd analytics will be available in Phase 2.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const PredictionsMock = ({ counters, totalPeople, detectionMode }) => {
  const busiestCounter = [...counters].sort((a, b) => b.waitTime - a.waitTime)[0];
  const forecastedWait = busiestCounter ? Math.round(busiestCounter.waitTime * 1.5) : 0;
  
  return (
    <div className="dashboard-content animate-enter stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="clay-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <LineChart size={24} color="var(--status-purple)" /> AI Traffic Forecast
        </h3>
        
        {detectionMode === 'queue' && busiestCounter && busiestCounter.queueCount > 0 ? (
          <div style={{ padding: '24px', background: 'var(--status-purple)' + '10', borderRadius: 'var(--radius-sm)', border: '1px solid var(--status-purple)' }}>
            <h4 style={{ color: 'var(--status-purple)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} /> Surge Prediction: Escalating Wait Times
            </h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Based on current live arrival rates and service speeds, we forecast that <strong>{busiestCounter.name}</strong> will experience significant delays.
            </p>
            
            {/* Visual Timeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', left: '0', right: '0', height: '4px', background: 'var(--status-purple)', opacity: 0.2, zIndex: 0 }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>Now</div>
                <span style={{ marginTop: '8px', fontWeight: 'bold' }}>{busiestCounter.waitTime}m</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--status-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>+15m</div>
                <span style={{ marginTop: '8px', fontWeight: 'bold' }}>{Math.round(busiestCounter.waitTime * 1.2)}m</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--status-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>+30m</div>
                <span style={{ marginTop: '8px', fontWeight: 'bold' }}>{forecastedWait}m</span>
              </div>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--status-purple)' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-primary)' }}>
                Recommendation: Pre-emptively open an overflow counter now to prevent the +30m surge.
              </p>
            </div>
          </div>
        ) : detectionMode === 'crowd' && totalPeople > 5 ? (
          <div style={{ padding: '24px', background: 'var(--status-yellow)' + '10', borderRadius: 'var(--radius-sm)', border: '1px solid var(--status-yellow)' }}>
            <h4 style={{ color: 'var(--status-yellow)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} /> Density Growth Warning
            </h4>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Current crowd size ({totalPeople}) is tracking upwards. Expect a 40% increase in density during the upcoming lunch rush hour based on historical pattern matching.
            </p>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>Traffic is currently low. No significant surges predicted.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const AlertsMock = ({ counters, totalPeople, detectionMode }) => {
  // Generate real-time alerts array
  const activeAlerts = [];
  
  if (detectionMode === 'queue') {
    counters.forEach(c => {
      if (c.waitTime > 10) {
        activeAlerts.push({
          time: 'Just now',
          msg: `CRITICAL: ${c.name} wait time has reached ${c.waitTime} minutes!`,
          type: 'red',
          icon: AlertTriangle
        });
      } else if (c.waitTime > 5) {
        activeAlerts.push({
          time: 'A few mins ago',
          msg: `Warning: ${c.name} wait time is elevating (${c.waitTime} mins).`,
          type: 'yellow',
          icon: Clock
        });
      }
    });
  } else if (detectionMode === 'crowd') {
    if (totalPeople > 10) {
      activeAlerts.push({
        time: 'Just now',
        msg: `CRITICAL: Severe overcrowding detected! (${totalPeople} people)`,
        type: 'red',
        icon: AlertTriangle
      });
    } else if (totalPeople > 5) {
      activeAlerts.push({
        time: 'A few mins ago',
        msg: `Warning: Crowd density is reaching moderate levels.`,
        type: 'yellow',
        icon: Users
      });
    }
  }

  // Add some static historicals
  const history = [
    { time: '1 hour ago', msg: 'System diagnostic completed successfully.', type: 'green', icon: Activity },
    { time: '3 hours ago', msg: 'Camera feed connection established.', type: 'green', icon: Activity }
  ];
  
  const displayAlerts = [...activeAlerts, ...history];

  return (
    <div className="dashboard-content animate-enter stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="clay-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Bell size={24} color="var(--status-orange)" /> Live System Alerts
        </h3>
        
        {displayAlerts.map((alert, i) => (
          <div key={i} style={{ 
            padding: '16px', 
            background: 'var(--bg-color)', 
            borderRadius: 'var(--radius-sm)', 
            boxShadow: 'var(--clay-inner)', 
            marginBottom: '12px', 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            borderLeft: alert.type === 'red' || alert.type === 'yellow' ? `4px solid var(--status-${alert.type})` : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <alert.icon size={18} color={`var(--status-${alert.type})`} />
              <span style={{ color: 'var(--text-primary)', fontWeight: alert.type === 'red' ? 'bold' : 'normal' }}>{alert.msg}</span>
            </div>
            <span style={{ color: `var(--status-${alert.type})`, fontSize: '0.85rem', fontWeight: 'bold' }}>{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ReportsMock = ({ counters, totalPeople }) => {
  const [generating, setGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setReportReady(true);
    }, 1500);
  };

  return (
    <div className="dashboard-content animate-enter stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="clay-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <FileText size={24} color="var(--status-green)" /> Session Reports
        </h3>
        
        {!reportReady ? (
          <div style={{ padding: '40px', textAlign: 'center', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--clay-inner)' }}>
            <FileText size={48} color="var(--text-secondary)" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h4 style={{ margin: '0 0 8px 0' }}>Generate Live Session Report</h4>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Compile the current AI queue data, wait times, and crowd densities into a downloadable summary.</p>
            <button 
              className={`clay-button primary ${generating ? 'loading' : ''}`} 
              onClick={handleGenerate}
              disabled={generating}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {generating ? 'Compiling AI Data...' : <><Plus size={18} /> Generate Report</>}
            </button>
          </div>
        ) : (
          <div className="flex-between" style={{ padding: '24px', background: 'var(--status-green)' + '10', borderRadius: 'var(--radius-sm)', border: '1px solid var(--status-green)' }}>
            <div>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color="var(--status-green)" /> Session Summary Compiled
              </h4>
              <p style={{ margin: '8px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Report includes: Peak wait of {Math.max(...counters.map(c => c.waitTime), 0)} mins, {counters.reduce((sum, c) => sum + c.queueCount, 0)} customers, {totalPeople} crowd density.
              </p>
            </div>
            <button className="clay-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--status-green)' }}>
              <Download size={16} /> Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
