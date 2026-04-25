import { useCallback, useEffect, useRef, useState } from "react";

// Safely require the module to prevent top-level crashes in Expo Go
let ExpoSpeechRecognition: any = null;
try {
  ExpoSpeechRecognition = require("expo-speech-recognition");
} catch (e) {
  // Silent fail, handled below
}

const SpeechRecognition = ExpoSpeechRecognition 
  ? (ExpoSpeechRecognition.ExpoSpeechRecognitionModule || ExpoSpeechRecognition.ExpoWebSpeechRecognition)
  : null;

// Fallback dummy hook to satisfy the Rules of Hooks
const useSpeechRecognitionEvent = ExpoSpeechRecognition?.useSpeechRecognitionEvent || (() => {});

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopListening = useCallback(async () => {
    try {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      if (!SpeechRecognition) return;
      console.log("Stopping voice recognition...");
      await SpeechRecognition.stop();
      setIsListening(false);
    } catch (e) {
      console.error("Stop Error:", e);
    }
  }, []);

  // REGISTER HOOKS AT TOP LEVEL (Unconditionally)
  useSpeechRecognitionEvent("start", useCallback(() => setIsListening(true), []));
  useSpeechRecognitionEvent("end", useCallback(() => setIsListening(false), []));
  useSpeechRecognitionEvent("error", useCallback((event: any) => {
    setError(event.error || "Speech recognition error");
    setIsListening(false);
  }, []));
  useSpeechRecognitionEvent("result", useCallback((event: any) => {
    if (event.results?.[0]?.transcript) {
      setTranscribedText(event.results[0].transcript);
    }
  }, []));

  // Handle Silence Timeout: Auto-stop when user stops speaking
  useEffect(() => {
    if (isListening) {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // Wait 10 seconds of silence before auto-stopping
      const silenceDelay = 10000;

      silenceTimeoutRef.current = setTimeout(() => {
        console.log("Silence detected, auto-stopping...");
        stopListening();
      }, silenceDelay);
    }

    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, [isListening, transcribedText, stopListening]);

  const startListening = useCallback(async () => {
    try {
      setTranscribedText("");
      setError(null);

      if (!SpeechRecognition) {
        setError("Speech recognition is not available in this environment (e.g. Expo Go). Please use a development build.");
        return;
      }

      const perm = (await SpeechRecognition.requestPermissionsAsync?.()) || {
        granted: true,
      };
      if (!perm.granted) {
        setError("Microphone permission denied");
        return;
      }

      await SpeechRecognition.start({
        lang: "en-US",
        interimResults: true,
        continuous: true, // Allow continuous listening so our 10s timeout can manage the stop
      });
    } catch (e) {
      setError("Could not start voice recognition");
      console.error(e);
    }
  }, []);

  const clearTranscribedText = useCallback(() => {
    setTranscribedText("");
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
