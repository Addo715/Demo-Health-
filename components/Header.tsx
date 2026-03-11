import { Bell, Search, SlidersHorizontal } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white px-5 mt-5 "
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      {/* Top row: Avatar + Greeting + Bell */}
      <View className="flex-row items-center justify-between py-3">

        {/* Left: Avatar + greeting */}
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: '#5f6FFF',
            }}
          />
          <View>
            <Text className="text-gray-400 text-xs font-medium">Hi,</Text>
            <Text className="text-gray-900 text-base font-bold">Addo Emmanuel</Text>
          </View>
        </View>

        {/* Right: Bell icon */}
        <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
          <Bell size={20} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-2 mb-4 gap-2">
        <Search size={18} color="#9ca3af" />
        <Text className="text-gray-400 text-sm flex-1">Search anything</Text>
        <TouchableOpacity className="bg-[#5f6FFF] w-8 h-8 rounded-lg items-center justify-center">
          <SlidersHorizontal size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;