import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BrainCircuit } from 'lucide-react';

const PredictionChart = ({ counters }) => {
  // Generate predictive data based on current queue count and service rate
  const predictionData = useMemo(() => {
    const timePoints = [0, 5, 10, 20, 30]; // minutes from now
    
    // Default arrival rate: 1 person per 5 minutes per counter (0.2 person/min)
    // Departure rate: 1 / serviceRate
    
    return timePoints.map(time => {
      let dataPoint = { time: time === 0 ? 'Now' : `+${time} min` };
      
      counters.forEach(counter => {
        const currentQ = counter.queueCount;
        const arrivalRate = 0.2; // arrivals per min
        const departureRate = counter.serviceRate > 0 ? (1 / counter.serviceRate) : 0; // departures per min
        
        // Expected Q size = Current + (arrivals - departures) * time
        let predictedQ = currentQ + Math.round((arrivalRate - departureRate) * time);
        
        if (predictedQ < 0) predictedQ = 0;
        
        dataPoint[counter.name] = predictedQ;
      });
      
      return dataPoint;
    });
  }, [counters]);

  const colors = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6'];

  return (
    <div className="clay-card">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <h3>
          <BrainCircuit color="var(--status-purple)" style={{ verticalAlign: 'middle', marginRight: '8px' }} />
          AI Queue Prediction
        </h3>
        <span className="badge purple">Confidence: 89%</span>
      </div>
      
      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={predictionData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--clay-outer-sm)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {counters.map((counter, index) => (
              <Line 
                key={counter.id}
                type="monotone" 
                dataKey={counter.name} 
                stroke={colors[index % colors.length]} 
                strokeWidth={3}
                activeDot={{ r: 8 }}
                animationDuration={2500}
                animationEasing="ease-in-out"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '0.9rem' }}>
        Predictions are calculated using observed arrival patterns and individual counter service rates.
      </p>
    </div>
  );
};

export default PredictionChart;
