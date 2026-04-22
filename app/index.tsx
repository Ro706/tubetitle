import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import {
  History as HistoryIcon,
  Mic as MicIcon,
  RefreshCw,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MicButton } from "../components/MicButton";
import { TitleCard } from "../components/TitleCard";
import { useHistory } from "../hooks/useHistory";
import { useVoice } from "../hooks/useVoice";
import { GeneratedTitle, generateTitles } from "../lib/gemini";

export default function GenerateScreen() {
  const {
    isListening,
    transcribedText,
    startListening,
    stopListening,
    error,
    clearTranscribedText,
  } = useVoice();
  const { addToHistory } = useHistory();

  const [titles, setTitles] = useState<GeneratedTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const wasListening = useRef(false);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setTitles([]);
      clearTranscribedText();
      startListening();
    }
  };

  const handleGenerate = useCallback(
    async (text: string) => {
      if (!text || text.length < 3 || isLoading) return;
      setIsLoading(true);
      setLastQuery(text);
      try {
        const result = await generateTitles(text);
        if (result && result.length > 0) {
          if (result[0].text.includes("Error:")) {
            Alert.alert("API Note", result[0].text);
            setTitles([]);
          } else {
            setTitles(result);
            addToHistory(text, result);
          }
        }
      } catch (err) {
        Alert.alert("Error", "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    },
    [addToHistory, isLoading],
  );

  useEffect(() => {
    if (
      wasListening.current &&
      !isListening &&
      transcribedText &&
      transcribedText.length > 3
    ) {
      handleGenerate(transcribedText);
    }
    wasListening.current = isListening;
  }, [isListening, transcribedText, handleGenerate]);

  const copyAll = async () => {
    const allTitles = titles.map((t) => t.text).join("\n");
    await Clipboard.setStringAsync(allTitles);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <LinearGradient colors={["#F3A6A6", "#E58B8B"]} className="flex-1">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-6">
          <View className="bg-[#F3A6A6] px-4 py-2 rounded-lg">
            <Text className="text-white font-black text-xl italic">
              TUBE TITLE
            </Text>
          </View>
          <Link href="/history" asChild>
            <TouchableOpacity
              className="p-3 rounded-xl"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 8, height: 8 },
                shadowOpacity: 1,
                shadowRadius: 0,
              }}
            >
              <HistoryIcon size={24} color="#fdfdfd" strokeWidth={3} />
            </TouchableOpacity>
          </Link>
        </View>

        <View className="flex-1 px-6">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <View
                className="bg-white border-[4px] border-[#B83D56] p-8 rounded-3xl"
                style={{
                  shadowColor: "#B83D56",
                  shadowOffset: { width: 10, height: 10 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                }}
              >
                <ActivityIndicator size="large" color="#B83D56" />
                <Text className="text-[#B83D56] mt-6 font-black text-2xl uppercase tracking-tighter">
                  Cooking Titles...
                </Text>
              </View>
            </View>
          ) : titles.length > 0 ? (
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-[#B83D56] font-black text-2xl uppercase">
                  RESULTS
                </Text>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
              >
                {titles.map((title, index) => (
                  <TitleCard key={index} title={title.text} />
                ))}

                <TouchableOpacity
                  onPress={() => handleGenerate(lastQuery)}
                  className="bg-white border-[3px] border-[#B83D56] py-5 rounded-2xl flex-row items-center justify-center"
                  style={{
                    shadowColor: "#B83D56",
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 1,
                    shadowRadius: 0,
                  }}
                >
                  <RefreshCw size={24} color="#B83D56" strokeWidth={4} />
                  <Text className="text-[#B83D56] font-black ml-3 text-lg uppercase">
                    Regenerate
                  </Text>
                </TouchableOpacity>

                <View className="mt-12 items-center">
                  <MicButton
                    isListening={isListening}
                    onPress={toggleListening}
                  />
                </View>
              </ScrollView>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Pressable 
                onPress={toggleListening}
                className="w-80 h-80 bg-white border-[12px] border-[#B83D56] rounded-full items-center justify-center p-10"                style={({ pressed }) => ({
                  shadowColor: "#B83D56",
                  shadowOffset: {
                    width: pressed ? 4 : 16,
                    height: pressed ? 4 : 16,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                  transform: [
                    { translateY: pressed ? 12 : 0 },
                    { translateX: pressed ? 12 : 0 },
                  ],
                })}
              >
                {isListening ? (
                  <View className="items-center">
                    <Text className="text-[#B83D56] text-center text-2xl font-black uppercase leading-tight italic mb-4">
                      Tap to Stop
                    </Text>
                    <View className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                  </View>
                ) : transcribedText ? (
                  <Text className="text-[#B83D56] text-center text-lg font-bold">
                    "{transcribedText}"
                  </Text>
                ) : (
                  <View className="items-center">
                    <Text className="text-[#B83D56] text-center text-3xl font-black uppercase tracking-tighter mb-6 leading-none">
                      Speak your content
                    </Text>
                    <MicIcon size={64} color="#B83D56" strokeWidth={4} />
                  </View>
                )}
              </Pressable>

              {!isListening && !transcribedText && (
                <Text className="text-[#B83D56]/60 font-bold mt-12 uppercase tracking-widest text-xs italic">
                  Tap the circle to start
                </Text>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
