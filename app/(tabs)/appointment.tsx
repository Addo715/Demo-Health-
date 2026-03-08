import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { AppContext, Doctor } from '@/context/AppContext';

const MyAppointment: React.FC = () => {
  const { doctors } = useContext(AppContext);

  if (!doctors || doctors.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">No appointments available.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <Text className="pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-200">
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
              source={{ uri: item.image }}
              className="w-32 h-32 bg-indigo-50 rounded"
              resizeMode="cover"
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
  );
};

export default MyAppointment;