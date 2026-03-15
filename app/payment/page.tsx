import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  Lock,
} from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
type Params = {
  doctorId: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  fee: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

// ─── Component ────────────────────────────────────────────────────────────────
const PaymentPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();

  const doctorName = params.doctorName ?? 'Doctor';
  const speciality = params.speciality ?? '';
  const date = params.date ?? '';
  const time = params.time ?? '';
  const fee = params.fee ?? '50';

  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardName, setCardName] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const serviceFee = 2.5;
  const total = parseFloat(fee) + serviceFee;

  // ── Validate ──────────────────────────────────────────────────────────────
  const isFormValid = (): boolean =>
    cardNumber.replace(/\s/g, '').length === 16 &&
    cardName.trim().length > 2 &&
    expiry.length === 5 &&
    cvv.length === 3;

  // ── Pay ───────────────────────────────────────────────────────────────────
  const handlePay = (): void => {
    if (!isFormValid() || isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2500);
  };

  const handleDone = (): void => {
    setShowSuccess(false);
    router.back();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#f9fafb' }}
        edges={['top', 'left', 'right', 'bottom']}
      >
        <Stack.Screen options={{ headerShown: false }} />

        {/* ── Header ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6',
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#f3f4f6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} color="#1a1a2e" />
          </TouchableOpacity>

          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', flex: 1 }}>
            Payment
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Lock size={13} color="#22c55e" />
            <Text style={{ fontSize: 11, color: '#22c55e', fontWeight: '600' }}>Secure</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 16 }}
        >

          {/* ── Order Summary ── */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              gap: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
              Order Summary
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                  {doctorName}
                </Text>
                <Text style={{ fontSize: 12, color: '#5F6FFF', fontWeight: '500', marginTop: 2 }}>
                  {speciality}
                </Text>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                  {date} · {time}
                </Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                ${fee}
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />

            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Consultation fee</Text>
                <Text style={{ fontSize: 13, color: '#374151', fontWeight: '500' }}>${fee}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Service fee</Text>
                <Text style={{ fontSize: 13, color: '#374151', fontWeight: '500' }}>
                  ${serviceFee.toFixed(2)}
                </Text>
              </View>
              <View style={{ height: 1, backgroundColor: '#f3f4f6', marginVertical: 2 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>Total</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#5F6FFF' }}>
                  ${total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Card Form ── */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              gap: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {/* Section title */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: '#eff2ff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CreditCard size={16} color="#5F6FFF" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
                Card Details
              </Text>
            </View>

            {/* Card Number */}
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>
                Card Number
              </Text>
              <TextInput
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#d1d5db"
                keyboardType="numeric"
                maxLength={19}
                style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  fontSize: 16,
                  color: '#111827',
                  borderWidth: 1,
                  borderColor: cardNumber.length > 0 ? '#5F6FFF' : '#f0f0f0',
                  letterSpacing: 2,
                }}
              />
            </View>

            {/* Cardholder Name */}
            <View style={{ gap: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>
                Cardholder Name
              </Text>
              <TextInput
                value={cardName}
                onChangeText={setCardName}
                placeholder="John Doe"
                placeholderTextColor="#d1d5db"
                autoCapitalize="words"
                style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 13,
                  fontSize: 14,
                  color: '#111827',
                  borderWidth: 1,
                  borderColor: cardName.length > 0 ? '#5F6FFF' : '#f0f0f0',
                }}
              />
            </View>

            {/* Expiry + CVV */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>
                  Expiry Date
                </Text>
                <TextInput
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                  placeholder="MM/YY"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  maxLength={5}
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                    fontSize: 14,
                    color: '#111827',
                    borderWidth: 1,
                    borderColor: expiry.length > 0 ? '#5F6FFF' : '#f0f0f0',
                  }}
                />
              </View>

              <View style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>
                  CVV
                </Text>
                <TextInput
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                    fontSize: 14,
                    color: '#111827',
                    borderWidth: 1,
                    borderColor: cvv.length > 0 ? '#5F6FFF' : '#f0f0f0',
                  }}
                />
              </View>
            </View>
          </View>

          {/* ── Pay Button ── */}
          <TouchableOpacity
            onPress={handlePay}
            disabled={!isFormValid() || isProcessing}
            style={{
              backgroundColor: isFormValid() ? '#5F6FFF' : '#e5e7eb',
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              marginBottom: 16,
              shadowColor: '#5F6FFF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isFormValid() ? 0.3 : 0,
              shadowRadius: 10,
              elevation: isFormValid() ? 6 : 0,
            }}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Lock size={16} color={isFormValid() ? '#fff' : '#9ca3af'} />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: isFormValid() ? '#fff' : '#9ca3af',
                  }}
                >
                  Pay ${total.toFixed(2)}
                </Text>
              </>
            )}
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>

      {/* ── Success Modal ── */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              padding: 32,
              alignItems: 'center',
              width: '100%',
              gap: 16,
            }}
          >
            {/* Success icon */}
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: '#dcfce7',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle size={50} color="#22c55e" />
            </View>

            <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>
              Payment Successful!
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 }}>
              Your appointment with {doctorName} on {date} at {time} has been confirmed.
            </Text>

            {/* Receipt box */}
            <View
              style={{
                backgroundColor: '#f5f7ff',
                borderRadius: 12,
                padding: 14,
                width: '100%',
                gap: 8,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Amount paid</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#22c55e' }}>
                  ${total.toFixed(2)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Method</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
                  Credit Card
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#6b7280' }}>Card ending</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
                  •••• {cardNumber.replace(/\s/g, '').slice(-4)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleDone}
              style={{
                backgroundColor: '#5F6FFF',
                borderRadius: 14,
                paddingVertical: 14,
                paddingHorizontal: 48,
                marginTop: 4,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PaymentPage;