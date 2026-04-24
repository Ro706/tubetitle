# TubeTitle 📺

TubeTitle is a sleek, AI-powered mobile application built with React Native and Expo that helps creators generate high-CTR YouTube titles using voice input and Google's Gemini AI.

## ✨ Features

- **Voice-to-Title:** Simply speak your video idea, and the AI will "cook" up several viral-ready title options.
- **Gemini AI Integration:** Leverages Google's Gemini models for high-quality, growth-oriented title suggestions.
- **Smart Recording:** Features intelligent silence detection to automatically process your speech.
- **Neobrutalist UI:** A bold, high-contrast design for a modern and punchy user experience.
- **History Tracking:** Keep track of your previous ideas and generated titles.

## 🎙️ Voice Recording Details

The app uses `expo-speech-recognition` with customized timing to ensure a smooth experience:

- **Initial Wait:** If no speech is detected, the recording stops after **5 seconds**.
- **Silence Detection:** Once you start speaking, the app waits for **10 seconds** of silence before automatically processing your request. This gives you plenty of time to pause and think between sentences.
- **Manual Control:** You can always tap the microphone button to stop recording manually at any time.

## 🚀 Getting Started

### 1. Prerequisites

- Node.js
- Expo Go (for basic testing) or a Development Build (recommended for voice features)
- A Google Gemini API Key

### 2. Setup Environment

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Installation

```bash
npm install
```

### 4. Run the App

```bash
npx expo start
```

*Note: Voice recognition features work best on physical devices using a development build.*

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev) / [React Native](https://reactnative.dev)
- **AI:** [Google Gemini API](https://ai.google.dev/)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Icons:** [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native)
- **Voice:** [expo-speech-recognition](https://github.com/michaelyingling/expo-speech-recognition)

---

Developed with ❤️ for YouTube Creators.
