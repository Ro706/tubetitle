import * as ExpoSpeechRecognition from "expo-speech-recognition";
import { useCallback, useEffect, useRef, useState } from "react";

// Safely access modules
const SpeechRecognition =
  ExpoSpeechRecognition.ExpoSpeechRecognitionModule ||
  ExpoSpeechRecognition.ExpoWebSpeechRecognition;
const useSpeechRecognitionEvent =
  ExpoSpeechRecognition.useSpeechRecognitionEvent;

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

  // Safely register events if we are in a native build
  if (typeof useSpeechRecognitionEvent === "function") {
    try {
      useSpeechRecognitionEvent("start", () => setIsListening(true));
      useSpeechRecognitionEvent("end", () => setIsListening(false));
      useSpeechRecognitionEvent("error", (event) => {
        setError(event.error || "Speech recognition error");
        setIsListening(false);
      });
      useSpeechRecognitionEvent("result", (event) => {
        if (event.results?.[0]?.transcript) {
          setTranscribedText(event.results[0].transcript);
        }
      });
    } catch (e) {
      // Silently fail in Expo Go
    }
  }

  // Handle Silence Timeout: Auto-stop when user stops speaking
  useEffect(() => {
    if (isListening) {
      // Clear existing timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      // If they have spoken some text, wait 10 seconds of silence
      // If they haven't spoken yet, give them 5 seconds to start
      const silenceDelay = transcribedText.length > 0 ? 10000 : 5000;

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
        setError("Please use the TubeTitle app, not Expo Go");
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
        continuous: false, // Explicitly set to false to help auto-stop
      });
    } catch (e) {
      setError("Could not start voice recognition");
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
