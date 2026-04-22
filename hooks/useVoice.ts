import { useState, useCallback } from 'react';
import * as ExpoSpeechRecognition from 'expo-speech-recognition';

// Safely access modules
const SpeechRecognition = ExpoSpeechRecognition.ExpoSpeechRecognitionModule || ExpoSpeechRecognition.ExpoWebSpeechRecognition;
const useSpeechRecognitionEvent = ExpoSpeechRecognition.useSpeechRecognitionEvent;

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Safely register events if we are in a native build
  if (typeof useSpeechRecognitionEvent === 'function') {
    try {
      useSpeechRecognitionEvent('start', () => setIsListening(true));
      useSpeechRecognitionEvent('end', () => setIsListening(false));
      useSpeechRecognitionEvent('error', (event) => {
        setError(event.error || 'Speech recognition error');
        setIsListening(false);
      });
      useSpeechRecognitionEvent('result', (event) => {
        if (event.results?.[0]?.transcript) {
          setTranscribedText(event.results[0].transcript);
        }
      });
    } catch (e) {
      // Silently fail in Expo Go
    }
  }

  const startListening = useCallback(async () => {
    try {
      setTranscribedText('');
      setError(null);
      
      if (!SpeechRecognition) {
        setError("Please use the TubeTitle app, not Expo Go");
        return;
      }

      const perm = await SpeechRecognition.requestPermissionsAsync?.() || { granted: true };
      if (!perm.granted) {
        setError('Microphone permission denied');
        return;
      }
      
      await SpeechRecognition.start({ 
        lang: 'en-US',
        interimResults: true,
      });
    } catch (e) {
      setError('Could not start voice recognition');
    }
  }, []);
const stopListening = useCallback(async () => {
  try {
    if (!SpeechRecognition) return;
    console.log("Stopping...");
    await SpeechRecognition.stop();
    setIsListening(false);
  } catch (e) {
    console.error("Stop Error:", e);
  }
}, []);

const clearTranscribedText = useCallback(() => {
  setTranscribedText('');
}, []);

return {
  isListening,
  transcribedText,
  error,
  startListening,
  stopListening,
  clearTranscribedText,
};
}

