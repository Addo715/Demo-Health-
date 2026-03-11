import { AppContext, Doctor } from '@/context/AppContext';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import React, { useContext } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(Image, { className: 'style' });

const MyBooking: React.FC = () => {
  const { doctors } = useContext(AppContext);

  const appointments = doctors.slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top', 'left', 'right']}>

      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>My Appointments</Text>
        <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
          {appointments.length} upcoming appointment{appointments.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {appointments.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>No appointments yet</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af' }}>Book a doctor to get started</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item: Doctor) => item._id}
          contentContainerStyle={{ padding: 16, gap: 14 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
              borderWidth: 1,
              borderColor: '#f0f0f0',
            }}>

              {/* ── Top: Image + Info ── */}
              <View style={{ flexDirection: 'row', gap: 14, padding: 14 }}>

                {/* Doctor Image */}
                <Image
                  source={item.image}
                  style={{ width: 90, height: 100, borderRadius: 14, backgroundColor: '#eef2ff' }}
                  contentFit="cover"
                />

                {/* Doctor Info */}
                <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
                  {/* Status Badge */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' }} />
                    <Text style={{ fontSize: 11, color: '#16a34a', fontWeight: '600' }}>Confirmed</Text>
                  </View>

                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#5F6FFF', fontWeight: '600' }}>
                    {item.speciality}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }} numberOfLines={1}>
                    {item.address?.line1}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#9ca3af' }} numberOfLines={1}>
                    {item.address?.line2}
                  </Text>
                </View>
              </View>

              {/* ── Date & Time Banner ── */}
              <View style={{
                backgroundColor: '#f5f7ff',
                marginHorizontal: 14,
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}>
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
                <TouchableOpacity style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 12,
                  alignItems: 'center',
                  backgroundColor: '#5F6FFF',
                }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Pay Online</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 12,
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#fca5a5',
                }}>
                  <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>Cancel</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default MyBooking;