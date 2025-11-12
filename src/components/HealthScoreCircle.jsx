import React from 'react';

function HealthScoreCircle({ score = 85, size = 120 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Determine color based on score
  const getColor = (score) => {
    if (score >= 80) return '#10B981'; // health-green
    if (score >= 60) return '#F59E0B'; // warning-amber
    return '#F43F5E'; // danger-rose
  };
  
  const color = getColor(score);
  
  return (
    <div className="relative inline-flex items-center justify-center animate-scale-in">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`
          }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold font-mono" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-gray-500 font-sans">/ 100</span>
      </div>
    </div>
  );
}

export default HealthScoreCircle;
