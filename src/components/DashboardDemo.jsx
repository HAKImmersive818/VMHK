import React from 'react';
import HealthScoreCircle from './HealthScoreCircle';
import StageProgress from './StageProgress';
import BiomarkerChart from './BiomarkerChart';

function DashboardDemo() {
  return (
    <div className="bg-gradient-to-br from-medical-blue-50 to-innovation-cyan-50 p-6 rounded-2xl shadow-medical-lg animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-medical-blue font-sans mb-2">
          Your Digital Twin Dashboard
        </h2>
        <p className="text-sm text-gray-600 font-serif">
          Real-time health insights powered by VisiMedica AI
        </p>
      </div>

      {/* Health Score and Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Health Score */}
        <div className="bg-white rounded-xl p-6 shadow-medical hover:shadow-medical-lg transition-shadow duration-300">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 font-sans">Overall Health Score</h3>
          <div className="flex justify-center">
            <HealthScoreCircle score={85} size={140} />
          </div>
          <p className="text-xs text-center text-gray-500 mt-4 font-serif">
            Excellent progress! Keep up the good work.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-medical hover:shadow-medical-lg transition-shadow duration-300">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 font-sans">Today's Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 font-sans">Heart Rate</span>
              <span className="text-lg font-bold text-health-green font-mono">72 bpm</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 font-sans">Sleep Quality</span>
              <span className="text-lg font-bold text-health-green font-mono">8.2/10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 font-sans">Activity</span>
              <span className="text-lg font-bold text-innovation-cyan font-mono">8,542</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 font-sans">Stress Level</span>
              <span className="text-lg font-bold text-warning-amber font-mono">Moderate</span>
            </div>
          </div>
        </div>

        {/* Next Appointment */}
        <div className="bg-gradient-to-br from-innovation-cyan-500 to-medical-blue-600 rounded-xl p-6 shadow-glow-cyan text-white">
          <h3 className="text-sm font-semibold mb-4 font-sans opacity-90">Next Appointment</h3>
          <div className="space-y-2">
            <p className="text-2xl font-bold font-sans">Body Composition</p>
            <p className="text-sm opacity-90 font-serif">Stage 3 of 5</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs opacity-75 font-sans">Tuesday, Nov 14</p>
              <p className="text-lg font-bold font-mono">2:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Progress */}
      <div className="bg-white rounded-xl p-6 shadow-medical mb-6">
        <h3 className="text-lg font-semibold text-medical-blue mb-4 font-sans">
          Your Digital Twin Journey
        </h3>
        <StageProgress currentStage={3} stages={5} />
      </div>

      {/* Biomarker Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BiomarkerChart 
          title="Heart Rate Variability"
          data={[72, 75, 71, 73, 70, 74, 72]}
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          unit="bpm"
          optimalRange={{ min: 60, max: 80 }}
        />
        <BiomarkerChart 
          title="Sleep Duration"
          data={[7.2, 6.8, 7.5, 8.1, 7.8, 8.2, 7.9]}
          labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          unit="hrs"
          optimalRange={{ min: 7, max: 9 }}
        />
      </div>

      {/* AI Insights */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-medical border-l-4 border-innovation-cyan">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-innovation-cyan-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-innovation-cyan" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-medical-blue mb-1 font-sans">AI Insight</h4>
            <p className="text-sm text-gray-600 font-serif">
              Your sleep quality has improved by 15% this week. Based on your genetic blueprint, 
              maintaining this pattern could reduce cardiovascular risk by 8% over the next 6 months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardDemo;
