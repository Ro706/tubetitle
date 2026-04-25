import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { Check, Copy, Volume2 } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TitleCardProps {
  title: string;
}

export function TitleCard({ title }: TitleCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(title);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2000);
  };

  const speak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(title, {
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View className="mb-8 mx-1">
      <View
        className="bg-white rounded-2xl overflow-hidden border-2 border-[#B83D56]"
        style={{
          shadowColor: "#B83D56",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        <View className="p-8 flex-row items-center justify-between min-h-[160px]">
          {/* Left: Speaker Icon */}
          <TouchableOpacity
            onPress={speak}
            activeOpacity={0.6}
            className={`p-5 rounded-[24px] ${isSpeaking ? "bg-[#B83D56]" : "bg-slate-50"} mr-5`}
          >
            <Volume2
              size={28}
              color={isSpeaking ? "white" : "#B83D56"}
              strokeWidth={2.5}
            />
          </TouchableOpacity>

          {/* Middle: Title Text */}
          <View className="flex-1 mr-5">
            <Text
              className="text-slate-800 font-bold text-2xl leading-8"
              numberOfLines={4}
            >
              {title}
            </Text>
          </View>

          {/* Right: Copy Icon */}
          <TouchableOpacity
            onPress={copyToClipboard}
            activeOpacity={0.7}
            className={`w-24 h-24 rounded-[28px] items-center justify-center ${copied ? "bg-green-500" : "bg-yellow-400"}`}
            style={{
              shadowColor: copied ? "#22c55e" : "#eab308",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 12,
            }}
          >
            {copied ? (
              <Check size={36} color="white" strokeWidth={3} />
            ) : (
              <Copy size={36} color="#B83D56" strokeWidth={2.5} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
