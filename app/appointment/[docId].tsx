import { assets } from '@/assets/images/assets'
import RelatedDoctors from '@/components/RelatedDoctors'
import { AppContext } from '@/context/AppContext'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import { cssInterop } from 'nativewind'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

cssInterop(Image, { className: 'style' });

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
  const router = useRouter()

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Doctor Details ── */}
        <View>

          {/* Doctor Image with back button */}
          <View style={{ position: 'relative', backgroundColor: '#5F6FFF', paddingTop: 56 }}>
            <Image
              source={docInfo.image}
              style={{ width: '100%', height: 240, backgroundColor: '#5F6FFF' }}
              contentFit="cover"
            />
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                position: 'absolute',
                top: 52,
                left: 16,
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: 'rgba(255,255,255,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft size={20} color="#1f2937" />
            </TouchableOpacity>
          </View>

          {/* Doctor Info Card */}
          <View style={{
            backgroundColor: '#fff',
            marginHorizontal: 12,
            marginTop: -24,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
          }}>

            {/* Name + Verified */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 22, fontWeight: '600', color: '#111827', flexShrink: 1 }}>
                {docInfo.name}
              </Text>
              <Image source={assets.verified_icon} style={{ width: 20, height: 20 }} />
            </View>

            {/* Degree / Speciality / Experience */}
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              <Text style={{ fontSize: 13, color: '#4b5563' }}>
                {docInfo.degree} - {docInfo.speciality}
              </Text>
              <View style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 2 }}>
                <Text style={{ fontSize: 12, color: '#4b5563' }}>{docInfo.experience}</Text>
              </View>
            </View>

            {/* About */}
            <View style={{ marginTop: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>About</Text>
                <Image source={assets.info_icon} style={{ width: 14, height: 14 }} />
              </View>
              <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 6, lineHeight: 20 }}>
                {docInfo.about}
              </Text>
            </View>

            {/* Fee */}
            <Text style={{ color: '#6b7280', fontWeight: '500', marginTop: 14 }}>
              Appointment fee:{' '}
              <Text style={{ color: '#374151', fontWeight: '700' }}>{currencySymbol}{docInfo.fees}</Text>
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
                className={`items-center justify-center py-6 w-16 rounded-full ${slotIndex === index
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
                className={`px-5 py-2 rounded-full ${slot.time === slotTime
                    ? 'bg-[#5F6FFF]'
                    : 'border border-gray-300 bg-white'
                  }`}
              >
                <Text
                  className={`text-sm font-light ${slot.time === slotTime ? 'text-white' : 'text-gray-400'
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