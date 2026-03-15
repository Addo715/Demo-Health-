import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Mic, MicOff, Volume2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────
type MessageRole = 'user' | 'ai';

type VoiceMessage = {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateId = (): string => Date.now().toString() + Math.random().toString(36).slice(2);

const getCurrentTime = (): string => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ─── Health AI Brain (same as ChatScreen) ────────────────────────────────────
type HealthRule = {
  keywords: string[];
  response: string;
};

const HEALTH_RULES: HealthRule[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    response:
      "Hello! I'm HealthAI, your personal health assistant. I'm here to help you with any health questions, symptoms, medications, or wellness concerns. How are you feeling today?",
  },
  {
    keywords: ['how are you', 'how r you'],
    response:
      "I'm always ready to help! More importantly, how are YOU feeling? Tell me about any symptoms or health concerns you have.",
  },
  {
    keywords: ['fever', 'high temperature', 'temperature', 'hot', 'burning up', 'chills'],
    response:
      "A fever means your body is fighting an infection. Rest well, drink plenty of fluids, and take paracetamol to bring the temperature down. Use a cool damp cloth on your forehead. Seek medical attention immediately if your fever is above 39.5°C, lasts more than 3 days, or comes with a severe headache or difficulty breathing.",
  },
  {
    keywords: ['cold', 'flu', 'runny nose', 'stuffy nose', 'blocked nose', 'sneezing', 'sore throat', 'throat pain', 'cough'],
    response:
      "It sounds like a cold or flu. Get plenty of rest, stay hydrated with warm liquids like tea and soup, and gargle with warm salt water for your throat. Most colds resolve in 7 to 10 days. If symptoms worsen or you develop a high fever, please consult a doctor.",
  },
  {
    keywords: ['headache', 'head pain', 'migraine', 'head hurts', 'my head'],
    response:
      "Headaches are often caused by dehydration. Drink water first, rest in a quiet dark room, and apply a cold compress to your head. Take paracetamol if needed. See a doctor urgently if the headache is sudden and severe, or comes with confusion or vision changes.",
  },
  {
    keywords: ['stomach', 'stomach ache', 'stomach pain', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'bloating', 'indigestion', 'heartburn', 'not feeling well'],
    response:
      "For stomach issues, stick to bland foods like rice, bananas, and toast. Sip water frequently to stay hydrated. Ginger tea can help with nausea. Avoid spicy and fatty foods until you feel better. If you have severe pain or symptoms lasting more than 48 hours, please see a doctor.",
  },
  {
    keywords: ['back pain', 'back ache', 'lower back', 'spine', 'backache'],
    response:
      "For back pain, apply ice for the first 48 hours then switch to heat. Gentle movement is better than bed rest. Take ibuprofen for pain relief and check your posture when sitting. See a doctor if the pain radiates down your leg or causes numbness.",
  },
  {
    keywords: ['chest pain', 'chest tightness', 'chest pressure', 'heart', 'palpitations', 'heart racing', 'shortness of breath'],
    response:
      "Chest pain can be a medical emergency. If you have severe chest pain spreading to your arm or jaw, with sweating or shortness of breath, call emergency services immediately. Any chest pain should be evaluated by a doctor as soon as possible.",
  },
  {
    keywords: ['diabetes', 'blood sugar', 'insulin', 'glucose', 'diabetic'],
    response:
      "Managing diabetes requires monitoring your blood sugar regularly, following a low-sugar diet, exercising daily, and taking medications as prescribed. Attend regular check-ups for your eyes, feet, and kidneys.",
  },
  {
    keywords: ['blood pressure', 'hypertension', 'high blood pressure', 'low blood pressure', 'bp'],
    response:
      "To manage blood pressure, reduce salt intake, exercise regularly, maintain a healthy weight, and limit alcohol. Take prescribed medications consistently. The ideal target is below 120 over 80 mmHg.",
  },
  {
    keywords: ['sleep', 'insomnia', 'cant sleep', 'cannot sleep', 'tired', 'fatigue', 'exhausted', 'sleeping'],
    response:
      "To improve sleep, go to bed at the same time every day, avoid screens one hour before bed, keep your room cool and dark, and limit caffeine after 2pm. If sleep problems persist despite good habits, speak to a doctor.",
  },
  {
    keywords: ['anxiety', 'stress', 'anxious', 'panic', 'panic attack', 'mental health', 'depression', 'sad', 'worried', 'overwhelmed'],
    response:
      "Your mental health matters. Try deep breathing, regular exercise, and talking to someone you trust. Limit caffeine and alcohol. If you feel persistently low or overwhelmed, please consider speaking to a mental health professional. You do not have to go through this alone.",
  },
  {
    keywords: ['rash', 'skin', 'itchy', 'itching', 'acne', 'pimple', 'eczema', 'allergy', 'hives', 'swelling'],
    response:
      "Avoid scratching the affected area. Apply a cool damp cloth, use unscented moisturiser, and try antihistamines for allergic reactions. See a doctor if the rash spreads rapidly, comes with fever, or affects your face or throat.",
  },
  {
    keywords: ['weight', 'overweight', 'obese', 'lose weight', 'diet', 'nutrition', 'eating', 'fat', 'bmi'],
    response:
      "For healthy weight management, eat whole foods, control portion sizes, drink water before meals, and aim for 150 minutes of exercise per week. Avoid processed foods and refined sugars. Consult a nutritionist for personalised advice.",
  },
  {
    keywords: ['exercise', 'workout', 'gym', 'fitness', 'physical activity', 'running', 'walking'],
    response:
      "Aim for 150 minutes of moderate activity per week and include strength training at least twice weekly. Start slow if you are a beginner and always warm up first. Even a 20-minute daily walk has significant health benefits.",
  },
  {
    keywords: ['medication', 'medicine', 'drug', 'paracetamol', 'ibuprofen', 'antibiotic', 'prescription', 'dose', 'pills'],
    response:
      "Always take medications exactly as prescribed. Complete the full course of antibiotics. Never share prescription medications, and check for interactions before combining medications.",
  },
  {
    keywords: ['eye', 'eyes', 'blurry vision', 'vision', 'eyesight', 'red eye', 'eye pain'],
    response:
      "Rest your eyes every 20 minutes when using screens. Do not rub your eyes and use lubricating drops for dryness. See an eye doctor urgently if you have sudden vision loss, severe eye pain, or eye injury.",
  },
  {
    keywords: ['pregnant', 'pregnancy', 'trimester', 'baby', 'prenatal', 'antenatal', 'morning sickness'],
    response:
      "During pregnancy, attend all antenatal appointments, take folic acid daily, eat a balanced diet, stay gently active, and rest when needed. Always consult your doctor or midwife for personalised advice.",
  },
  {
    keywords: ['weather', 'news', 'sport', 'football', 'movie', 'music', 'politics', 'technology', 'code', 'programming', 'math', 'joke'],
    response:
      "I am HealthAI, a health-focused assistant. I can only help with health-related questions. Please ask me about symptoms, medications, nutrition, fitness, or mental wellness.",
  },
];

