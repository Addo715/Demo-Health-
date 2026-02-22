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

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // 💡 Add your login logic here
    console.log('Login:', email, password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28, paddingTop: 100, paddingBottom: 40 }}>

        {/* Heading */}
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 8 }}>
          Welcome Back
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 36, lineHeight: 21 }}>
          Log in to your account to easily book your next home doctor visit.
        </Text>

        {/* Email */}
        <Text style={label}>Email Address</Text>
        <View style={inputContainer}>
          <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: '#111827' }}
            placeholder="robert.smith@email.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <Text style={[label, { marginTop: 20 }]}>Password</Text>
        <View style={inputContainer}>
          <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: '#111827' }}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Forgot password */}
        <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 12 }}>
          <Text style={{ fontSize: 13, color: '#1A56FF', fontWeight: '600' }}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={{ backgroundColor: '#1A56FF', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 32 }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Log In</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
          <Text style={{ fontSize: 14, color: '#6B7280' }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={{ fontSize: 14, color: '#1A56FF', fontWeight: '700' }}>Sign Up</Text>
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

export default Login;