# 🩺 AI Doctor 3D - Interactive Virtual Healthcare Assistant

A fully functional 3D talking AI doctor prototype built with React, Three.js, and Web APIs. This proof-of-concept demonstrates voice interaction with a 3D avatar using only free, browser-based tools.

## ✨ Features

- **3D Animated Avatar**: Interactive doctor character with idle animations and speaking gestures
- **AI-Powered Conversations**: Real AI responses using Anthropic's Claude 3.5 Sonnet
- **RAG System**: Retrieval-Augmented Generation with medical knowledge base
- **Voice Recognition**: Real-time speech-to-text using Web Speech API
- **Text-to-Speech**: Natural voice responses using SpeechSynthesis API
- **Text Chat**: Type messages as an alternative to voice input
- **Conversational UI**: Clean chat interface with message history
- **Visual Feedback**: Listening and speaking indicators with smooth animations
- **Responsive Design**: Beautiful gradient UI with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern browser (Chrome, Edge, or Safari recommended for best Web Speech API support)

### Installation

```bash
# Navigate to project directory
cd ai-doctor-3d

# Install dependencies
npm install

# Set up environment variables
# Create a .env file and add your Anthropic API key:
# ANTHROPIC_API_KEY=your_api_key_here

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### API Setup

1. Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)
2. Create a `.env` file in the root directory
3. Add: `ANTHROPIC_API_KEY=your_api_key_here`
4. Restart the dev server

## 🎮 How to Use

1. **Wait for greeting**: Dr. Aisha will automatically greet you when the page loads
2. **Choose input method**:
   - **Text**: Type your message in the text box and click "Send"
   - **Voice**: Click the microphone button, speak your question, then click again to stop
3. **Get AI response**: Dr. Aisha will:
   - Retrieve relevant medical knowledge from the knowledge base (RAG)
   - Generate a personalized response using Claude 3.5 Sonnet
   - Display the text response in the chat
   - Speak the response aloud
4. **Continue conversation**: The AI maintains context from previous messages

## 📁 Project Structure

```
ai-doctor-3d/
├── src/
│   ├── components/
│   │   ├── DoctorAvatar.jsx    # 3D avatar with animations
│   │   ├── VoiceAgent.jsx      # Main logic, speech APIs, AI conversation
│   │   ├── ChatBubble.jsx      # Message display component
│   │   └── MicButton.jsx       # Voice input button
│   ├── services/
│   │   └── aiService.js        # Client-side API calls with RAG
│   ├── data/
│   │   └── medicalKnowledge.js # RAG knowledge base
│   ├── App.jsx                 # Main app container
│   ├── main.jsx               # React entry point
│   └── index.css              # Tailwind styles
├── server/
│   ├── anthropic-api.js       # Anthropic Claude API integration
│   └── api-plugin.js          # Vite middleware for API routes
├── .env                       # API keys (not in git)
├── .env.example              # Environment template
├── index.html
├── package.json
└── README.md
```

## 🔧 Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Anthropic Claude 3.5 Sonnet**: Advanced AI language model
- **RAG System**: Custom retrieval-augmented generation
- **React Three Fiber**: 3D rendering with Three.js
- **@react-three/drei**: 3D helpers and components
- **Tailwind CSS**: Styling and responsive design
- **Web Speech API**: Browser-native speech recognition
- **SpeechSynthesis API**: Browser-native text-to-speech

## 🎨 Features Breakdown

### 3D Avatar (`DoctorAvatar.jsx`)
- Geometric doctor representation (placeholder for `.glb` model)
- Smooth floating idle animation
- Head nodding and scaling during speech
- Glowing ring indicator when listening
- OrbitControls for interactive viewing

### AI + RAG System
- **Anthropic Claude 3.5 Sonnet**: Advanced language model for natural conversations
- **RAG (Retrieval-Augmented Generation)**: Searches medical knowledge base for relevant context
- **Knowledge Base**: 10+ topics covering services, symptoms, preventive care, emergencies
- **Conversation Context**: Maintains chat history for coherent multi-turn conversations
- **Fallback Responses**: Graceful degradation if API is unavailable

### Voice System (`VoiceAgent.jsx`)
- Automatic greeting on page load
- **Dual Input**: Voice recording OR text chat
- Improved voice recognition (click to start/stop)
- Enhanced speech synthesis with voice selection
- Real-time processing indicators

### UI/UX
- Calming blue gradient background
- Floating chat bubbles
- Animated microphone button
- Real-time status indicators
- Smooth scroll and transitions

## 🧠 How RAG Works

The Retrieval-Augmented Generation system enhances AI responses with relevant medical knowledge:

1. **User Question**: "What services do you offer?"
2. **RAG Retrieval**: System searches knowledge base for matching topics
3. **Context Injection**: Relevant articles added to Claude's system prompt
4. **AI Generation**: Claude generates response using both its training and retrieved knowledge
5. **Result**: More accurate, contextual, and reliable medical guidance

**Knowledge Base Topics:**
- Virtual consultations and services
- Common symptoms (headaches, cold/flu, digestive issues)
- Preventive care and wellness
- Emergency warning signs
- Mental health support
- Chronic condition management
- Appointment scheduling

## 🔄 Future Enhancements

### 1. Premium Voice (ElevenLabs)
```javascript
// Replace speak() function in VoiceAgent.jsx
const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice-id}', {
  method: 'POST',
  headers: {
    'xi-api-key': ELEVENLABS_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ text, voice_settings: {...} })
});
const audioBlob = await response.blob();
const audio = new Audio(URL.createObjectURL(audioBlob));
audio.play();
```

### 2. Real 3D Model
```javascript
// In DoctorAvatar.jsx, replace geometric shapes with:
import { useGLTF } from '@react-three/drei';

function DoctorModel({ isSpeaking }) {
  const { scene } = useGLTF('/assets/doctor.glb');
  return <primitive object={scene} />;
}
```

### 3. Expand Knowledge Base
- Add more medical topics and specialties
- Implement vector embeddings for better retrieval
- Connect to medical databases and research

## 🐛 Known Limitations

- **Browser Compatibility**: Web Speech API works best in Chrome/Edge
- **Voice Quality**: Native TTS is robotic (use ElevenLabs for production)
- **3D Model**: Currently using geometric placeholder (add real `.glb` model)
- **RAG**: Simple keyword matching (could use vector embeddings)
- **API Costs**: Anthropic API usage requires monitoring
- **Mobile**: Limited speech API support on iOS Safari

## 🎯 Production Checklist

- [ ] Replace geometric avatar with professional `.glb` model from Meshy.ai
- [x] Integrate Anthropic API for intelligent responses ✅
- [x] Implement RAG system with medical knowledge base ✅
- [x] Add text chat interface ✅
- [x] Implement conversation memory and context ✅
- [ ] Add ElevenLabs for natural voice synthesis
- [ ] Add user authentication
- [ ] Deploy to Vercel/Netlify
- [ ] Expand knowledge base with more medical topics
- [ ] Implement usage analytics and monitoring
- [ ] Add privacy policy and HIPAA compliance (if medical use)
- [ ] Optimize 3D performance for mobile
- [ ] Add background music toggle
- [ ] Implement multi-language support

## 📝 License

MIT License - Free to use for prototyping and commercial projects

## 🤝 Contributing

This is a prototype project. Feel free to fork and enhance!

## 📧 Support

For issues or questions, create an issue on GitHub.

---

**Built with ❤️ for interactive healthcare experiences**
