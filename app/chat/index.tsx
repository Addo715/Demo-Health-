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
import {sendMessageToGemini} from "@/services/gemini";
import {ChatMessage} from "@/types/chat";

const ChatScreen: React.FC = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm HealthAI, your personal health assistant. I can help you with symptoms, medications, nutrition, fitness, mental wellness, and more.\n\nPlease note that my responses are for informational purposes only and do not replace professional medical advice. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pickImage = async (): Promise<void> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access your gallery is required.');
      return;
    }

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
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText.trim() || 'I shared an image for analysis.',
      image: selectedImage,
      timestamp: new Date(),
    };

    // Capture image before clearing
    const imageToSend = selectedImage;

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Pass the full current messages array + new user message as history
    const reply = await sendMessageToGemini(
      [...messages, userMessage],
      userMessage.text,
      imageToSend
    );

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
        style={{
          marginHorizontal: 16,
          marginVertical: 4,
          maxWidth: '80%',
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        {!isUser && (
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#5f6FFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
              AI
            </Text>
          </View>
        )}

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
              lineHeight: 21,
            }}
          >
            {item.text}
          </Text>
        </View>

        <Text
          style={{
            color: '#9ca3af',
            fontSize: 10,
            marginTop: 4,
            marginHorizontal: 4,
          }}
        >
          {item.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  const canSend = (inputText.trim().length > 0 || selectedImage !== null) && !isLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#f3f4f6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
          backgroundColor: '#fff',
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
            marginRight: 12,
          }}
        >
          <ArrowLeft size={18} color="#1f2937" />
        </TouchableOpacity>

        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#5f6FFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
            AI
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: 16 }}>
            HealthAI
          </Text>
          <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '500' }}>
            Online
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 16,
              marginBottom: 8,
              gap: 8,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#5f6FFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                AI
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#f3f4f6',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 20,
                borderBottomLeftRadius: 4,
              }}
            >
              <ActivityIndicator size="small" color="#5f6FFF" />
            </View>
          </View>
        )}

        {/* Image preview */}
        {selectedImage && (
          <View style={{ marginHorizontal: 16, marginBottom: 8, alignSelf: 'flex-start' }}>
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
                style={{ width: 80, height: 80, borderRadius: 12 }}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#ef4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={10} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Input bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: '#f3f4f6',
            backgroundColor: '#fff',
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#f3f4f6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ImageIcon size={18} color="#5f6FFF" />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              maxHeight: 96,
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask a health question..."
              placeholderTextColor="#9ca3af"
              multiline
              style={{ fontSize: 14, color: '#1f2937', maxHeight: 80 }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!canSend}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: canSend ? '#5f6FFF' : '#e5e7eb',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={18} color={canSend ? '#fff' : '#9ca3af'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;