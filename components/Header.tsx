import { assets } from '@/assets/images/assets';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="bg-[#5f6FFF] rounded-b-[40px] px-6 pb-0 overflow-hidden items-center"
      style={{ paddingTop: Math.max(insets.top, 20) }}
    >
      <View className="items-center gap-6 py-12">
        <Text className="text-2xl text-white font-bold leading-tight text-center">
          Book Appointment {'\n'}With Trusted Doctors
        </Text>
        <View className="items-center gap-3">
          <Text className="text-blue-50 text-[11px] font-normal leading-4 text-center max-w-[220px]">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </Text>
          <Image
            source={assets.group_profiles}
            className="w-24 h-8"
            contentFit="contain"
          />
        </View>
        <TouchableOpacity className="flex-row items-center bg-white px-10 py-4 rounded-full self-center shadow-sm -mt-2">
          <Text className="text-[#5f6FFF] font-semibold text-xs">Book Appointment →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;