import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useHistory } from '../hooks/useHistory';
import { TitleCard } from '../components/TitleCard';

import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const { history } = useHistory();
  const router = useRouter();

  // Group history by date
  const groupedHistory = history.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, typeof history>);

  return (
    <LinearGradient
      colors={['#F3A6A6', '#E58B8B']}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="px-6 py-6 flex-1">
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="p-3 bg-white border-[3px] border-[#B83D56] rounded-xl"
              style={{ shadowColor: '#B83D56', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 1, shadowRadius: 0 }}
            >
              <ArrowLeft size={24} color="#B83D56" strokeWidth={3} />
            </TouchableOpacity>
            <View className="bg-[#B83D56] px-4 py-2 border-2 border-white rounded-lg">
               <Text className="text-white font-black text-2xl uppercase italic">History</Text>
            </View>
            <View style={{ width: 50 }} />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.entries(groupedHistory).map(([date, items]) => (
              <View key={date} className="mb-10">
                <View className="bg-yellow-300 border-2 border-[#B83D56] self-start px-3 py-1 mb-4 rounded-lg" style={{ shadowColor: '#B83D56', shadowOffset: { width: 6, height: 6 }, shadowOpacity: 1, shadowRadius: 0 }}>
                    <Text className="text-[#B83D56] font-black uppercase text-sm">{date}</Text>
                </View>
                
                {items.map((item) => (
                  <View key={item.id} className="mb-6">
                    <Text className="text-[#B83D56] font-black mb-3 text-lg italic">&quot;{item.query}&quot;</Text>
                    {item.titles.map((title, idx) => (
                      <TitleCard key={`${item.id}-${idx}`} title={title.text} />
                    ))}
                  </View>
                ))}
              </View>
            ))}
            
            {history.length === 0 && (
              <View className="flex-1 items-center justify-center py-20">
                <View className="bg-white border-4 border-[#B83D56] p-8 rounded-3xl" style={{ shadowColor: '#B83D56', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 1, shadowRadius: 0 }}>
                    <Text className="text-[#B83D56] font-black text-xl uppercase">No History Found</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
