import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

interface TitleCardProps {
  title: string;
}

export function TitleCard({ title }: TitleCardProps) {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(title);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View 
      className="bg-white border-[3px] border-[#B83D56] mb-6 px-6 py-6 rounded-2xl flex-row items-center"
      style={{
        shadowColor: '#B83D56',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0, 
      }}
    >
      <View className="flex-1 mr-4 py-1">
        <Text className="text-[#B83D56] font-black text-lg leading-tight">
          {title}
        </Text>
      </View>
      
      <TouchableOpacity 
        onPress={copyToClipboard}
        activeOpacity={0.5}
        className="bg-yellow-300 border-2 border-[#B83D56] px-6 py-5 rounded-xl items-center justify-center"
        style={{
          shadowColor: '#B83D56',
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 1,
          shadowRadius: 0,
        }}
      >
        <Text className="text-[#B83D56] font-black text-sm uppercase tracking-widest">Copy</Text>
      </TouchableOpacity>
    </View>
  );
}
