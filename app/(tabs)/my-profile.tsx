import { assets } from '@/assets/images/assets';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyProfileScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</Text>
        </View>

        {/* User Identity */}
        <View className="items-center py-8">
          <View className="relative">
            <Image
              source={assets.profile_pic}
              className="w-32 h-32 rounded-full border-4 border-blue-50"
              contentFit="cover"
            />
            <View className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mt-4">Julius Dagana</Text>
          <Text className="text-sm text-blue-600 font-semibold bg-blue-50 px-4 py-1.5 rounded-full mt-2 uppercase tracking-widest text-[10px]">
            Patient
          </Text>
        </View>

        {/* Information Section */}
        <View className="gap-5 mt-4">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Personal Information</Text>

          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-5 gap-4">
            <View>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Email Address</Text>
              <Text className="text-sm text-gray-800 font-medium">julius.dagana@example.com</Text>
            </View>

            <View className="h-[1px] bg-gray-200 w-full" />

            <View>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Phone Number</Text>
              <Text className="text-sm text-gray-800 font-medium">+1 (555) 000-1234</Text>
            </View>

            <View className="h-[1px] bg-gray-200 w-full" />

            <View>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Address</Text>
              <Text className="text-sm text-gray-800 font-medium leading-5">
                57th Cross, Richmond{'\n'}Circle, Ring Road, London
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="mt-12 gap-4 pb-12">
          <TouchableOpacity className="bg-[#1A56FF] py-4 rounded-2xl items-center">
            <Text className="text-white font-bold text-base">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-red-100 bg-red-50/30 py-4 rounded-2xl items-center">
            <Text className="text-red-500 font-bold text-base">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;