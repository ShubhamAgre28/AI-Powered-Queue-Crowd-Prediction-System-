import React from 'react';
import { Users, Clock, Activity, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="clay-card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ 
      background: `var(--status-${colorClass || 'blue'} + '20')`, // slight opacity mock
      padding: '16px', 
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--clay-inner)',
      color: `var(--status-${colorClass})` || 'var(--primary-blue)'
    }}>
      <Icon size={32} />
    </div>
    <div>
      <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</h4>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>{value}</div>
      {subtitle && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{subtitle}</div>}
    </div>
  </div>
);

import PredictionChart from './PredictionChart';
import AnalysisPanel from './AnalysisPanel';

const Dashboard = ({ counters, totalPeople, mediaData, setCounters, setTotalPeople, detectionMode, setDetectionMode, cameraAngle, setCameraAngle }) => {
  
  // Calculate dynamic stats
  const activeCounters = counters.length;
  const totalWaitTime = counters.reduce((sum, c) => sum + c.waitTime, 0);
  const avgWaitTime = activeCounters > 0 ? Math.round(totalWaitTime / activeCounters) : 0;
  
  const busiestCounter = [...counters].sort((a, b) => b.queueCount - a.queueCount)[0];
  const leastCrowded = [...counters].sort((a, b) => a.queueCount - b.queueCount)[0];
  
  // Fastest counter takes into account waitTime, tie-breaking with serviceRate
  const fastestCounter = [...counters].sort((a, b) => {
    if (a.waitTime === b.waitTime) {
      return a.serviceRate - b.serviceRate;
    }
    return a.waitTime - b.waitTime;
  })[0];

  return (
    <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Mode Toggle Bar */}
      <div className="clay-card flex-between" style={{ padding: '16px 24px', borderRadius: '100px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Analysis Mode</h3>
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '100px', padding: '4px' }}>
            <button 
              className={`btn ${detectionMode === 'queue' ? 'primary' : ''}`}
              onClick={() => setDetectionMode('queue')}
              style={{ borderRadius: '100px', padding: '8px 24px', background: detectionMode === 'queue' ? 'var(--primary-blue)' : 'transparent', color: detectionMode === 'queue' ? 'white' : 'var(--text-secondary)' }}
            >
              Queue Management
            </button>
            <button 
              className={`btn ${detectionMode === 'crowd' ? 'primary' : ''}`}
              onClick={() => setDetectionMode('crowd')}
              style={{ borderRadius: '100px', padding: '8px 24px', background: detectionMode === 'crowd' ? 'var(--primary-blue)' : 'transparent', color: detectionMode === 'crowd' ? 'white' : 'var(--text-secondary)' }}
            >
              Crowd Analytics
            </button>
          </div>
        </div>
        
        {detectionMode === 'queue' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Camera Angle</h3>
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '100px', padding: '4px' }}>
              <button 
                className={`btn ${cameraAngle === 'top' ? 'primary' : ''}`}
                onClick={() => setCameraAngle('top')}
                style={{ borderRadius: '100px', padding: '8px 16px', background: cameraAngle === 'top' ? 'var(--primary-blue)' : 'transparent', color: cameraAngle === 'top' ? 'white' : 'var(--text-secondary)' }}
                title="Counter is at the top of the screen (people facing away)"
              >
                Counter Top
              </button>
              <button 
                className={`btn ${cameraAngle === 'bottom' ? 'primary' : ''}`}
                onClick={() => setCameraAngle('bottom')}
                style={{ borderRadius: '100px', padding: '8px 16px', background: cameraAngle === 'bottom' ? 'var(--primary-blue)' : 'transparent', color: cameraAngle === 'bottom' ? 'white' : 'var(--text-secondary)' }}
                title="Counter is at the bottom of the screen (people facing camera)"
              >
                Counter Bottom
              </button>
            </div>
          </div>
        )}
      </div>

      {mediaData && (
        <div style={{ marginBottom: '16px' }}>
          <AnalysisPanel 
            mediaData={mediaData} 
            counters={counters} 
            setCounters={setCounters} 
            setTotalPeople={setTotalPeople} 
            detectionMode={detectionMode}
            cameraAngle={cameraAngle}
          />
        </div>
      )}

      {detectionMode === 'queue' ? (
        // --- QUEUE MODE DASHBOARD ---
        <>
          <div className="dashboard-grid">
            <StatCard 
              title="TOTAL PEOPLE" 
              value={totalPeople} 
              subtitle="Currently detected" 
              icon={Users} 
              colorClass="blue" 
            />
            <StatCard 
              title="ACTIVE COUNTERS" 
              value={activeCounters} 
              subtitle="Processing queues" 
              icon={Activity} 
              colorClass="purple" 
            />
            <StatCard 
              title="AVERAGE WAIT TIME" 
              value={`${avgWaitTime} min`} 
              subtitle="Across all queues" 
              icon={Clock} 
              colorClass="yellow" 
            />
          </div>

          <div className="dashboard-grid">
            <StatCard 
              title="BUSIEST COUNTER" 
              value={busiestCounter ? busiestCounter.name : '--'} 
              subtitle={busiestCounter ? `${busiestCounter.queueCount} people (${busiestCounter.waitTime}m)` : ''}
              icon={AlertTriangle} 
              colorClass="red" 
            />
            <StatCard 
              title="LEAST CROWDED" 
              value={leastCrowded ? leastCrowded.name : '--'} 
              subtitle={leastCrowded ? `${leastCrowded.queueCount} people (${leastCrowded.waitTime}m)` : ''}
              icon={CheckCircle} 
              colorClass="green" 
            />
            <StatCard 
              title="FASTEST COUNTER" 
              value={fastestCounter ? fastestCounter.name : '--'} 
              subtitle={fastestCounter ? `Wait: ${fastestCounter.waitTime} min` : 'Recommendation'} 
              icon={TrendingUp} 
              colorClass="green" 
            />
          </div>

          <div className="clay-card" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-purple)' }}>
                <TrendingUp /> AI RECOMMENDATION
              </h3>
              
              {fastestCounter && fastestCounter.queueCount > 0 ? (
                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
                    Redirect new customers to <strong>{fastestCounter.name}</strong>.
                  </p>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--status-purple)' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                      <strong>Reason:</strong> {fastestCounter.name} currently has the lowest estimated wait time ({fastestCounter.waitTime} mins) 
                      with only {fastestCounter.queueCount} people in queue, processing at {fastestCounter.serviceRate} min/person.
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                  No active queues detected. All counters are currently free.
                </p>
              )}

              {busiestCounter && busiestCounter.waitTime > 10 && (
                <div style={{ marginTop: '16px', background: 'var(--status-red)' + '10', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--status-red)' }}>
                  <h4 style={{ color: 'var(--status-red)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <AlertTriangle size={18} /> ⚠ OVERCROWDING PREDICTION
                  </h4>
                  <p style={{ margin: '8px 0 0 0', color: 'var(--status-red)' }}>
                    {busiestCounter.name} is currently experiencing a critical wait time of {busiestCounter.waitTime} minutes. 
                    Consider opening an additional counter or reallocating staff to assist.
                  </p>
                </div>
              )}
            </div>
            
            {fastestCounter && fastestCounter.queueCount > 0 && (
              <div style={{ 
                background: 'var(--status-green)', 
                color: 'white', 
                padding: '32px', 
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                minWidth: '250px',
                boxShadow: 'var(--clay-outer-sm)'
              }}>
                <h4 style={{ margin: 0, opacity: 0.9 }}>⚡ FASTEST COUNTER</h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '8px 0' }}>{fastestCounter.name}</div>
                <p style={{ margin: 0 }}>Estimated Wait: {fastestCounter.waitTime} mins</p>
              </div>
            )}
          </div>

          <div className="clay-card">
            <h3>Live Counter Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {counters.map(counter => (
                <div key={counter.id} style={{ 
                  padding: '16px', 
                  borderRadius: 'var(--radius-sm)', 
                  border: `2px solid var(--status-${counter.status.toLowerCase()})`,
                  background: `var(--status-${counter.status.toLowerCase()})` + '10'
                }}>
                  <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <h4 style={{ margin: 0 }}>{counter.name}</h4>
                    <span className={`badge ${counter.status.toLowerCase()}`}>{counter.status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>{counter.queueCount} People</span>
                    <span style={{ fontWeight: 'bold' }}>{counter.waitTime} min wait</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PredictionChart counters={counters} />
        </>
      ) : (
        // --- CROWD MODE DASHBOARD ---
        <>
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <StatCard 
              title="TOTAL CROWD SIZE" 
              value={totalPeople} 
              subtitle="Individuals detected in frame" 
              icon={Users} 
              colorClass="blue" 
            />
            <StatCard 
              title="CROWD DENSITY" 
              value={totalPeople > 10 ? 'HIGH' : totalPeople > 5 ? 'MEDIUM' : 'LOW'} 
              subtitle="Area utilization level" 
              icon={Activity} 
              colorClass={totalPeople > 10 ? 'red' : totalPeople > 5 ? 'yellow' : 'green'} 
            />
          </div>

          <div className="clay-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-purple)' }}>
              <TrendingUp /> CROWD MANAGEMENT RECOMMENDATION
            </h3>
            <div style={{ marginTop: '16px' }}>
              {totalPeople > 10 ? (
                <div style={{ background: 'var(--status-red)' + '10', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--status-red)' }}>
                  <h4 style={{ color: 'var(--status-red)', margin: '0 0 8px 0' }}>⚠ Critical Density Reached</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    The current area is heavily congested. Consider opening overflow areas, dispatching crowd control staff, or restricting new entries temporarily.
                  </p>
                </div>
              ) : totalPeople > 5 ? (
                <div style={{ background: 'var(--status-yellow)' + '10', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--status-yellow)' }}>
                  <h4 style={{ color: 'var(--status-yellow)', margin: '0 0 8px 0' }}>Moderate Activity</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    Traffic is building up. Monitor the area for potential bottlenecks near entrances or service points.
                  </p>
                </div>
              ) : (
                <div style={{ background: 'var(--status-green)' + '10', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--status-green)' }}>
                  <h4 style={{ color: 'var(--status-green)', margin: '0 0 8px 0' }}>Space is Clear</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    Crowd density is optimal. No immediate management actions required.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;
