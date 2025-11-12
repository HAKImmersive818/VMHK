import React from 'react';

function BiomarkerChart({ 
  title = "Heart Rate", 
  data = [72, 75, 71, 73, 70, 74, 72],
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  unit = "bpm",
  optimalRange = { min: 60, max: 80 }
}) {
  const maxValue = Math.max(...data, optimalRange.max);
  const minValue = Math.min(...data, optimalRange.min);
  const range = maxValue - minValue;
  
  const getYPosition = (value) => {
    return 100 - ((value - minValue) / range) * 80; // 80% of height for data
  };
  
  const currentValue = data[data.length - 1];
  const isInRange = currentValue >= optimalRange.min && currentValue <= optimalRange.max;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-medical hover:shadow-medical-lg transition-shadow duration-300 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-medical-blue font-sans">{title}</h3>
        <div className="flex items-center gap-2">
          <span className={`
            text-2xl font-bold font-mono
            ${isInRange ? 'text-health-green' : 'text-warning-amber'}
          `}>
            {currentValue}
          </span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="relative h-40 mb-4">
        <svg className="w-full h-full" viewBox="0 0 300 100">
          {/* Optimal range background */}
          <rect
            x="0"
            y={getYPosition(optimalRange.max)}
            width="300"
            height={getYPosition(optimalRange.min) - getYPosition(optimalRange.max)}
            fill="#10B98110"
            className="animate-fade-in"
          />
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="300"
              y2={y}
              stroke="#E5E7EB"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Data line */}
          <polyline
            points={data.map((value, index) => {
              const x = (index / (data.length - 1)) * 280 + 10;
              const y = getYPosition(value);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-fade-in"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              animation: 'drawLine 1.5s ease-out forwards'
            }}
          />
          
          {/* Data points */}
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 280 + 10;
            const y = getYPosition(value);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#06B6D4"
                className="animate-scale-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.5))'
                }}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 font-sans">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      
      {/* Status */}
      <div className="mt-3 flex items-center gap-2">
        <div className={`
          w-2 h-2 rounded-full
          ${isInRange ? 'bg-health-green animate-pulse' : 'bg-warning-amber animate-pulse'}
        `} />
        <span className="text-sm text-gray-600 font-serif">
          {isInRange ? 'Within optimal range' : 'Outside optimal range'}
        </span>
      </div>
    </div>
  );
}

// Add CSS animation for line drawing
const style = document.createElement('style');
style.textContent = `
  @keyframes drawLine {
    to {
      stroke-dashoffset: 0;
    }
  }
`;
document.head.appendChild(style);

export default BiomarkerChart;
