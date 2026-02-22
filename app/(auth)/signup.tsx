import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const signup = () => {
  const router = useRouter();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // 💡 Add your signup logic here
    console.log('Signup:', { role, fullName, email, phone, password });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 }}>

        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 28 }}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Heading */}
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 8 }}>
          Create Account
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 28, lineHeight: 21 }}>
          Join DocHome to easily book or manage home doctor visits.
        </Text>

        {/* Role toggle: Patient / Doctor */}
        <View style={{ flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {(['patient', 'doctor'] as const).map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
                backgroundColor: role === r ? '#1A56FF' : 'transparent',
              }}
            >
              <Ionicons
                name={r === 'patient' ? 'person-outline' : 'medical-outline'}
                size={15}
                color={role === r ? '#fff' : '#6B7280'}
              />
              <Text style={{ fontWeight: '600', fontSize: 14, color: role === r ? '#fff' : '#6B7280' }}>
                {r === 'patient' ? 'Patient' : 'Doctor'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Full Name */}
        <Text style={label}>Full Name</Text>
        <View style={inputContainer}>
          <Ionicons name="person-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: '#111827' }}
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Email */}
        <Text style={[label, { marginTop: 16 }]}>Email Address</Text>
        <View style={inputContainer}>
          <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: '#111827' }}
            placeholder="Enter your email address"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Phone */}
        <Text style={[label, { marginTop: 16 }]}>Phone Number</Text>
        <View style={inputContainer}>
          <Ionicons name="call-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: '#111827' }}
            placeholder="Enter your phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Password */}
        <Text style={[label, { marginTop: 16 }]}>Password</Text>
        <View style={inputContainer}>
          <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: '#111827' }}
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
          style={{ backgroundColor: '#1A56FF', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 32 }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Sign Up</Text>
        </TouchableOpacity>

        {/* Login link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={{ fontSize: 14, color: '#1A56FF', fontWeight: '700' }}>Log In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const label = {
  fontSize: 13,
  fontWeight: '600' as const,
  color: '#374151',
  marginBottom: 8,
};

const inputContainer = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  backgroundColor: '#F9FAFB',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
};

export default signup;