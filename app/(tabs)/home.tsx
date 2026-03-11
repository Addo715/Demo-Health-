
import Header from '@/components/Header';
import NewDoctors from '@/components/NewDoctors';
import SpecialityMenu from '@/components/SpecialityMenu';
import UpcomingSchedule from '@/components/UpcomingSchedule';
import { useRouter } from 'expo-router';
import { MessageCircle, Mic } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ConfirmSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: React.ReactNode;
  title: string;
  message: string;
  confirmText: string;
}

const ConfirmSheet: React.FC<ConfirmSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  icon,
  title,
  message,
  confirmText,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    {/* Dim overlay */}
    <TouchableOpacity
      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
      activeOpacity={1}
      onPress={onClose}
    />

    {/* Bottom sheet */}
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 28,
        paddingBottom: 48,
        gap: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 20,
      }}
    >
      {/* Handle bar */}
      <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-2" />

      {/* Icon */}
      <View className="w-16 h-16 rounded-full bg-indigo-50 items-center justify-center self-center">
        {icon}
      </View>

      <Text className="text-xl font-bold text-gray-900 text-center">{title}</Text>
      <Text className="text-sm text-gray-400 text-center leading-5 -mt-2">{message}</Text>

      {/* Buttons */}
      <View className="flex-row gap-3 mt-2">
        <TouchableOpacity
          onPress={onClose}
          className="flex-1 py-4 rounded-2xl border border-gray-200 items-center"
        >
          <Text className="text-gray-500 font-semibold text-sm">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          className="flex-1 py-4 rounded-2xl bg-[#5f6FFF] items-center"
        >
          <Text className="text-white font-bold text-sm">{confirmText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const Home: React.FC = () => {
  const router = useRouter();
  const [chatModal, setChatModal] = useState<boolean>(false);
  const [voiceModal, setVoiceModal] = useState<boolean>(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left', 'right', 'bottom']}>
      <ScrollView className="flex-1">
        <Header />
        <SpecialityMenu />
        <UpcomingSchedule />
        <NewDoctors />
       
      </ScrollView>

      {/* Fixed floating buttons */}
      <View
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          gap: 12,
          alignItems: 'center',
        }}
      >
        {/* Voice button */}
        <TouchableOpacity
          onPress={() => setVoiceModal(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 6,
            borderWidth: 1,
            borderColor: '#e0e7ff',
          }}
        >
          <Mic size={26} color="#5f6FFF" />
        </TouchableOpacity>

        {/* Chat button */}
        <TouchableOpacity
          onPress={() => setChatModal(true)}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#5f6FFF',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#5f6FFF',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <MessageCircle size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat bottom sheet */}
      <ConfirmSheet
        visible={chatModal}
        onClose={() => setChatModal(false)}
        onConfirm={() => {
          setChatModal(false);
          router.push('/chat' as any);
        }}
        icon={<MessageCircle size={32} color="#5f6FFF" />}
        title="Need Assistance?"
        message="Would you like to chat with our support team for help?"
        confirmText="Yes, Chat"
      />

      {/* Voice bottom sheet */}
      <ConfirmSheet
        visible={voiceModal}
        onClose={() => setVoiceModal(false)}
        onConfirm={() => {
          setVoiceModal(false);
          router.push('/voice' as any);
        }}
        icon={<Mic size={32} color="#5f6FFF" />}
        title="Voice Assistant"
        message="Would you like to speak with our voice assistant for instant answers?"
        confirmText="Yes, Start"
      />

    </SafeAreaView>
  );
};

export default Home;