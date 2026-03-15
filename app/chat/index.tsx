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
import { ChatMessage } from '@/types/chat';

// ─── helpers ─────────────────────────────────────────────────────────────────

const ensureDate = (value: Date | string): Date =>
  value instanceof Date ? value : new Date(value);

const formatTime = (value: Date | string): string =>
  ensureDate(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const generateId = (): string => Date.now().toString() + Math.random().toString(36).slice(2);

// ─── Health AI Brain ──────────────────────────────────────────────────────────

type HealthRule = {
  keywords: string[];
  response: string;
};

const HEALTH_RULES: HealthRule[] = [
  // Greetings
  {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    response:
      "Hello! I'm HealthAI, your personal health assistant. I'm here to help you with any health questions, symptoms, medications, or wellness concerns. How are you feeling today?",
  },
  // How are you
  {
    keywords: ['how are you', 'how r you'],
    response:
      "I'm always ready to help! More importantly, how are YOU feeling? Tell me about any symptoms or health concerns you have.",
  },
  // Fever
  {
    keywords: ['fever', 'high temperature', 'temperature', 'hot', 'burning up', 'chills'],
    response:
      "A fever is usually a sign your body is fighting an infection. Here is what I recommend:\n\n• Rest as much as possible\n• Drink plenty of fluids — water, clear broths, or electrolyte drinks\n• Take paracetamol or ibuprofen to bring the temperature down\n• Use a cool damp cloth on your forehead\n• Wear light clothing and stay in a cool room\n\n⚠️ Seek medical attention immediately if your fever is above 39.5°C (103°F), lasts more than 3 days, or is accompanied by a severe headache, stiff neck, or difficulty breathing.",
  },
  // Cold & flu
  {
    keywords: ['cold', 'flu', 'runny nose', 'stuffy nose', 'blocked nose', 'sneezing', 'sore throat', 'throat pain', 'cough'],
    response:
      "It sounds like you may have a cold or flu. Here is how to feel better:\n\n• Get plenty of rest — your body needs energy to fight the infection\n• Stay hydrated with warm liquids like tea, soup, or water\n• Gargle with warm salt water for a sore throat\n• Use a humidifier to ease congestion\n• Over-the-counter decongestants can help with a blocked nose\n• Honey and lemon in warm water can soothe your throat\n\nMost colds resolve within 7–10 days. If symptoms worsen or you develop a high fever, consult a doctor.",
  },
  // Headache
  {
    keywords: ['headache', 'head pain', 'migraine', 'head hurts', 'my head'],
    response:
      "Headaches can have many causes. Here are some steps to help:\n\n• Drink water — dehydration is a very common cause\n• Rest in a quiet, dark room\n• Apply a cold or warm compress to your head or neck\n• Take paracetamol or ibuprofen if needed\n• Avoid screen time and bright lights\n• Try gentle neck and shoulder stretches\n\n⚠️ See a doctor urgently if the headache is sudden and severe (worst of your life), is accompanied by confusion, vision changes, or weakness, or follows a head injury.",
  },
  // Stomach / digestive
  {
    keywords: ['stomach', 'stomach ache', 'stomach pain', 'nausea', 'vomiting', 'diarrhea', 'diarrhoea', 'constipation', 'bloating', 'indigestion', 'heartburn', 'not feeling well'],
    response:
      "Stomach issues are very common. Here is what can help:\n\n• Stick to bland foods — rice, bananas, toast, and boiled chicken\n• Avoid spicy, fatty, or dairy foods until you feel better\n• Sip small amounts of water frequently to stay hydrated\n• Ginger tea can help with nausea\n• Probiotics can help restore gut balance\n• Avoid lying down immediately after eating\n\nIf you have severe abdominal pain, blood in your stool, or symptoms lasting more than 48 hours, please see a doctor.",
  },
  // Back pain
  {
    keywords: ['back pain', 'back ache', 'lower back', 'spine', 'backache'],
    response:
      "Back pain is one of the most common complaints. Here is how to manage it:\n\n• Apply ice for the first 48 hours, then switch to heat\n• Gentle stretching and movement is better than bed rest\n• Take ibuprofen or paracetamol for pain relief\n• Check your posture when sitting — sit upright with support\n• Sleep on your side with a pillow between your knees\n• Avoid lifting heavy objects\n\n⚠️ See a doctor if the pain radiates down your leg, causes numbness or tingling, or is accompanied by bladder or bowel problems.",
  },
  // Chest pain
  {
    keywords: ['chest pain', 'chest tightness', 'chest pressure', 'heart', 'palpitations', 'heart racing', 'shortness of breath'],
    response:
      "⚠️ IMPORTANT: Chest pain can be a medical emergency. Please take this seriously.\n\nIf you are experiencing severe chest pain, pain spreading to your arm, jaw, or back, along with sweating, nausea, or shortness of breath — call emergency services immediately (dial 112 or 911).\n\nIf the pain is mild and you have no other symptoms, it could be muscular, acid reflux, or anxiety. However, any chest pain should be evaluated by a doctor as soon as possible.",
  },
  // Diabetes
  {
    keywords: ['diabetes', 'blood sugar', 'insulin', 'glucose', 'diabetic'],
    response:
      "Managing diabetes is very important for long-term health. Here are key tips:\n\n• Monitor your blood sugar levels regularly\n• Follow a low-sugar, low-glycaemic diet — whole grains, vegetables, lean proteins\n• Exercise for at least 30 minutes most days\n• Take medications exactly as prescribed\n• Stay hydrated with water, not sugary drinks\n• Attend regular check-ups for eyes, feet, and kidneys\n\nIf you experience very high or very low blood sugar symptoms, contact your doctor or go to emergency care.",
  },
  // Blood pressure
  {
    keywords: ['blood pressure', 'hypertension', 'high blood pressure', 'low blood pressure', 'bp'],
    response:
      "Blood pressure management is key to heart health. Here is what helps:\n\n• Reduce salt intake — aim for less than 5g per day\n• Exercise regularly — walking, swimming, cycling\n• Maintain a healthy weight\n• Limit alcohol and avoid smoking\n• Manage stress through meditation, yoga, or deep breathing\n• Take prescribed medications consistently\n• Monitor your blood pressure at home regularly\n\nTarget: below 120/80 mmHg is ideal. Always follow your doctor's guidance.",
  },
  // Sleep
  {
    keywords: ['sleep', 'insomnia', 'cant sleep', 'cannot sleep', 'tired', 'fatigue', 'exhausted', 'sleeping'],
    response:
      "Poor sleep can affect your entire health. Here is how to improve it:\n\n• Go to bed and wake up at the same time every day\n• Avoid screens (phone, TV) at least 1 hour before bed\n• Keep your bedroom cool, dark, and quiet\n• Avoid caffeine after 2pm\n• Try relaxation techniques — deep breathing or meditation\n• Avoid large meals close to bedtime\n• Get some natural sunlight during the day\n\nIf you consistently struggle to sleep despite good habits, speak to a doctor — it could be sleep apnoea or another condition.",
  },
  // Anxiety / stress / mental health
  {
    keywords: ['anxiety', 'stress', 'anxious', 'panic', 'panic attack', 'mental health', 'depression', 'sad', 'worried', 'overwhelmed'],
    response:
      "Your mental health is just as important as your physical health. Here are some strategies:\n\n• Practice deep breathing — inhale for 4 counts, hold for 4, exhale for 6\n• Try mindfulness or meditation apps\n• Regular exercise is one of the best natural anxiety relievers\n• Talk to someone you trust about how you feel\n• Limit caffeine and alcohol which can worsen anxiety\n• Get enough sleep — fatigue makes anxiety worse\n• Write in a journal to process your thoughts\n\n💙 If you are feeling persistently low or overwhelmed, please consider speaking to a mental health professional. You do not have to go through this alone.",
  },
  // Skin
  {
    keywords: ['rash', 'skin', 'itchy', 'itching', 'acne', 'pimple', 'eczema', 'allergy', 'hives', 'swelling'],
    response:
      "Skin issues can have many causes including allergies, infections, or irritants. Here is what to do:\n\n• Avoid scratching — it can worsen the rash and cause infection\n• Apply a cool damp cloth to relieve itching\n• Use an unscented moisturiser for dry or irritated skin\n• Antihistamines can help with allergic reactions\n• Avoid the suspected trigger (new soap, food, fabric)\n• Hydrocortisone cream can reduce mild inflammation\n\n⚠️ See a doctor if the rash is spreading rapidly, is accompanied by fever, affects your face or throat, or you are having difficulty breathing.",
  },
  // Weight
  {
    keywords: ['weight', 'overweight', 'obese', 'lose weight', 'diet', 'nutrition', 'eating', 'fat', 'bmi'],
    response:
      "Healthy weight management is about sustainable habits, not quick fixes. Here are evidence-based tips:\n\n• Eat whole foods — vegetables, fruits, lean proteins, whole grains\n• Control portion sizes rather than eliminating food groups\n• Drink water before meals — it reduces appetite\n• Aim for 150 minutes of moderate exercise per week\n• Get enough sleep — poor sleep increases hunger hormones\n• Limit processed foods, sugar, and refined carbs\n• Track what you eat using a food diary app\n\nConsult a nutritionist or doctor before starting any major diet change.",
  },
  // Exercise
  {
    keywords: ['exercise', 'workout', 'gym', 'fitness', 'physical activity', 'running', 'walking'],
    response:
      "Regular exercise is one of the best things you can do for your health. Here are guidelines:\n\n• Aim for 150 minutes of moderate activity per week (e.g. brisk walking)\n• Include strength training at least 2 days per week\n• Start slow if you are a beginner and gradually increase intensity\n• Warm up for 5 minutes before and cool down after exercise\n• Stay hydrated during workouts\n• Listen to your body — rest if you feel pain (not just soreness)\n\nEven a 20-minute daily walk has significant health benefits!",
  },
  // Medication
  {
    keywords: ['medication', 'medicine', 'drug', 'paracetamol', 'ibuprofen', 'antibiotic', 'prescription', 'dose', 'overdose', 'pills'],
    response:
      "Here are important medication safety tips:\n\n• Always take medications exactly as prescribed or as directed on the label\n• Do not skip doses of antibiotics — complete the full course\n• Never share prescription medications\n• Check for interactions before combining medications\n• Store medications away from heat, moisture, and children\n• Do not take expired medications\n\n⚠️ If you think you or someone else has taken too much medication, call poison control or emergency services immediately.",
  },
  // Eye
  {
    keywords: ['eye', 'eyes', 'blurry vision', 'vision', 'eyesight', 'red eye', 'eye pain', 'itchy eyes'],
    response:
      "Eye health is important. Here are some tips and when to seek help:\n\n• Rest your eyes every 20 minutes when using screens (20-20-20 rule: look 20 feet away for 20 seconds)\n• Wear sunglasses to protect from UV rays\n• Do not rub your eyes — it can cause infection or worsen irritation\n• Use lubricating eye drops for dryness\n• Eat foods rich in Vitamin A and omega-3s for eye health\n\n⚠️ See an eye doctor urgently if you have sudden vision loss, severe eye pain, seeing flashes of light, or eye injury.",
  },
  // Pregnancy
  {
    keywords: ['pregnant', 'pregnancy', 'trimester', 'baby', 'prenatal', 'antenatal', 'morning sickness'],
    response:
      "Pregnancy is a special time that requires extra care. Here are important tips:\n\n• Attend all antenatal appointments\n• Take folic acid (400mcg daily) especially in the first trimester\n• Eat a balanced diet — avoid raw fish, unpasteurised cheese, and alcohol\n• Stay gently active — walking and prenatal yoga are great\n• Stay hydrated — aim for 8–10 glasses of water daily\n• Rest when you need to — your body is working hard\n• Report any unusual symptoms (heavy bleeding, severe pain) to your doctor immediately\n\n💙 Always consult your obstetrician or midwife for personalised advice.",
  },
  // Non-health / off-topic
  {
    keywords: ['weather', 'news', 'sport', 'football', 'movie', 'music', 'politics', 'technology', 'code', 'programming', 'math', 'calculate', 'joke', 'story'],
    response:
      "I am HealthAI, a health-focused assistant. I can only help with health-related questions such as symptoms, medications, nutrition, fitness, mental wellness, and medical advice.\n\nPlease ask me a health question and I will do my best to help you!",
  },
];

// Default fallback for unrecognised health-ish queries
const DEFAULT_HEALTH_RESPONSE =
  "Thank you for sharing that with me. To give you the best advice, could you tell me more about your symptoms?\n\nFor example:\n• Where exactly do you feel the pain or discomfort?\n• How long have you been feeling this way?\n• Do you have any other symptoms like fever, nausea, or fatigue?\n\nThe more detail you share, the better I can help you.";

const getHealthResponse = (userText: string): string => {
  const lower = userText.toLowerCase();

  // Check if user mentions they are not well generically
  if (
    lower.includes('not feeling well') ||
    lower.includes('feel sick') ||
    lower.includes('feeling sick') ||
    lower.includes('unwell') ||
    lower.includes('ill') ||
    lower.includes('feel bad') ||
    lower.includes('feeling bad')
  ) {
    return "I'm sorry to hear you are not feeling well. Can you tell me more about your symptoms?\n\nFor example:\n• Do you have a fever, headache, or stomach pain?\n• Is there any coughing, vomiting, or fatigue?\n• How long have you been feeling this way?\n\nOnce I know more, I can give you better advice.";
  }

  // Match against rules
  for (const rule of HEALTH_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.response;
    }
  }

  return DEFAULT_HEALTH_RESPONSE;
};

