// import { specialityData } from '@/assets/images/assets';
// import { Image } from 'expo-image';
// import { useRouter } from 'expo-router';
// import { cssInterop } from 'nativewind';
// import React from 'react';
// import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// cssInterop(Image, { className: 'style' });

// interface SpecialityItem {
//   speciality: string;
//   image: any;
// }

// const SpecialityMenu: React.FC = () => {
//   const router = useRouter();

//   return (
//     <View className="gap-4">
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingTop: 20, gap: 16, paddingHorizontal: 8 }}
//       >

//   {/* Text */}
//       <View className="flex-row items-center justify-between px-2">
//         <Text>Find by Speciality</Text>
//         <Text>View all</Text>

//       </View>
//         {(specialityData as SpecialityItem[]).map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             className="items-center mr-6"
//           // onPress={()=> router.push(`/(tabs)/doctors/$item.speciality`)}
//           >
//             <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-3">
//               <Image
//                 source={item.image}
//                 className="w-12 h-12"
//                 contentFit="contain"
//               />
//             </View>
//             <Text className="text-[13px] font-medium text-gray-700">{item.speciality}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default SpecialityMenu;


import { specialityData } from '@/assets/images/assets';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

cssInterop(Image, { className: 'style' });

interface SpecialityItem {
  speciality: string;
  image: any;
}

const SpecialityMenu: React.FC = () => {
  const router = useRouter();

  return (
    <View className="gap-4 mt-10">

      {/* Title row — outside ScrollView so it stays fixed on top */}
      <View className="flex-row items-center justify-between px-5 pt-4">
        <Text className="text-lg font-bold text-gray-900">Find by Speciality</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/doctors')}>
          <Text className="text-sm font-semibold text-[#5f6FFF]">View all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, gap: 16, paddingHorizontal: 8 }}
      >
        {(specialityData as SpecialityItem[]).map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center mr-6"
          // onPress={()=> router.push(`/(tabs)/doctors/$item.speciality`)}
          >
            <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-3">
              <Image
                source={item.image}
                className="w-12 h-12"
                contentFit="contain"
              />
            </View>
            <Text className="text-[13px] font-medium text-gray-700">{item.speciality}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SpecialityMenu;