const DEFAULT_HEALTH_RESPONSE =
  "Thank you for sharing that. Could you tell me more about your symptoms? For example, where do you feel pain or discomfort, how long have you felt this way, and do you have any other symptoms like fever or fatigue?";

const getHealthResponse = (text: string): string => {
  const lower = text.toLowerCase();

  if (
    lower.includes('not feeling well') ||
    lower.includes('feel sick') ||
    lower.includes('feeling sick') ||
    lower.includes('unwell') ||
    lower.includes('ill') ||
    lower.includes('feel bad') ||
    lower.includes('feeling bad')
  ) {
    return "I'm sorry to hear you are not feeling well. Can you describe your symptoms? Do you have a fever, headache, stomach pain, or anything else? The more detail you give me, the better I can help.";
  }

  for (const rule of HEALTH_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response;
    }
  }

  return DEFAULT_HEALTH_RESPONSE;
};

// ─── Simulated voice transcript pool ─────────────────────────────────────────
// When the user "speaks" (taps mic), one of these is picked as the recognised text
const DEMO_VOICE_INPUTS: string[] = [
  "I have a fever and I feel very hot",
  "I have been having headaches for two days",
  "I am not sleeping well at night",
  "I feel anxious and stressed lately",
  "My stomach has been hurting since this morning",
  "I have a sore throat and runny nose",
  "I feel tired all the time",
  "My back has been aching for a week",
  "I have been coughing a lot",
  "Hello, I need some health advice",
];

