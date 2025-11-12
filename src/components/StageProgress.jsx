import React from 'react';

function StageProgress({ currentStage = 2, stages = 5 }) {
  const stageNames = [
    'Personal Profile',
    'Mind Assessment',
    'Body Composition',
    'Blood Analysis',
    'Genetic Blueprint'
  ];
  
  return (
    <div className="w-full py-6 animate-slide-up">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-gradient-to-r from-innovation-cyan to-health-green transition-all duration-1000 ease-out"
            style={{ width: `${((currentStage - 1) / (stages - 1)) * 100}%` }}
          />
        </div>
        
        {/* Stage circles */}
        {Array.from({ length: stages }).map((_, index) => {
          const stageNumber = index + 1;
          const isCompleted = stageNumber < currentStage;
          const isCurrent = stageNumber === currentStage;
          const isPending = stageNumber > currentStage;
          
          return (
            <div key={stageNumber} className="flex flex-col items-center relative z-10">
              {/* Circle */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-500 transform
                  ${isCompleted ? 'bg-health-green text-white shadow-glow-green scale-100' : ''}
                  ${isCurrent ? 'bg-innovation-cyan text-white shadow-glow-cyan scale-110 animate-pulse-slow' : ''}
                  ${isPending ? 'bg-gray-200 text-gray-400 scale-90' : ''}
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stageNumber
                )}
              </div>
              
              {/* Label */}
              <div className="mt-2 text-center">
                <p className={`
                  text-xs font-medium whitespace-nowrap
                  ${isCurrent ? 'text-innovation-cyan font-semibold' : ''}
                  ${isCompleted ? 'text-health-green' : ''}
                  ${isPending ? 'text-gray-400' : ''}
                `}>
                  {stageNames[index]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress percentage */}
      <div className="mt-4 text-center">
        <span className="text-sm font-mono text-gray-600">
          Progress: <span className="font-bold text-innovation-cyan">{Math.round(((currentStage - 1) / stages) * 100)}%</span>
        </span>
      </div>
    </div>
  );
}

export default StageProgress;
