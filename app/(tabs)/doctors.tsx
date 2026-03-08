import { AppContext, Doctor } from "@/context/AppContext";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const specialities = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

const doctors: React.FC = () => {
  const router = useRouter();
  const { speciality } = useLocalSearchParams<{ speciality?: string }>();
  const { doctors } = useContext(AppContext);
  const [filter, setFilter] = useState<Doctor[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const applyFilter = () => {
    if (speciality) {
      setFilter(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilter(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const handleSpecialityPress = (item: string) => {
    if (speciality === item) {
      router.push("/(tabs)/doctors");
    } else {
      router.push("/(tabs)/doctors");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1 px-4">
        <Text className="text-gray-600 mt-2">
          Browse through the doctors specialist.
        </Text>

        <View className="flex-col sm:flex-row items-start gap-5 mt-5">
          {/* Filter Toggle Button */}
          <TouchableOpacity
            className={`py-1 px-3 border rounded mb-3 ${showFilter ? "bg-[#5F6FFF]" : "bg-white"}`}
            onPress={() => setShowFilter((prev) => !prev)}
          >
            <Text
              className={`text-sm ${showFilter ? "text-white" : "text-gray-600"}`}
            >
              Filters
            </Text>
          </TouchableOpacity>

          {/* Filter List */}
          {showFilter && (
            <View className="flex-col gap-3 mb-5">
              {specialities.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSpecialityPress(item)}
                  className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded ${speciality === item ? "bg-[#5F6FFF]" : "bg-white"
                    }`}
                >
                  <Text
                    className={`text-sm ${speciality === item ? "text-white" : "text-gray-600"}`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Doctors Grid */}
          <FlatList
            className="w-full"
            data={filter}
            keyExtractor={(item) => item._id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-1 border border-blue-200 rounded-xl overflow-hidden max-w-[48%]"
              // onPress={() => router.push(`/appointment/${item._id}`)}
              >
                <Image
                  source={item.image}
                  className="w-full h-36 bg-blue-50"
                />
                <View className="p-4">
                  <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 bg-green-500 rounded-full" />
                    <Text className="text-green-500 text-sm">Available</Text>
                  </View>
                  <Text className="text-gray-900 text-lg font-medium">
                    {item.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">{item.speciality}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default doctors;
