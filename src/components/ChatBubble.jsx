import React from 'react';

function ChatBubble({ message, sender }) {
  const isDoctor = sender === 'doctor';
  const isSystem = sender === 'system';
  
  // System messages (errors, warnings)
  if (isSystem) {
    return (
      <div className="flex justify-center mb-4 animate-slide-down">
        <div className="max-w-md px-4 py-2 rounded-lg bg-warning-amber-50 border-2 border-warning-amber-300 text-warning-amber-800 shadow-medical">
          <p className="text-xs leading-relaxed text-center font-sans">{message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex ${isDoctor ? 'justify-start' : 'justify-end'} mb-3 animate-slide-up`}>
      <div
        className={`max-w-3xl px-5 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
          isDoctor
            ? 'bg-medical-blue text-white rounded-tl-none shadow-medical-lg hover:shadow-glow-cyan border-2 border-medical-blue-600'
            : 'bg-white text-gray-800 rounded-tr-none shadow-medical hover:shadow-medical-lg border border-gray-100'
        }`}
      >
        {isDoctor && (
          <div className="flex items-center gap-2 text-xs font-bold mb-1.5 opacity-90 font-sans">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Dr. Chowdhury
          </div>
        )}
        <p className={`text-sm leading-relaxed font-serif ${isDoctor ? 'text-white' : 'text-gray-700'}`}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default ChatBubble;
