import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { AppContext } from '@/context/AppContext';
import { Doctor } from '@/context/AppContext';

const NewDoctors: React.FC = () => {
  const router = useRouter();
  const { doctors } = useContext(AppContext);

  const renderItem: ListRenderItem<Doctor> = ({ item }) => (
    <TouchableOpacity
      className="flex-1 border border-blue-200 rounded-xl overflow-hidden max-w-[48%]"
      onPress={() => router.push(`/appointment/${item._id}`)}
    > 
      <Image
        source={{ uri: item.image }}
        className="w-full h-36 bg-blue-50"
      />
      <View className="p-4">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 bg-green-500 rounded-full" />
          <Text className="text-green-500 text-sm">Available</Text>
        </View>
        <Text className="text-gray-900 text-lg font-medium">{item.name}</Text>
        <Text className="text-gray-600 text-sm">{item.speciality}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="items-center gap-4 my-16 mx-2.5">
      <FlatList
        data={doctors.slice(0, 10)}
        keyExtractor={(item: Doctor) => item._id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
        renderItem={renderItem}
      />
      <TouchableOpacity
        className="bg-blue-50 px-12 py-3 rounded-full mt-10"
        onPress={() => router.push('/doctors')}
      >
        <Text className="text-gray-600">More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewDoctors;