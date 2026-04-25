import * as Haptics from "expo-haptics";
import { Mic } from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from "react-native-reanimated";

interface MicButtonProps {
  isListening: boolean;
  onPress: () => void;
}

export function MicButton({ isListening, onPress }: MicButtonProps) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      pulse.value = withRepeat(withTiming(1.2, { duration: 500 }), -1, true);
    } else {
      pulse.value = withTiming(1);
    }
  }, [isListening, pulse]);

  const handlePress = () => {
    console.log("MicButton Pressed!");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onPress();
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isListening ? 1.1 : 1) }],
    backgroundColor: isListening ? "#fde047" : "#ffffff",
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: isListening ? 1 : 0,
  }));

  return (
    <View className="items-center justify-center h-40 w-40">
      <Animated.View
        className="absolute w-32 h-32 rounded-full border-[6px] border-[#B83D56] bg-pink-200"
        style={ringStyle}
      />
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          {
            transform: [
              { translateY: pressed ? 4 : 0 },
              { translateX: pressed ? 4 : 0 },
            ],
          },
        ]}
      >
        <Animated.View
          className="w-28 h-24 rounded-3xl border-[4px] border-[#B83D56] items-center justify-center"
          style={[
            buttonStyle,
            {
              shadowColor: "#B83D56",
              shadowOffset: { width: 12, height: 12 },
              shadowOpacity: 1,
              shadowRadius: 0,
            },
          ]}
        >
          <Mic
            size={48}
            color="#B83D56"
            strokeWidth={3}
            fill={isListening ? "#B83D56" : "transparent"}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}
