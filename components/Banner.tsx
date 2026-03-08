import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { assets } from '@/assets/images/assets';

const Banner: React.FC = () => {
  const router = useRouter();

  return (
    <View className="flex-row bg-[#5f6FFF] rounded-lg px-6 my-20 mx-2.5 overflow-hidden items-end">
      {/* Left */}
      <View className="flex-1 py-10">
        <Text className="text-2xl font-semibold text-white">Book Appointment</Text>
        <Text className="text-2xl font-semibold text-white mt-4">
          With 100+ Trusted Doctors
        </Text>
        <TouchableOpacity
          className="bg-white px-8 py-3 rounded-full mt-6 self-start"
          onPress={() => router.push('/login')}
        >
          <Text className="text-gray-600 text-sm">Create account</Text>
        </TouchableOpacity>
      </View>

      {/* Right */}
      <View className="w-40">
        <Image
          source={assets.appointment_img}
          className="w-full h-52"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default Banner;