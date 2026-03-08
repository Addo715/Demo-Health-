import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { specialityData } from '@/assets/images/assets';

interface SpecialityItem {
  speciality: string;
  image: any;
}

const SpecialityMenu: React.FC = () => {
  const router = useRouter();

  return (
    <View className="gap-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, gap: 16, paddingHorizontal: 8 }}
      >
        {(specialityData as SpecialityItem[]).map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center mr-4"
            // onPress={()=> router.push(`/(tabs)/doctors/$item.speciality`)}
          >
            <Image
              source={item.image}
              className="w-16 h-16 mb-2"
              resizeMode="contain"
            />
            <Text className="text-xs text-gray-900">{item.speciality}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SpecialityMenu;