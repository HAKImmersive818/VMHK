# 🔊 Voice Greeting Feature

## ✅ What's Implemented

The app is configured to automatically speak the greeting when the page loads:

**Greeting Message:**
> "Hi, I'm Dr. Chowdhury from VisiMedica, welcome to our clinic! How can I help you today?"

## 🎯 How It Works

1. **Page loads** → Wait 1.5 seconds for full initialization
2. **Display greeting** → Text appears in chat
3. **Speak greeting** → Voice audio plays automatically
4. **Retry logic** → Attempts twice in case voices need to load

## 🌐 Browser Autoplay Policies

**Important:** Modern browsers block autoplay audio until user interaction.

### Chrome/Edge
- ✅ Usually allows speech synthesis autoplay
- May require user to click anywhere on page first

### Safari
- ⚠️ Stricter autoplay policy
- Often requires user interaction before audio plays

### Firefox
- ✅ Generally allows speech synthesis

## 🧪 Testing the Greeting

1. **Open the app:** http://localhost:5173
2. **Wait 1.5 seconds** after page loads
3. **Listen for:** Dr. Chowdhury's voice greeting
4. **Check console:** Look for "✅ Greeting spoken successfully"

### If You Don't Hear It

**Troubleshooting:**
1. Check browser console for errors
2. Ensure volume is up
3. Try clicking anywhere on the page, then refresh
4. Check browser settings → Site permissions → Sound

### Console Messages

**Success:**
```
✅ Greeting spoken successfully
Speech started
Using voice: [Voice Name]
```

**Blocked:**
```
⚠️ Autoplay blocked by browser. User interaction needed.
```

## 🔧 Technical Details

**Location:** `src/components/VoiceAgent.jsx`

**Implementation:**
- Uses Web Speech API `SpeechSynthesis`
- 1.5 second delay for page load
- Automatic retry after 500ms
- Voice selection (prefers female voices)
- Fallback handling for autoplay restrictions

**Voice Settings:**
- Rate: 0.95 (slightly slower for clarity)
- Pitch: 1.1 (slightly higher for friendliness)
- Volume: 1.0 (maximum)

## 💡 User Experience

Even if autoplay is blocked:
- ✅ Greeting text still appears in chat
- ✅ User can click microphone or type to interact
- ✅ All subsequent AI responses will speak normally
- ✅ No error messages shown to user

The greeting will speak on **every page load/refresh** as long as browser allows it!
