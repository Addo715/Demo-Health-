import { ChatMessage, sendMessageToGemini } from '@/services/geminiService';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ImageIcon, Send, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen: React.FC = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "👋 Hi! I'm HealthAI, your personal health assistant. I can help you with symptoms, medications, wellness tips, and more. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(result.assets[0].base64);
    }
  };

  const handleSend = async (): Promise<void> => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText.trim() || '📷 Shared an image for analysis',
      image: selectedImage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    const reply = await sendMessageToGemini(messages, userMessage.text, selectedImage);

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: reply,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View
        className={`mx-4 my-1 max-w-[80%] ${
          isUser ? 'self-end items-end' : 'self-start items-start'
        }`}
      >
        {/* AI avatar */}
        {!isUser && (
          <View className="w-7 h-7 rounded-full bg-[#5f6FFF] items-center justify-center mb-1">
            <Text className="text-white text-[10px] font-bold">AI</Text>
          </View>
        )}

        {/* Image in message */}
        {item.image && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.image}` }}
            style={{
              width: 180,
              height: 180,
              borderRadius: 16,
              marginBottom: 4,
            }}
            resizeMode="cover"
          />
        )}

        {/* Bubble */}
        <View
          style={{
            backgroundColor: isUser ? '#5f6FFF' : '#f3f4f6',
            borderRadius: 20,
            borderBottomRightRadius: isUser ? 4 : 20,
            borderBottomLeftRadius: isUser ? 20 : 4,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: isUser ? '#fff' : '#1f2937',
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {item.text}
          </Text>
        </View>

        {/* Timestamp */}
        <Text className="text-gray-400 text-[10px] mt-1 mx-1">
          {item.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        className="flex-row items-center px-4 py-3 border-b border-gray-100"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center mr-3"
        >
          <ArrowLeft size={18} color="#1f2937" />
        </TouchableOpacity>

        <View className="w-10 h-10 rounded-full bg-[#5f6FFF] items-center justify-center mr-3">
          <Text className="text-white font-bold text-sm">AI</Text>
        </View>

        <View className="flex-1">
          <Text className="text-gray-900 font-bold text-base">HealthAI</Text>
          <Text className="text-green-500 text-xs font-medium">● Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 8 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Typing indicator */}
        {isLoading && (
          <View className="flex-row items-center mx-4 mb-2 gap-2">
            <View className="w-7 h-7 rounded-full bg-[#5f6FFF] items-center justify-center">
              <Text className="text-white text-[10px] font-bold">AI</Text>
            </View>
            <View className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
              <ActivityIndicator size="small" color="#5f6FFF" />
            </View>
          </View>
        )}

        {/* Selected image preview */}
        {selectedImage && (
          <View className="mx-4 mb-2 self-start">
            <View className="relative">
              <Image
                source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
                style={{ width: 80, height: 80, borderRadius: 12 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 items-center justify-center"
              >
                <X size={10} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Input bar */}
        <View className="flex-row items-end px-4 py-3 border-t border-gray-100 gap-2 bg-white">
          {/* Image picker */}
          <TouchableOpacity
            onPress={pickImage}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <ImageIcon size={18} color="#5f6FFF" />
          </TouchableOpacity>

          {/* Text input */}
          <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 max-h-24">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask a health question..."
              placeholderTextColor="#9ca3af"
              multiline
              style={{ fontSize: 14, color: '#1f2937', maxHeight: 80 }}
            />
          </View>

          {/* Send button */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={isLoading || (!inputText.trim() && !selectedImage)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor:
                inputText.trim() || selectedImage ? '#5f6FFF' : '#e5e7eb',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send
              size={18}
              color={inputText.trim() || selectedImage ? '#fff' : '#9ca3af'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;