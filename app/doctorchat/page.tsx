import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Video,
  Send,
  Mic,
  Paperclip,
  MoreVertical,
  CheckCheck,
  PhoneOff,
  VideoOff,
  MicOff,
  Volume2,
} from 'lucide-react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  time: string;
  status: 'sent' | 'delivered' | 'read';
};

type Params = {
  id: string;
  doctor: string;
  speciality: string;
  image: string;
  dateFrom: string;
  dateTo: string;
  startCall?: string;
};

type CallType = 'voice' | 'video' | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCurrentTime = (): string => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const generateId = (): string => Math.random().toString(36).slice(2, 9);

// ─── Conversation flow ────────────────────────────────────────────────────────
type ConversationStep = {
  reply: string;
  followUp?: string;
};

const CONVERSATION_FLOW: ConversationStep[] = [
  {
    reply: "Hello! Good to hear from you. How are you feeling today?",
    followUp: "Are you experiencing any new symptoms since our last visit?",
  },
  {
    reply: "I see. Can you describe the symptom in more detail?",
    followUp: "On a scale of 1 to 10, how would you rate your discomfort?",
  },
  {
    reply: "Thank you for letting me know. That helps me understand your situation better.",
    followUp: "Have you been taking your medication regularly as prescribed?",
  },
  {
    reply: "Good. It is important to stay consistent with the dosage.",
    followUp: "Are you drinking enough water and getting enough rest?",
  },
  {
    reply: "That is great to hear. Rest and hydration are very important for recovery.",
    followUp: "Do you have any questions about your treatment plan?",
  },
  {
    reply: "Of course! Feel free to ask me anything about your health.",
    followUp: "Is there anything else you would like to discuss today?",
  },
  {
    reply: "I understand your concern. Please do not worry, we will take care of it.",
    followUp: "Would you like me to schedule a follow-up appointment for you?",
  },
  {
    reply: "I will update your prescription and send it to your pharmacy today.",
    followUp: "Do you need a sick note or any medical documentation?",
  },
  {
    reply: "No problem at all. I am here to help you.",
    followUp: "Is there anything else I can assist you with today?",
  },
  {
    reply: "That is perfectly normal given your condition. No need to worry.",
    followUp: "Please remember to come in for your next check-up.",
  },
];