// ─── sub-components ──────────────────────────────────────────────────────────

const AiAvatar: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#5f6FFF',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text style={{ color: '#fff', fontSize: size * 0.36, fontWeight: 'bold' }}>AI</Text>
  </View>
);

const TypingIndicator: React.FC = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8, gap: 8 }}>
    <AiAvatar />
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
);

const ImagePreview: React.FC<{ base64: string; onRemove: () => void }> = ({ base64, onRemove }) => (
  <View style={{ marginHorizontal: 16, marginBottom: 8, alignSelf: 'flex-start' }}>
    <View style={{ position: 'relative' }}>
      <Image
        source={{ uri: `data:image/jpeg;base64,${base64}` }}
        style={{ width: 80, height: 80, borderRadius: 12 }}
        resizeMode="cover"
      />
      <TouchableOpacity
        onPress={onRemove}
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
);

// ─── message bubble ──────────────────────────────────────────────────────────

const MessageBubble: React.FC<{ item: ChatMessage }> = ({ item }) => {
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
      {!isUser && <AiAvatar />}

      {item.image && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.image}` }}
          style={{ width: 180, height: 180, borderRadius: 16, marginBottom: 4, marginTop: 4 }}
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
          marginTop: 4,
        }}
      >
        <Text style={{ color: isUser ? '#fff' : '#1f2937', fontSize: 14, lineHeight: 21 }}>
          {item.text}
        </Text>
      </View>

      <Text style={{ color: '#9ca3af', fontSize: 10, marginTop: 4, marginHorizontal: 4 }}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );
};

// ─── main screen ─────────────────────────────────────────────────────────────

const ChatScreen: React.FC = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text:
        "Hello! I'm HealthAI, your personal health assistant. I can help you with symptoms, medications, nutrition, fitness, mental wellness, and more.\n\nPlease note that my responses are for informational purposes only and do not replace professional medical advice. How are you feeling today?",
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = (): void =>
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

  // ── image picker ──────────────────────────────────────────────────────────

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

  // ── send ──────────────────────────────────────────────────────────────────

  const handleSend = async (): Promise<void> => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const imageToSend = selectedImage;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: inputText.trim() || 'I shared an image for analysis.',
      image: imageToSend ?? undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsLoading(true);
    scrollToBottom();

    // ── Auto-reply logic (replace this block with Gemini later) ──
    setTimeout(() => {
      const replyText = getHealthResponse(userMessage.text);

      const aiMessage: ChatMessage = {
        id: generateId(),
        role: 'model',
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      scrollToBottom();
    }, 1200);
    // ── End auto-reply block ──
  };

  const canSend = (inputText.trim().length > 0 || selectedImage !== null) && !isLoading;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
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
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>AI</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: '#111827', fontWeight: 'bold', fontSize: 16 }}>HealthAI</Text>
          <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '500' }}>Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Message list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble item={item} />}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 8 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isLoading && <TypingIndicator />}

        {selectedImage && (
          <ImagePreview base64={selectedImage} onRemove={() => setSelectedImage(null)} />
        )}

        {/* ── Input bar ── */}
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
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
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