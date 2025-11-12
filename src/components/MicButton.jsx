import React from 'react';

function MicButton({ isListening, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-20 h-20 rounded-full shadow-2xl transition-all duration-300 
        flex items-center justify-center focus:outline-none focus:ring-4 
        ${isListening 
          ? 'bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 scale-110 focus:ring-red-300' 
          : 'bg-gradient-to-br from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 focus:ring-cyan-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
      `}
    >
      {/* Medical-themed pulsing ring when listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-full bg-red-300 animate-pulse opacity-50"></div>
          <div className="absolute -inset-2 rounded-full border-4 border-red-300 animate-pulse"></div>
        </>
      )}
      
      {/* Subtle glow when not listening */}
      {!isListening && !disabled && (
        <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 blur-xl"></div>
      )}
      
      {/* Microphone icon */}
      <svg
        className="w-8 h-8 text-white relative z-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isListening ? (
          // Stop icon when listening
          <rect x="6" y="6" width="12" height="12" fill="currentColor" />
        ) : (
          // Microphone icon when not listening
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </>
        )}
      </svg>
      
      {/* Tooltip */}
      <div className="absolute -top-12 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {isListening ? 'Click to stop' : 'Click to speak'}
      </div>
    </button>
  );
}

export default MicButton;
