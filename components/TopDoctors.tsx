import React from 'react';
import { Text, View } from 'react-native';

interface TopDoctorsProps {
  title: string;
  subtitle: string;
}

const TopDoctors: React.FC<TopDoctorsProps> = ({ title, subtitle }) => {
  return (
    <View className="items-center px-5 py-12">
      <Text className="font-bold text-3xl text-gray-900 tracking-tight">{title}</Text>
      <Text className="text-sm text-gray-500 text-center max-w-sm mt-3 leading-5">
        {subtitle}
      </Text>
    </View>
  );
};

export default TopDoctors;