let demoIndex = 0;
const getNextDemoInput = (): string => {
  const input = DEMO_VOICE_INPUTS[demoIndex % DEMO_VOICE_INPUTS.length];
  demoIndex++;
  return input;
};

// ─── Pulse Animation ──────────────────────────────────────────────────────────
const PulseRing: React.FC<{ isActive: boolean; color: string; size: number }> = ({
  isActive,
  color,
  size,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scale, { toValue: 1.4, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 700, easing: Easing.in(Easing.ease), useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
          ]),
        ])
      ).start();
    } else {
      scale.setValue(1);
      opacity.setValue(0);
    }
  }, [isActive]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar: React.FC<{
  role: 'ai' | 'user';
  isActive: boolean;
  size?: number;
}> = ({ role, isActive, size = 90 }) => {
  const isAI = role === 'ai';
  const color = isAI ? '#5f6FFF' : '#22c55e';
  const label = isAI ? 'AI' : 'Me';
  const bgColor = isAI ? '#5f6FFF' : '#22c55e';

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <PulseRing isActive={isActive} color={color} size={size} />
        <View
          style={{
            width: size - 10,
            height: size - 10,
            borderRadius: (size - 10) / 2,
            backgroundColor: bgColor,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: '#fff',
            shadowColor: bgColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: size * 0.22, fontWeight: '800' }}>{label}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 13, fontWeight: '600', color: isActive ? color : '#9ca3af' }}>
        {isAI ? 'HealthAI' : 'You'}
      </Text>
      {isActive && (
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
            backgroundColor: isAI ? '#eff2ff' : '#dcfce7',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Volume2 size={11} color={color} />
          <Text style={{ fontSize: 11, color, fontWeight: '600' }}>
            {isAI ? 'Speaking...' : 'Listening...'}
          </Text>
        </View>
      )}
    </View>
  );
};

