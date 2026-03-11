import { CalendarDays, Clock, Video } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const appointments = [
  {
    id: '1',
    doctor: 'Prof. Dr. Logan Mason',
    speciality: 'Dentist',
    dateFrom: 'June 12, 9:30 AM',
    dateTo: 'June 12, 10:00 AM',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    doctor: 'Dr. Amelia Emma',
    speciality: 'Gynecologist',
    dateFrom: 'June 14, 11:00 AM',
    dateTo: 'June 14, 11:30 AM',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    doctor: 'Dr. Daniel Jack',
    speciality: 'Cardiologist',
    dateFrom: 'June 15, 2:00 PM',
    dateTo: 'June 15, 2:30 PM',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
];

const UpcomingSchedule: React.FC = () => {
  return (
    <View className="px-5 mt-10 gap-4">

      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-gray-900">Upcoming Schedule</Text>
          <View className="bg-[#5f6FFF] rounded-full w-6 h-6 items-center justify-center">
            <Text className="text-white text-[11px] font-bold">{appointments.length}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text className="text-sm font-semibold text-[#5f6FFF]">View all</Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 8, paddingHorizontal: 2 }}
      >
        {appointments.map((item) => (
          <View
            key={item.id}
            style={{
              width: 280,
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 30,
              gap: 25,
              // Shadow
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            {/* Doctor info row */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: '#e0e7ff',
                  }}
                />
                <View>
                  <Text className="text-gray-900 font-bold text-sm">{item.doctor}</Text>
                  <Text className="text-gray-400 text-xs mt-0.5">{item.speciality}</Text>
                </View>
              </View>

              {/* Video icon */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#eff2ff',
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Video size={16} color="#5f6FFF" />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-gray-100" />

            {/* Date & Time row */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <CalendarDays size={13} color="#5f6FFF" />
                <Text className="text-gray-500 text-xs">{item.dateFrom}</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Clock size={13} color="#5f6FFF" />
                <Text className="text-gray-500 text-xs">{item.dateTo}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default UpcomingSchedule;