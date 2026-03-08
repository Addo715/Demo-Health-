import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Signup = () => {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    console.log('Signup:', { role, fullName, email, phone, password });
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <ScrollView contentContainerClassName="flex-grow px-7 pt-4 pb-10">

          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} className="mb-7">
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          {/* Heading */}
          <Text className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-sm text-gray-500 mb-7 leading-6">
            Join DocHome to easily book or manage home doctor visits.
          </Text>

          {/* Role toggle */}
          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-7">
            {(['patient', 'doctor'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 ${role === r ? 'bg-[#1A56FF]' : 'bg-transparent'
                  }`}
              >
                <Ionicons
                  name={r === 'patient' ? 'person-outline' : 'medical-outline'}
                  size={15}
                  color={role === r ? '#fff' : '#6B7280'}
                />
                <Text className={`font-semibold text-sm ${role === r ? 'text-white' : 'text-gray-500'}`}>
                  {r === 'patient' ? 'Patient' : 'Doctor'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Full Name */}
          <Text className="text-xs font-semibold text-gray-700 mb-2">Full Name</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
            <Ionicons name="person-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-sm text-gray-900"
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <Text className="text-xs font-semibold text-gray-700 mb-2 mt-4">Email Address</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
            <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-sm text-gray-900"
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Phone */}
          <Text className="text-xs font-semibold text-gray-700 mb-2 mt-4">Phone Number</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
            <Ionicons name="call-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-sm text-gray-900"
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Password */}
          <Text className="text-xs font-semibold text-gray-700 mb-2 mt-4">Password</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
            <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
            <TextInput
              className="flex-1 text-sm text-gray-900"
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Sign Up button */}
          <TouchableOpacity
            onPress={handleSignup}
            className="bg-[#1A56FF] rounded-2xl py-4 items-center mt-8"
            activeOpacity={0.85}
          >
            <Text className="text-white font-bold text-base">Sign Up</Text>
          </TouchableOpacity>

          {/* Login link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-sm text-[#1A56FF] font-bold">Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;