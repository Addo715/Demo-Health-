import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { assets } from '@/assets/images/assets';

const Header: React.FC = () => {
  return (
    <View className="flex-row flex-wrap bg-[#5f6FFF] rounded-lg px-5">
      {/* Left */}
      <View className="flex-1 justify-center gap-4 py-10 min-w-[200px]">
        <Text className="text-3xl text-white font-semibold leading-tight">
          Book Appointment {'\n'}With Trusted Doctors
        </Text>
        <View className="flex-row items-center gap-3 flex-wrap">
          <Image
            source={assets.group_profiles}
            className="w-28 h-10"
            resizeMode="contain"
          />
          <Text className="text-white text-xs font-light flex-1">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </Text>
        </View>
        <TouchableOpacity className="flex-row items-center bg-white px-8 py-3 rounded-full self-start">
          <Text className="text-gray-600 text-sm">Book Appointment →</Text>
        </TouchableOpacity>
      </View>

      {/* Right */}
      <View className="w-1/2">
        <Image
          source={assets.header_img}
          className="w-full h-64 rounded-lg"
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default Header;