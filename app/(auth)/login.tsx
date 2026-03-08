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

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Login:', email, password);
    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerClassName="flex-grow px-7 pt-24 pb-10">

        {/* Heading */}
        <Text className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</Text>
        <Text className="text-sm text-gray-500 mb-9 leading-6">
          Log in to your account to easily book your next home doctor visit.
        </Text>

        {/* Email */}
        <Text className="text-xs font-semibold text-gray-700 mb-2">Email Address</Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
          <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            className="flex-1 text-sm text-gray-900"
            placeholder="robert.smith@email.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <Text className="text-xs font-semibold text-gray-700 mb-2 mt-5">Password</Text>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
          <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
          <TextInput
            className="flex-1 text-sm text-gray-900"
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
        <TouchableOpacity className="self-end mt-3">
          <Text className="text-sm text-[#1A56FF] font-semibold">Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login button */}
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-[#1A56FF] rounded-2xl py-4 items-center mt-8"
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-base">Log In</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-sm text-gray-500">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-sm text-[#1A56FF] font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;