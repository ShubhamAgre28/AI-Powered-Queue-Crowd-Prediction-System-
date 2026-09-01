import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const CounterConfig = ({ counters, setCounters }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (counter) => {
    setEditingId(counter.id);
    setEditValue(counter.serviceRate);
  };

  const handleSave = (id) => {
    const newRate = parseFloat(editValue);
    if (!isNaN(newRate) && newRate > 0) {
      setCounters(counters.map(c => c.id === id ? { ...c, serviceRate: newRate } : c));
    }
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);
  return (
    <div className="counter-config-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="clay-card">
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <h3>Configured Counters</h3>
          <button className="clay-button primary">
            <Plus size={18} /> Add Counter
          </button>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Define the service counters and their expected average service time per customer. In the future, you will map these counters to specific regions in the uploaded media.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {counters.map((counter) => (
            <div key={counter.id} className="clay-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex-between">
                <h4 style={{ fontSize: '1.2rem' }}>{counter.name}</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editingId === counter.id ? (
                    <>
                      <button onClick={() => handleSave(counter.id)} className="clay-button" style={{ padding: '6px', borderRadius: '8px', color: 'var(--status-green)' }}>
                        <Check size={16} />
                      </button>
                      <button onClick={cancelEdit} className="clay-button" style={{ padding: '6px', borderRadius: '8px', color: 'var(--status-red)' }}>
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(counter)} className="clay-button" style={{ padding: '6px', borderRadius: '8px' }}>
                        <Edit2 size={16} />
                      </button>
                      <button className="clay-button" style={{ padding: '6px', borderRadius: '8px', color: 'var(--status-red)', opacity: 0.5, cursor: 'not-allowed' }} title="Delete will be available in Phase 2">
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Avg Service Time (mins)</div>
                {editingId === counter.id ? (
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0.5" 
                    value={editValue} 
                    onChange={(e) => setEditValue(e.target.value)} 
                    style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-blue)', outline: 'none', width: '100px', fontSize: '1.1rem' }}
                    autoFocus
                  />
                ) : (
                  <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-blue)' }}>{counter.serviceRate} mins/customer</div>
                )}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <span className="badge green">Region Configured</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="clay-card">
        <h3>Queue Region Mapping (Preview)</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Interactive region drawing tool will be implemented in subsequent phases.
        </p>
        <div style={{ 
          width: '100%', height: '300px', 
          background: 'rgba(0,0,0,0.02)', 
          border: '2px dashed #cbd5e1', 
          borderRadius: 'var(--radius-sm)',
          marginTop: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>Region mapper placeholder</span>
        </div>
      </div>
    </div>
  );
};

export default CounterConfig;
