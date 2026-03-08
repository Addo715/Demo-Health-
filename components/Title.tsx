import React from 'react';
import { View, Text } from 'react-native';

interface TitleProps {
  title: string;
  subtitle: string;
}

const Title: React.FC<TitleProps> = ({ title, subtitle }) => {
  return (
    <View className="items-center p-5">
      <Text className="font-bold text-3xl text-gray-900">{title}</Text>
      <Text className="text-base text-gray-600 text-center max-w-xs mt-2">
        {subtitle}
      </Text>
    </View>
  );
};

export default Title;