// ─── Transcript bubble ────────────────────────────────────────────────────────
const TranscriptBubble: React.FC<{ item: VoiceMessage }> = ({ item }) => {
  const isUser = item.role === 'user';
  return (
    <View
      style={{
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
        marginVertical: 4,
        paddingHorizontal: 16,
      }}
    >
      {/* Small avatar */}
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: isUser ? '#22c55e' : '#5f6FFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>
          {isUser ? 'Me' : 'AI'}
        </Text>
      </View>

      <View style={{ maxWidth: '75%' }}>
        <View
          style={{
            backgroundColor: isUser ? '#5f6FFF' : '#f3f4f6',
            borderRadius: 16,
            borderBottomRightRadius: isUser ? 4 : 16,
            borderBottomLeftRadius: isUser ? 16 : 4,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: isUser ? '#fff' : '#1f2937', fontSize: 13, lineHeight: 19 }}>
            {item.text}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 10,
            color: '#9ca3af',
            marginTop: 4,
            textAlign: isUser ? 'right' : 'left',
            marginHorizontal: 4,
          }}
        >
          {item.time}
        </Text>
      </View>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const VoiceScreen: React.FC = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList<VoiceMessage>>(null);

  const [transcript, setTranscript] = useState<VoiceMessage[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAISpeaking, setIsAISpeaking] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  // ── Scroll to bottom ───────────────────────────────────────────────────────
  const scrollToBottom = (): void => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // ── Simulate mic tap → recognised speech → AI reply ───────────────────────
  const handleMicPress = (): void => {
    if (isListening || isAISpeaking) return;

    // Start listening
    setIsListening(true);

    setTimeout(() => {
      // Simulate recognised voice input
      const recognisedText = getNextDemoInput();

      const userMsg: VoiceMessage = {
        id: generateId(),
        role: 'user',
        text: recognisedText,
        time: getCurrentTime(),
      };

      setTranscript((prev) => [...prev, userMsg]);
      setIsListening(false);
      setIsAISpeaking(true);
      scrollToBottom();

      // AI "thinks" then "speaks"
      setTimeout(() => {
        const aiReply = getHealthResponse(recognisedText);

        const aiMsg: VoiceMessage = {
          id: generateId(),
          role: 'ai',
          text: aiReply,
          time: getCurrentTime(),
        };

        setTranscript((prev) => [...prev, aiMsg]);
        scrollToBottom();

        // AI finishes speaking after a delay proportional to reply length
        const speakDuration = Math.min(Math.max(aiReply.length * 30, 2000), 6000);
        setTimeout(() => {
          setIsAISpeaking(false);
        }, speakDuration);
      }, 1000);
    }, 2000); // 2s "listening" window
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }} edges={['top', 'left', 'right', 'bottom']}>
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

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827' }}>Voice HealthAI</Text>
          <Text style={{ fontSize: 12, color: '#22c55e', fontWeight: '500' }}>
            {isListening ? 'Listening...' : isAISpeaking ? 'AI is speaking...' : 'Tap mic to speak'}
          </Text>
        </View>

        {/* Transcript toggle */}
        <TouchableOpacity
          onPress={() => setShowTranscript((prev) => !prev)}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: showTranscript ? '#5f6FFF' : '#f3f4f6',
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: showTranscript ? '#fff' : '#6b7280' }}>
            Transcript
          </Text>
        </TouchableOpacity>
      </View>

      {showTranscript ? (
        /* ── Transcript View ── */
        <FlatList
          ref={flatListRef}
          data={transcript}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TranscriptBubble item={item} />}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#374151' }}>No transcript yet</Text>
              <Text style={{ fontSize: 13, color: '#9ca3af' }}>Tap the mic to start talking</Text>
            </View>
          }
        />
      ) : (
        /* ── Voice Call View ── */
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40, paddingHorizontal: 24 }}>

          {/* Avatars row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
              marginTop: 20,
            }}
          >
            {/* AI Avatar */}
            <Avatar role="ai" isActive={isAISpeaking} size={100} />

            {/* VS divider */}
            <View style={{ alignItems: 'center', gap: 6 }}>
              <View style={{ width: 1, height: 40, backgroundColor: '#e5e7eb' }} />
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#9ca3af' }}>VS</Text>
              </View>
              <View style={{ width: 1, height: 40, backgroundColor: '#e5e7eb' }} />
            </View>

            {/* User Avatar */}
            <Avatar role="user" isActive={isListening} size={100} />
          </View>

          {/* Status message */}
          <View style={{ alignItems: 'center', gap: 8, paddingHorizontal: 32 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', textAlign: 'center' }}>
              {isListening
                ? 'Listening to you...'
                : isAISpeaking
                ? 'HealthAI is responding...'
                : transcript.length === 0
                ? 'Ask me anything about your health'
                : 'Tap the mic to continue'}
            </Text>

            {/* Last message preview */}
            {transcript.length > 0 && !isListening && !isAISpeaking && (
              <View
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: '#f0f0f0',
                  width: '100%',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
                  Last response
                </Text>
                <Text style={{ fontSize: 13, color: '#374151', lineHeight: 18 }} numberOfLines={3}>
                  {transcript[transcript.length - 1]?.text}
                </Text>
              </View>
            )}
          </View>

          {/* Mic button */}
          <View style={{ alignItems: 'center', gap: 16 }}>
            <Text style={{ fontSize: 12, color: '#9ca3af' }}>
              {isListening || isAISpeaking ? 'Please wait...' : 'Tap to speak'}
            </Text>

            <TouchableOpacity
              onPress={handleMicPress}
              disabled={isListening || isAISpeaking}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor:
                  isListening
                    ? '#22c55e'
                    : isAISpeaking
                    ? '#f3f4f6'
                    : '#5f6FFF',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: isListening ? '#22c55e' : '#5f6FFF',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: isListening || isAISpeaking ? 0 : 0.35,
                shadowRadius: 14,
                elevation: isListening || isAISpeaking ? 0 : 10,
              }}
            >
              {isListening ? (
                <MicOff size={32} color="#fff" />
              ) : (
                <Mic size={32} color={isAISpeaking ? '#9ca3af' : '#fff'} />
              )}
            </TouchableOpacity>


          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VoiceScreen;