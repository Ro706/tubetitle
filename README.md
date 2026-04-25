# TubeTitle 📺

TubeTitle is a sleek, AI-powered mobile application built with React Native and Expo that helps creators generate high-CTR YouTube titles using voice input and Google's Gemini AI.

## ✨ Features

- **🎙️ Voice-to-Title:** Simply speak your video idea, and the AI will "cook" up several viral-ready title options.
- **🤖 Gemini AI Integration:** Leverages Google's Gemini models for high-quality, growth-oriented title suggestions.
- **🔊 Text-to-Speech:** Listen to your generated titles read aloud to see how they sound.
- **💎 Premium Modern UI:** A clean, professional design with smooth transitions and tactile feedback.
- **📜 History Tracking:** Keep track of your previous ideas and generated titles locally.
- **⚡ Smart Recording:** 10-second continuous listening mode to catch every detail of your idea.

## 🎙️ Voice Recording Details

The app uses `expo-speech-recognition` with a customized configuration for a superior experience:

- **10s Silence Timeout:** The app features a generous 10-second silence window, allowing you to pause and think between sentences without the recording cutting off.
- **Continuous Mode:** Enabled at the native level to ensure high-fidelity recognition during longer explanations.
- **Manual Control:** Tap the primary microphone circle to start or stop recording at any time.

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (Latest LTS)
- Android SDK (with **Android 36** platforms installed)
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

### 4. Running the Development Build (Required for Voice)

Since this app uses custom native modules, it **cannot run in the standard Expo Go app**. You must create a development build:

```powershell
# 1. Set your Android SDK path
$env:ANDROID_HOME="C:\Users\<YourUser>\AppData\Local\Android\Sdk"

# 2. Run the build (requires physical device or emulator)
npx expo run:android
```

## 🛠️ Tech Stack

- **Framework:** [Expo](https://expo.dev) (SDK 54)
- **AI:** [Google Gemini API](https://ai.google.dev/) (Flash/Pro)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Icons:** [Lucide React Native](https://lucide.dev/)
- **Voice Recognition:** [expo-speech-recognition](https://github.com/michaelyingling/expo-speech-recognition)
- **Text to Speech:** [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/)

## 🏗️ Build Configuration

- **Android SDK:** 36 (Compile/Target)
- **Memory:** Optimized Gradle build with 4GB Heap / 1GB Metaspace for reliable release packaging.

---

Developed with ❤️ for YouTube Creators.
