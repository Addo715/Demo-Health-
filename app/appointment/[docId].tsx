import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router'
import { AppContext } from '@/context/AppContext'
import { assets } from '@/assets/images/assets';
import RelatedDoctors from '@/components/RelatedDoctors'
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeSlot {
  dateTime: Date
  time: string
}

interface Doctor {
  _id: string
  name: string
  image: any
  degree: string
  speciality: string
  experience: string
  about: string
  fees: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

// ─── Component ────────────────────────────────────────────────────────────────

const Appointment: React.FC = () => {
  const { docId } = useLocalSearchParams<{ docId: string }>()

  const { doctors, currencySymbol } = useContext(AppContext)

  const [docInfo, setDocInfo] = useState<Doctor | null>(null)
  const [docSlots, setDocSlots] = useState<TimeSlot[][]>([])
  const [slotIndex, setSlotIndex] = useState<number>(0)
  const [slotTime, setSlotTime] = useState<string>('')

  // ── Fetch Doctor Info ──────────────────────────────────────────────────────

  useEffect(() => {
    const found = doctors.find((doc: Doctor) => doc._id === docId) ?? null
    setDocInfo(found)
  }, [doctors, docId])

  // ── Build Available Slots ──────────────────────────────────────────────────

  useEffect(() => {
    if (!docInfo) return
    setDocSlots([])

    const today = new Date()
    const allSlots: TimeSlot[][] = []

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      const endTime = new Date(today)
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      const timeSlots: TimeSlot[] = []

      while (currentDate < endTime) {
        timeSlots.push({
          dateTime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      allSlots.push(timeSlots)
    }

    setDocSlots(allSlots)
  }, [docInfo])

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!docInfo) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#5F6FFF" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Doctor Details ── */}
        <View className="flex-col gap-4">

          {/* Doctor Image */}
          <Image
            source={docInfo.image}
            className="bg-[#5F6FFF] w-full h-64"
            resizeMode="cover"
          />

          {/* Doctor Info Card */}
          <View className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 -mt-10">

            {/* Name + Verified */}
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-medium text-gray-900">{docInfo.name}</Text>
              <Image source={assets.verified_icon} className="w-5 h-5" />
            </View>

            {/* Degree / Speciality / Experience */}
            <View className="flex-row items-center gap-2 mt-1 flex-wrap">
              <Text className="text-sm text-gray-600">
                {docInfo.degree} - {docInfo.speciality}
              </Text>
              <View className="border border-gray-300 rounded-full px-2 py-0.5">
                <Text className="text-xs text-gray-600">{docInfo.experience}</Text>
              </View>
            </View>

            {/* About */}
            <View className="mt-3">
              <View className="flex-row items-center gap-1">
                <Text className="text-sm font-medium text-gray-900">About</Text>
                <Image source={assets.info_icon} className="w-3.5 h-3.5" />
              </View>
              <Text className="text-sm text-gray-500 mt-1">{docInfo.about}</Text>
            </View>

            {/* Fee */}
            <Text className="text-gray-500 font-medium mt-4">
              Appointment fee:{' '}
              <Text className="text-gray-600">{currencySymbol}{docInfo.fees}</Text>
            </Text>
          </View>
        </View>

        {/* ── Booking Slots ── */}
        <View className="px-4 mt-6">
          <Text className="text-gray-700 font-medium text-base">Booking Slots</Text>

          {/* Day Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerClassName="gap-3 items-center"
          >
            {docSlots.map((daySlots, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSlotIndex(index)}
                className={`items-center justify-center py-6 w-16 rounded-full ${
                  slotIndex === index
                    ? 'bg-[#5F6FFF]'
                    : 'border border-gray-300 bg-white'
                }`}
              >
                <Text className={`text-sm font-medium ${slotIndex === index ? 'text-white' : 'text-gray-600'}`}>
                  {daySlots[0] ? DAYS_OF_WEEK[daySlots[0].dateTime.getDay()] : ''}
                </Text>
                <Text className={`text-sm font-medium ${slotIndex === index ? 'text-white' : 'text-gray-600'}`}>
                  {daySlots[0] ? daySlots[0].dateTime.getDate() : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerClassName="gap-3 items-center"
          >
            {docSlots[slotIndex]?.map((slot, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSlotTime(slot.time)}
                className={`px-5 py-2 rounded-full ${
                  slot.time === slotTime
                    ? 'bg-[#5F6FFF]'
                    : 'border border-gray-300 bg-white'
                }`}
              >
                <Text
                  className={`text-sm font-light ${
                    slot.time === slotTime ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {slot.time.toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Book Button */}
          <TouchableOpacity className="bg-[#5F6FFF] rounded-full px-14 py-3 my-6 self-start">
            <Text className="text-white text-sm font-light">Book an Appointment</Text>
          </TouchableOpacity>
        </View>

        {/* ── Related Doctors ── */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

      </ScrollView>
    </SafeAreaView>
  )
}

export default Appointment