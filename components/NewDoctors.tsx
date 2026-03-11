import { AppContext, Doctor } from '@/context/AppContext';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import React, { useContext } from 'react';
import { FlatList, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';

cssInterop(Image, { className: 'style' });

const NewDoctors: React.FC = () => {
  const router = useRouter();
  const { doctors } = useContext(AppContext);

  const renderItem: ListRenderItem<Doctor> = ({ item }) => (
    <TouchableOpacity
      className="flex-1 bg-white border border-gray-100 rounded-2xl overflow-hidden max-w-[48%] shadow-sm pb-2"
      onPress={() => router.push(`/appointment/${item._id}` as any)}
    >
      <Image
        source={item.image}
        className="w-full h-40 bg-indigo-50"
        contentFit="cover"
      />
      <View className="p-3">
        <View className="flex-row items-center gap-1.5 mb-1.5">
          <View className="w-2 h-2 bg-green-500 rounded-full" />
          <Text className="text-green-600 text-[11px] font-medium">Available</Text>
        </View>
        <Text className="text-gray-900 text-base font-bold" numberOfLines={1}>{item.name}</Text>
        <Text className="text-gray-500 text-xs mt-0.5">{item.speciality}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="gap-4 my-6 mx-2.5 mt-10">

      {/* Title row */}
      <View className="flex-row items-center justify-between px-2">
        <Text className="text-lg font-bold text-gray-900">Top Doctors to Book</Text>
        <TouchableOpacity onPress={() => router.push('/doctors')}>
          <Text className="text-sm font-semibold text-[#5f6FFF]">View all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={doctors.slice(0, 4)}
        keyExtractor={(item: Doctor) => item._id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
        renderItem={renderItem}
      />

      {/* <TouchableOpacity
        className="border border-gray-200 bg-white px-14 py-3.5 rounded-full mt-4 self-center active:bg-gray-50"
        onPress={() => router.push('/doctors')}
      >
        <Text className="text-gray-600 font-semibold text-sm">See More</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default NewDoctors;