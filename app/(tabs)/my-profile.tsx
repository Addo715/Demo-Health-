import { assets } from '@/assets/images/assets';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState({
    name: 'Addo Emmanuel',
    image: assets.profile_pic,
    email: 'emma141509@gmail.com',
    phone: '+233 550 122 715',
    address: {
      line1: 'Oyarifa Abokobi, Street',
      line2: 'America House, East Legon',
    },
    gender: 'Male',
    dob: '2003-09-22',
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1 px-6">

        {/* Header */}
        <View className="py-6">
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
            My Profile
          </Text>
        </View>

        {/* Profile Picture + Name */}
        <View className="items-center py-4">
          <View className="relative">
            <Image
              source={userData.image}
              className="w-32 h-32 rounded-full border-4 border-blue-50"
              contentFit="cover"
            />
            <View className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
          </View>

          {isEdit ? (
            <TextInput
              className="text-2xl font-bold text-gray-900 mt-4 bg-gray-50 px-3 py-1 rounded-xl text-center border border-gray-200"
              value={userData.name}
              onChangeText={(val) =>
                setUserData((prev) => ({ ...prev, name: val }))
              }
            />
          ) : (
            <Text className="text-2xl font-bold text-gray-900 mt-4">
              {userData.name}
            </Text>
          )}

          <Text className="text-blue-600 font-semibold bg-blue-50 px-4 py-1.5 rounded-full mt-2 uppercase tracking-widest text-[10px]">
            Patient
          </Text>
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-zinc-200 my-4" />

        {/* Contact Information */}
        <View className="gap-4 mt-2">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Contact Information
          </Text>

          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-5 gap-4">

            {/* Email */}
            <View className="flex-row gap-3">
              <Text className="text-sm font-medium text-gray-500 w-20">Email:</Text>
              <Text className="text-sm text-blue-500 font-medium flex-1">
                {userData.email}
              </Text>
            </View>

            <View className="h-[1px] bg-gray-200" />

            {/* Phone */}
            <View className="flex-row gap-3 items-center">
              <Text className="text-sm font-medium text-gray-500 w-20">Phone:</Text>
              {isEdit ? (
                <TextInput
                  className="flex-1 bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-800 border border-gray-200"
                  value={userData.phone}
                  onChangeText={(val) =>
                    setUserData((prev) => ({ ...prev, phone: val }))
                  }
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-sm text-gray-800 font-medium flex-1">
                  {userData.phone}
                </Text>
              )}
            </View>

            <View className="h-[1px] bg-gray-200" />

            {/* Address */}
            <View className="flex-row gap-3">
              <Text className="text-sm font-medium text-gray-500 w-20">Address:</Text>
              {isEdit ? (
                <View className="flex-1 gap-2">
                  <TextInput
                    className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-800 border border-gray-200"
                    value={userData.address.line1}
                    onChangeText={(val) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: val },
                      }))
                    }
                  />
                  <TextInput
                    className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-800 border border-gray-200"
                    value={userData.address.line2}
                    onChangeText={(val) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: val },
                      }))
                    }
                  />
                </View>
              ) : (
                <View className="flex-1">
                  <Text className="text-sm text-gray-800 font-medium leading-5">
                    {userData.address.line1}
                  </Text>
                  <Text className="text-sm text-gray-800 font-medium leading-5">
                    {userData.address.line2}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Basic Information */}
        <View className="gap-4 mt-6">
          <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Basic Information
          </Text>

          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-5 gap-4">

            {/* Gender */}
            <View className="flex-row gap-3 items-center">
              <Text className="text-sm font-medium text-gray-500 w-20">Gender:</Text>
              {isEdit ? (
                <View className="flex-row gap-2">
                  {['Male', 'Female'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() =>
                        setUserData((prev) => ({ ...prev, gender: g }))
                      }
                      className={`px-4 py-1.5 rounded-full border ${
                        userData.gender === g
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          userData.gender === g ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text className="text-sm text-gray-400 font-medium">
                  {userData.gender}
                </Text>
              )}
            </View>

            <View className="h-[1px] bg-gray-200" />

            {/* Date of Birth */}
            <View className="flex-row gap-3 items-center">
              <Text className="text-sm font-medium text-gray-500 w-20">Birthday:</Text>
              {isEdit ? (
                <TextInput
                  className="bg-gray-100 rounded-lg px-3 py-1.5 text-sm text-gray-800 border border-gray-200"
                  value={userData.dob}
                  onChangeText={(val) =>
                    setUserData((prev) => ({ ...prev, dob: val }))
                  }
                  placeholder="YYYY-MM-DD"
                />
              ) : (
                <Text className="text-sm text-gray-400 font-medium">
                  {userData.dob}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Save / Edit + Logout Buttons */}
        <View className="mt-10 gap-4 pb-32">
          <TouchableOpacity
            onPress={() => setIsEdit((prev) => !prev)}
            className="border border-[#5F6FFF] py-4 rounded-2xl items-center"
            style={{ backgroundColor: isEdit ? '#5F6FFF' : 'transparent' }}
          >
            <Text
              className="font-bold text-base"
              style={{ color: isEdit ? '#fff' : '#5F6FFF' }}
            >
              {isEdit ? 'Save Information' : 'Edit Information'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="border border-red-100 bg-red-50 py-4 rounded-2xl items-center">
            <Text className="text-red-500 font-bold text-base">Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;