import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { AppContext } from '../context/AppContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type RootParamList = {
  Appointment: { docId: string }
  Doctors: undefined
}

type NavigationProp = NativeStackNavigationProp<RootParamList>

interface Doctor {
  _id: string
  name: string
  image: any
  speciality: string
}

interface Props {
  speciality: string
  docId: string
}

// ─── Component ────────────────────────────────────────────────────────────────

const RelatedDoctors: React.FC<Props> = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const navigation = useNavigation<NavigationProp>()

  const [relDoc, setRelDoc] = useState<Doctor[]>([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const filtered = doctors.filter(
        (doc: Doctor) => doc.speciality === speciality && doc._id !== docId
      )
      setRelDoc(filtered)
    }
  }, [doctors, speciality, docId])

  return (
    <View className="flex-col items-center gap-4 my-16 mx-4 md:mx-10">

      {/* Header */}
      <Text className="text-3xl font-medium text-gray-900">Top Doctors to Book</Text>
      <Text className="text-center text-sm text-gray-500 max-w-xs">
        Simply browse through our extensive list of doctors
      </Text>

      {/* Doctor Cards Grid */}
      <View className="w-full flex-row flex-wrap gap-4 pt-5 justify-between">
        {relDoc.slice(0, 5).map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('Appointment', { docId: item._id })}
            className="border border-blue-200 rounded-xl overflow-hidden w-[47%]"
            activeOpacity={0.8}
          >
            <Image
              source={item.image}
              className="bg-blue-50 w-full h-36"
              resizeMode="cover"
            />
            <View className="p-4">
              {/* Available Badge */}
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 bg-green-500 rounded-full" />
                <Text className="text-green-500 text-sm">Available</Text>
              </View>
              <Text className="text-gray-900 text-lg font-medium mt-1">{item.name}</Text>
              <Text className="text-gray-600 text-sm">{item.speciality}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* More Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Doctors')}
        className="bg-blue-50 px-12 py-3 rounded-full mt-10"
        activeOpacity={0.8}
      >
        <Text className="text-gray-600">More</Text>
      </TouchableOpacity>

    </View>
  )
}

export default RelatedDoctors