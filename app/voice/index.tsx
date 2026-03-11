import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const VoiceScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-bold text-gray-900">Voice Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default VoiceScreen;