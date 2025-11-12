import React, { useState, useEffect, useRef } from 'react';
import DoctorAvatar from './DoctorAvatar';
import ChatBubble from './ChatBubble';
import MicButton from './MicButton';
import { sendMessageToAI } from '../services/aiService';

// Fallback responses in case API fails
const fallbackResponses = [
  "I understand. Let me help you with that. Can you provide more details?",
  "That's a great question! Based on your symptoms, I'd recommend scheduling a consultation.",
  "Of course! We specialize in AI-driven health insights and digital wellbeing tools.",
  "Thank you for sharing that information. It's important to monitor these symptoms closely.",
  "I'm here to help. Our clinic offers comprehensive diagnostic services and personalized care plans.",
  "That sounds concerning. I'd recommend getting that checked by one of our specialists.",
  "Absolutely! We provide 24/7 virtual consultations and can connect you with the right healthcare professional.",
  "Based on what you've told me, here are some recommendations you might find helpful.",
];

function VoiceAgent() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [networkError, setNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [greetingSpoken, setGreetingSpoken] = useState(false);
  
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const hasGreetedRef = useRef(false);
  const maxRetries = 3;

  // Initialize Speech Recognition
  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech Recognition not supported');
      setBrowserSupported(false);
      return;
    }

    if (!window.speechSynthesis) {
      console.error('Speech Synthesis not supported');
      setBrowserSupported(false);
      return;
    }

    // Initialize recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;  // Keep listening continuously
    recognition.interimResults = true;  // Get partial results while speaking
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const lastResultIndex = event.results.length - 1;
      const result = event.results[lastResultIndex];
      
      // Only process if this is a final result
      if (result.isFinal) {
        const transcript = result[0].transcript.trim();
        console.log('✅ Final recognized:', transcript);
        
        // Stop listening after getting result
        try {
          recognition.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
        
        // Add user message
        setMessages(prev => [...prev, { text: transcript, sender: 'user' }]);
        
        // Process and respond
        handleUserMessage(transcript);
      } else {
        // Show interim results in console for debugging
        const interim = result[0].transcript;
        console.log('🎤 Interim:', interim);
      }
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      setIsListening(false);
      
      // Don't show error for aborted (user manually stopped)
      if (event.error === 'aborted') {
        return;
      }
      
      if (event.error === 'no-speech') {
        const message = { text: "(No speech detected)", sender: 'user' };
        setMessages(prev => [...prev, message]);
        speak("I didn't catch that. Could you please try again?");
      } else if (event.error === 'network') {
        console.error('🌐 Network error - Google Speech API unavailable');
        console.log('💡 This usually means:');
        console.log('   1. No internet connection');
        console.log('   2. Google Speech API is down');
        console.log('   3. Firewall/proxy blocking the service');
        console.log('   ✅ Solution: Use the text input below instead');
        
        setNetworkError(true);
        
        // Show user-friendly message
        setMessages(prev => [...prev, { 
          text: "⚠️ Voice recognition unavailable (network error). Please use text input below.", 
          sender: 'system' 
        }]);
        
        // Stop trying to use voice
        try {
          recognition.stop();
        } catch (e) {
          // Already stopped
        }
      } else if (event.error === 'audio-capture') {
        console.error('🎤 Microphone access error');
        setMessages(prev => [...prev, { 
          text: "⚠️ Microphone access denied. Please allow microphone permissions and refresh.", 
          sender: 'system' 
        }]);
      } else if (event.error === 'not-allowed') {
        console.error('🚫 Microphone permission denied');
        setMessages(prev => [...prev, { 
          text: "⚠️ Microphone permission denied. Please check browser settings and refresh.", 
          sender: 'system' 
        }]);
      } else {
        console.error('❓ Unknown error:', event.error);
        setMessages(prev => [...prev, { 
          text: `⚠️ Voice recognition error: ${event.error}. Please use text input.`, 
          sender: 'system' 
        }]);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      
      // Don't auto-restart if there's a network error
      if (networkError) {
        console.log('⚠️ Network error detected - not restarting recognition');
        return;
      }
      
      // If we're supposed to be listening, restart it
      // This handles cases where recognition stops unexpectedly
      if (isListening && !isProcessing) {
        console.log('⚠️ Recognition ended unexpectedly, restarting...');
        setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.log('Could not restart recognition:', e.message);
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    // Initial greeting with voice
    if (!hasGreetedRef.current) {
      hasGreetedRef.current = true;
      
      // Delay greeting to ensure page is fully loaded
      setTimeout(() => {
        const greeting = "Hi, I'm Dr. Chowdhury from VisiMedica, welcome to our clinic! How can I help you today?";
        setMessages([{ text: greeting, sender: 'doctor' }]);
        
        // Speak greeting - with retry for browser autoplay restrictions
        const trySpeak = () => {
          console.log('🔊 Attempting to speak greeting...');
          speak(greeting);
          setGreetingSpoken(true);
        };
        
        // Try to speak immediately
        setTimeout(() => {
          trySpeak();
        }, 100);
        
        // Also try again after delays in case voices need to load or autoplay is blocked
        setTimeout(() => {
          if (!greetingSpoken) {
            console.log('🔄 Retrying greeting speech...');
            trySpeak();
          }
        }, 1000);
        
        setTimeout(() => {
          if (!greetingSpoken) {
            console.log('🔄 Final retry for greeting speech...');
            trySpeak();
          }
        }, 2000);
      }, 500); // Reduced initial delay
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle microphone button click
  const toggleListening = () => {
    if (isSpeaking) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (isListening) {
      console.log('🛑 Stopping voice recognition...');
      try {
        recognitionRef.current?.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsListening(false);
      }
    } else {
      console.log('🎤 Starting voice recognition...');
      try {
        setIsListening(true);
        recognitionRef.current?.start();
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        setIsListening(false);
        
        // Provide user feedback
        if (error.message.includes('already started')) {
          console.log('Recognition already running, stopping and restarting...');
          recognitionRef.current?.stop();
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
            } catch (e) {
              console.error('Retry failed:', e);
            }
          }, 100);
        }
      }
    }
  };

  // Handle text input submission
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: textInput, sender: 'user' }]);
    
    // Process and respond
    handleUserMessage(textInput);
    
    // Clear input
    setTextInput('');
  };

  // Generate fallback response if API fails
  const getFallbackResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple keyword matching for more relevant responses
    if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
      return "Of course! We specialize in AI-driven health insights and digital wellbeing tools. Our services include virtual consultations, diagnostic analysis, and personalized care plans.";
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      return "I'd be happy to help you schedule an appointment. Our virtual consultations are available 24/7. Would you like to book one now?";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! It's great to see you. What can I help you with today?";
    } else if (lowerMessage.includes('thank')) {
      return "You're very welcome! Is there anything else I can help you with?";
    } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('sick')) {
      return "I'm sorry to hear you're not feeling well. Could you describe your symptoms in more detail? This will help me provide better guidance.";
    } else {
      // Random response for other queries
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  // Handle user message and generate response
  const handleUserMessage = async (userMessage) => {
    setIsProcessing(true);
    
    try {
      // Call Anthropic API with conversation history for context
      const response = await sendMessageToAI(userMessage, messages);
      
      // Add doctor response
      setMessages(prev => [...prev, { text: response, sender: 'doctor' }]);
      
      // Speak the response
      speak(response);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Show specific error message if it's an API configuration issue
      let errorResponse;
      if (error.type === 'MISSING_API_KEY' || error.type === 'INVALID_API_KEY') {
        errorResponse = `⚠️ API Configuration Error: ${error.message}`;
        setMessages(prev => [
          ...prev, 
          { text: errorResponse, sender: 'doctor' }
        ]);
        speak("There's an API configuration issue. Please check the console for details.");
      } else {
        // Use fallback response for other errors
        const fallbackResponse = getFallbackResponse(userMessage);
        errorResponse = error.type === 'NETWORK_ERROR' 
          ? `${fallbackResponse} (⚠️ Network issue - using offline mode. Error: ${error.message})`
          : `${fallbackResponse} (⚠️ Using offline mode)`;
        
        setMessages(prev => [
          ...prev, 
          { text: errorResponse, sender: 'doctor' }
        ]);
        speak(fallbackResponse);
      }
    }
    
    setIsProcessing(false);
  };

  // Text-to-Speech function with improved reliability
  const speak = (text) => {
    if (!text) {
      console.log('⚠️ No text to speak');
      return;
    }
    
    console.log('🔊 SPEAK FUNCTION CALLED with text:', text.substring(0, 100));
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Small delay to ensure cancel completes
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure voice settings
      utterance.rate = 0.95; // Slightly slower for clarity
      utterance.pitch = 1.1; // Slightly higher pitch for friendliness
      utterance.volume = 1.0;
      
      // Get voices - may need to wait for them to load
      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        
        if (voices.length > 0) {
          // Try to use a female voice if available
          const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') ||
            voice.name.includes('Victoria') ||
            voice.name.includes('Zira') ||
            (voice.name.includes('Google') && voice.name.includes('US') && voice.name.includes('English'))
          );
          
          if (femaleVoice) {
            utterance.voice = femaleVoice;
            console.log('Using voice:', femaleVoice.name);
          }
        }
        
        utterance.onstart = () => {
          console.log('Speech started');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('Speech ended');
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.warn('Speech synthesis error:', event.error || 'unknown');
          setIsSpeaking(false);
        };
        
        // Speak
        console.log('Speaking:', text.substring(0, 50) + '...');
        window.speechSynthesis.speak(utterance);
      };
      
      // Try to set voice and speak
      setVoiceAndSpeak();
      
      // Also listen for voiceschanged event in case voices aren't loaded yet
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      }
    }, 100);
  };

  if (!browserSupported) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Browser Not Supported</h2>
          <p className="text-gray-700">
            Your browser doesn't support Web Speech API. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-medical-blue-50 to-innovation-cyan-50">
      {/* Medical-Themed Header */}
      <header className="bg-white border-b-2 border-innovation-cyan shadow-medical py-4 px-6 z-10 flex-shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center">
              <img 
                src="/images/Logo.png" 
                alt="VisiMedica Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-sm text-medical-blue-700 font-medium flex items-center gap-2 font-sans">
                <span className="w-2 h-2 bg-health-green rounded-full animate-heartbeat"></span>
                Dr. Chowdhury • Your Personal Virtual Healthcare Companion
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isProcessing && (
              <div className="flex items-center gap-2 bg-innovation-cyan-50 px-4 py-2 rounded-full shadow-medical animate-fade-in">
                <div className="w-2 h-2 bg-innovation-cyan rounded-full animate-pulse"></div>
                <span className="text-sm text-innovation-cyan-700 font-medium font-sans">Processing...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3D Avatar Section - Larger for 3D Model */}
      <div className="h-96 relative overflow-hidden flex-shrink-0">
        <DoctorAvatar isSpeaking={isSpeaking} isListening={isListening} />
      </div>

      {/* Medical-Themed Chat Section - Expanded */}
      <div className="flex-1 bg-white border-t-2 border-innovation-cyan-200 shadow-medical-lg flex flex-col overflow-hidden">
        <div className="max-w-6xl mx-auto w-full p-6 flex flex-col h-full">
          {/* Chat messages - Much larger now */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p>Click the microphone to start speaking</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg.text} sender={msg.sender} />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Controls - Fixed at bottom */}
          <div className="space-y-4 flex-shrink-0">
            {/* Text Input */}
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Describe your symptoms or ask a question..."
                className="flex-1 px-4 py-3 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isProcessing}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl hover:from-cyan-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </button>
            </form>

            {/* Voice Button */}
            <div className="flex flex-col items-center justify-center gap-3">
              <MicButton
                isListening={isListening}
                onClick={toggleListening}
                disabled={isProcessing}
              />
              {isListening && (
                <div className="flex items-center gap-2 text-xs text-cyan-600 font-medium animate-pulse">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <span>Microphone is active - Speak now!</span>
                </div>
              )}
            </div>
          </div>

          {/* Medical-Themed Instructions */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-50 to-teal-50 px-4 py-2 rounded-full border border-cyan-200">
              <p className="text-sm text-cyan-700 font-medium">
                {isListening 
                  ? "🎤 Listening... Speak now (click mic to stop)" 
                  : isSpeaking 
                  ? "🔊 Dr. Chowdhury is speaking..."
                  : "💬 Type a message or use voice input"
                }
              </p>
            </div>
            {isProcessing && (
              <p className="text-xs text-cyan-600 mt-2 font-medium flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing with AI + Medical Knowledge Base...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceAgent;
