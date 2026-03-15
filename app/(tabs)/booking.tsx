import { AppContext, Doctor } from '@/context/AppContext';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import React, { useContext, useState, useCallback, useRef } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(Image, { className: 'style' });

const MyBooking: React.FC = () => {
  const { doctors } = useContext(AppContext);
  const router = useRouter();

  const appointments = doctors.slice(0, 3);

  // Track which doctor IDs have been paid
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());

  // We use a ref to pass the pending doctorId back after payment
  // The payment page calls router.back() — we check on focus if payment succeeded
  // via a simple global store approach using a module-level variable
  const pendingDoctorId = useRef<string | null>(null);

  // When screen comes back into focus after payment, mark as paid
  useFocusEffect(
    useCallback(() => {
      if (pendingDoctorId.current) {
        setPaidIds((prev) => new Set([...prev, pendingDoctorId.current as string]));
        pendingDoctorId.current = null;
      }
    }, [])
  );

  const handlePayOnline = (doctor: Doctor): void => {
    // Store which doctor we are paying for
    pendingDoctorId.current = doctor._id;

    router.push({
      pathname: '/payment/page' as any,
      params: {
        doctorId: doctor._id,
        doctorName: doctor.name,
        speciality: doctor.speciality,
        date: '01 May 2025',
        time: '11:50 AM',
        fee: String(doctor.fees ?? 50),
      },
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      edges={['top', 'left', 'right']}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 12,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#f3f4f6',
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>
          My Appointments
        </Text>
        <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
          {appointments.length} upcoming appointment{appointments.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {appointments.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
            No appointments yet
          </Text>
          <Text style={{ fontSize: 13, color: '#9ca3af' }}>Book a doctor to get started</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item: Doctor) => item._id}
          contentContainerStyle={{ padding: 16, gap: 14 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isPaid = paidIds.has(item._id);

            return (
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 18,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 8,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: isPaid ? '#bbf7d0' : '#f0f0f0',
                }}
              >
                {/* ── Top: Image + Info ── */}
                <View style={{ flexDirection: 'row', gap: 14, padding: 14 }}>
                  <Image
                    source={item.image}
                    style={{ width: 90, height: 100, borderRadius: 14, backgroundColor: '#eef2ff' }}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
                    {/* Status badge */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                      <View
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 4,
                          backgroundColor: isPaid ? '#22c55e' : '#22c55e',
                        }}
                      />
                      <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '600' }}>
                        {isPaid ? 'Payment Confirmed' : 'Confirmed'}
                      </Text>
                    </View>

                    <Text
                      style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#5F6FFF', fontWeight: '600' }}>
                      {item.speciality}
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}
                      numberOfLines={1}
                    >
                      {item.address?.line1}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }} numberOfLines={1}>
                      {item.address?.line2}
                    </Text>
                  </View>
                </View>

                {/* ── Date & Time Banner ── */}
                <View
                  style={{
                    backgroundColor: isPaid ? '#f0fdf4' : '#f5f7ff',
                    marginHorizontal: 14,
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>
                    01 May 2025
                  </Text>
                  <Text style={{ fontSize: 13, color: '#9ca3af' }}>·</Text>
                  <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>
                    11:50 AM
                  </Text>
                </View>

                {/* ── Buttons ── */}
                <View style={{ flexDirection: 'row', gap: 10, padding: 14 }}>

                  {/* Pay Online / Paid */}
                  <TouchableOpacity
                    onPress={() => !isPaid && handlePayOnline(item)}
                    activeOpacity={isPaid ? 1 : 0.7}
                    style={{
                      flex: 1,
                      paddingVertical: 11,
                      borderRadius: 12,
                      alignItems: 'center',
                      backgroundColor: isPaid ? '#22c55e' : '#5F6FFF',
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                      {isPaid ? '✓  Paid' : 'Pay Online'}
                    </Text>
                  </TouchableOpacity>

                  {/* Cancel — hidden once paid */}
                  {!isPaid && (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        paddingVertical: 11,
                        borderRadius: 12,
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#fca5a5',
                      }}
                    >
                      <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default MyBooking;