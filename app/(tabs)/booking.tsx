import { AppContext, Doctor } from '@/context/AppContext';
import { Image } from 'expo-image';
import React, { useContext } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyBooking: React.FC = () => {
  const { doctors } = useContext(AppContext);

  if (!doctors || doctors.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No appointments available.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1 px-4">
        <Text className="pb-3 mt-4 font-medium text-zinc-700 border-b border-gray-200">
          My Appointments
        </Text>

        <FlatList
          data={doctors.slice(0, 3)}
          keyExtractor={(item: Doctor) => item._id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View className="flex-row gap-4 py-4 border-b border-gray-200">

              {/* Image */}
              <Image
                source={item.image}
                className="w-32 h-32 bg-indigo-50 rounded"
                contentFit="cover"
              />

              {/* Info */}
              <View className="flex-1 gap-1">
                <Text className="text-zinc-800 font-semibold text-sm">{item.name}</Text>
                <Text className="text-zinc-600 text-sm">{item.speciality}</Text>
                <Text className="text-zinc-700 font-medium text-sm mt-1">Address:</Text>
                <Text className="text-zinc-600 text-xs">{item.address?.line1}</Text>
                <Text className="text-zinc-600 text-xs">{item.address?.line2}</Text>
                <Text className="text-zinc-600 text-sm mt-1">
                  <Text className="text-zinc-700 font-medium">Date & Time: </Text>
                  01 May 2025 | 11:50 AM
                </Text>
              </View>

              {/* Buttons */}
              <View className="justify-end gap-2">
                <TouchableOpacity className="border border-gray-300 rounded py-2 px-3 items-center">
                  <Text className="text-stone-500 text-sm">Pay Online</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border border-gray-300 rounded py-2 px-3 items-center">
                  <Text className="text-red-500 text-sm">Cancel appointment</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyBooking;