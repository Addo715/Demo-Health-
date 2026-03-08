import { assets } from '@/assets/images/assets';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Header: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row bg-[#5f6FFF] rounded-b-[40px] px-6 pb-0 overflow-hidden"
      style={{ paddingTop: Math.max(insets.top, 20) }}
    >
      {/* Left */}
      <View className="flex-1 justify-center gap-6 py-12">
        <Text className="text-2xl text-white font-bold leading-tight">
          Book Appointment {'\n'}With Trusted Doctors
        </Text>
        <View className="gap-3">
          <Text className="text-blue-50 text-[11px] font-normal leading-4 max-w-[220px]">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </Text>
          <Image
            source={assets.group_profiles}
            className="w-24 h-8"
            contentFit="contain"
          />
        </View>
        <TouchableOpacity className="flex-row items-center bg-white px-10 py-4 rounded-full self-start shadow-sm -mt-2">
          <Text className="text-[#5f6FFF] font-semibold text-xs">Book Appointment →</Text>
        </TouchableOpacity>
      </View>

      {/* Right */}
      <View className="w-[52%] items-center justify-end">
        <Image
          source={assets.header_img}
          className="w-full h-[420px] mt-[-100px] -mb-4"
          contentFit="contain"
        />
      </View>
    </View>
  );
};

export default Header;