// ─── Initial messages ─────────────────────────────────────────────────────────
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hello! How are you feeling today?',
    sender: 'doctor',
    time: '9:00',
    status: 'read',
  },
  {
    id: '2',
    text: "I'm doing better, thank you Doctor.",
    sender: 'user',
    time: '9:01',
    status: 'read',
  },
  {
    id: '3',
    text: "That is wonderful to hear! Are you experiencing any new symptoms since our last visit?",
    sender: 'doctor',
    time: '9:02',
    status: 'read',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const DoctorChatPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeCall, setActiveCall] = useState<CallType>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCameraOff, setIsCameraOff] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const flatListRef = useRef<FlatList<Message>>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const doctorName: string = params.doctor ?? 'Doctor';
  const speciality: string = params.speciality ?? '';
  const image: string = params.image ?? '';
  const dateFrom: string = params.dateFrom ?? '';
  const dateTo: string = params.dateTo ?? '';

  // ── Scroll to bottom ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // ── Call timer ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeCall) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      setCallDuration(0);
      setIsMuted(false);
      setIsCameraOff(false);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCall]);

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ── Send message ───────────────────────────────────────────────────────────
  const handleSend = (): void => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: generateId(),
      text: trimmed,
      sender: 'user',
      time: getCurrentTime(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    const currentStep = CONVERSATION_FLOW[stepIndex % CONVERSATION_FLOW.length];

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: Message = {
        id: generateId(),
        text: currentStep.reply,
        sender: 'doctor',
        time: getCurrentTime(),
        status: 'read',
      };
      setMessages((prev) => [...prev, replyMsg]);

      if (currentStep.followUp) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const followUpMsg: Message = {
              id: generateId(),
              text: currentStep.followUp as string,
              sender: 'doctor',
              time: getCurrentTime(),
              status: 'read',
            };
            setMessages((prev) => [...prev, followUpMsg]);
          }, 1000);
        }, 800);
      }

      setStepIndex((prev) => prev + 1);
    }, 1200);
  };

  // ── Calls ──────────────────────────────────────────────────────────────────
  const handleVoiceCall = (): void => {
    Vibration.vibrate(50);
    setActiveCall('voice');
  };

  const handleVideoCall = (): void => {
    Vibration.vibrate(50);
    setActiveCall('video');
  };

  const handleEndCall = (): void => {
    Vibration.vibrate(100);
    setActiveCall(null);
  };

  // ── Message bubble ─────────────────────────────────────────────────────────
  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginVertical: 4,
          paddingHorizontal: 16,
        }}
      >
        {!isUser && (
          <Image
            source={{ uri: image }}
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              marginRight: 8,
              alignSelf: 'flex-end',
              marginBottom: 4,
            }}
          />
        )}
        <View
          style={{
            maxWidth: '72%',
            backgroundColor: isUser ? '#5f6FFF' : '#F0F2FF',
            borderRadius: 18,
            borderBottomRightRadius: isUser ? 4 : 18,
            borderBottomLeftRadius: isUser ? 18 : 4,
            paddingHorizontal: 14,
            paddingVertical: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ color: isUser ? '#fff' : '#1a1a2e', fontSize: 14, lineHeight: 20 }}>
            {item.text}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4, gap: 4 }}>
            <Text style={{ fontSize: 10, color: isUser ? 'rgba(255,255,255,0.65)' : '#9ca3af' }}>
              {item.time}
            </Text>
            {isUser && (
              <CheckCheck
                size={12}
                color={item.status === 'read' ? '#a5b4fc' : 'rgba(255,255,255,0.5)'}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: '#fff' }}
        edges={['top', 'left', 'right', 'bottom']}
      >
        {/* Hide the Expo Router header */}
        <Stack.Screen options={{ headerShown: false }} />

        {/* ── Header ── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f5',
            backgroundColor: '#fff',
            gap: 10,
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <ArrowLeft size={22} color="#1a1a2e" />
          </TouchableOpacity>

          <Image
            source={{ uri: image }}
            style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#e0e7ff' }}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: '#1a1a2e' }}>
              {doctorName}
            </Text>
            <Text style={{ fontSize: 12, color: '#5f6FFF', fontWeight: '500' }}>
              {speciality}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleVoiceCall}
            style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#f0f2ff', alignItems: 'center', justifyContent: 'center' }}
          >
            <Phone size={18} color="#5f6FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleVideoCall}
            style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#f0f2ff', alignItems: 'center', justifyContent: 'center' }}
          >
            <Video size={18} color="#5f6FFF" />
          </TouchableOpacity>

          <TouchableOpacity style={{ padding: 4 }}>
            <MoreVertical size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* ── Appointment banner ── */}
        <View
          style={{
            backgroundColor: '#eff2ff',
            marginHorizontal: 16,
            marginTop: 10,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ fontSize: 11, color: '#5f6FFF', fontWeight: '600' }}>
              Appointment
            </Text>
            <Text style={{ fontSize: 12, color: '#374151', marginTop: 1 }}>
              {dateFrom} {'→'} {dateTo}
            </Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: '#5f6FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Join</Text>
          </TouchableOpacity>
        </View>

        {/* ── Messages ── */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 4, gap: 8 }}>
                <Image source={{ uri: image }} style={{ width: 26, height: 26, borderRadius: 13 }} />
                <View style={{ backgroundColor: '#f0f2ff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10 }}>
                  <Text style={{ color: '#9ca3af', fontSize: 13 }}>Typing...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* ── Input bar ── */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={90}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderTopWidth: 1,
              borderTopColor: '#f0f0f5',
              backgroundColor: '#fff',
              gap: 8,
            }}
          >
            <TouchableOpacity
              style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#f5f5fa', alignItems: 'center', justifyContent: 'center' }}
            >
              <Paperclip size={18} color="#9ca3af" />
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={(text: string) => setInputText(text)}
              placeholder="Type a message..."
              placeholderTextColor="#b0b4c8"
              multiline
              style={{
                flex: 1,
                backgroundColor: '#f5f5fa',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 14,
                color: '#1a1a2e',
                maxHeight: 100,
                lineHeight: 20,
              }}
            />

            {inputText.trim().length > 0 ? (
              <TouchableOpacity
                onPress={handleSend}
                style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#5f6FFF', alignItems: 'center', justifyContent: 'center' }}
              >
                <Send size={18} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#5f6FFF', alignItems: 'center', justifyContent: 'center' }}
              >
                <Mic size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>

      </SafeAreaView>

      {/* ── Voice Call Modal ── */}
      <Modal visible={activeCall === 'voice'} animationType="slide" transparent={false} statusBarTranslucent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1a1a2e' }} edges={['top', 'bottom']}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 60, paddingHorizontal: 24 }}>

            <View style={{ alignItems: 'center', gap: 16 }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Voice Call</Text>
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#5f6FFF' }}
              />
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{doctorName}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{speciality}</Text>
              <Text style={{ color: '#5f6FFF', fontSize: 16, fontWeight: '600' }}>
                {formatDuration(callDuration)}
              </Text>
            </View>

            <View style={{ gap: 32, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', gap: 24 }}>
                <TouchableOpacity
                  onPress={() => setIsMuted((prev) => !prev)}
                  style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: isMuted ? '#5f6FFF' : 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <MicOff size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Volume2 size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleEndCall}
                style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 }}
              >
                <PhoneOff size={28} color="#fff" />
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>
      </Modal>

      {/* ── Video Call Modal ── */}
      <Modal visible={activeCall === 'video'} animationType="slide" transparent={false} statusBarTranslucent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0f0f1a' }} edges={['top', 'bottom']}>
          <View style={{ flex: 1 }}>

            {/* Remote video */}
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a2e' }}>
              <Image
                source={{ uri: image }}
                style={{ width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#5f6FFF' }}
              />
              <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 16 }}>{doctorName}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{speciality}</Text>
              <Text style={{ color: '#5f6FFF', fontSize: 15, fontWeight: '600', marginTop: 8 }}>
                {formatDuration(callDuration)}
              </Text>
            </View>

            {/* Self video */}
            <View
              style={{ position: 'absolute', top: 20, right: 20, width: 90, height: 130, borderRadius: 16, backgroundColor: '#2a2a3e', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#5f6FFF', overflow: 'hidden' }}
            >
              {isCameraOff ? (
                <VideoOff size={24} color="rgba(255,255,255,0.4)" />
              ) : (
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>You</Text>
              )}
            </View>

            {/* Controls */}
            <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center', gap: 24 }}>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity
                  onPress={() => setIsMuted((prev) => !prev)}
                  style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isMuted ? '#5f6FFF' : 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <MicOff size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsCameraOff((prev) => !prev)}
                  style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: isCameraOff ? '#5f6FFF' : 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <VideoOff size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Volume2 size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleEndCall}
                style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 }}
              >
                <PhoneOff size={28} color="#fff" />
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default DoctorChatPage;