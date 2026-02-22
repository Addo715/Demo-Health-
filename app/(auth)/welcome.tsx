import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Image,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────────
//  SLIDE DATA  (3 slides only)
//  💡 Replace image URLs with local assets later:
//     require('../assets/slide1.jpg')
// ─────────────────────────────────────────────
const slides = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1640876777002-badf6aee5bcc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D', // 💡 swap later
    title: 'Connect with Trusted\n',
    titleHighlight: 'Health Professionals',
    description: 'Find and consult with verified doctors and specialists from the comfort of your home.',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1574706473454-a3b3da3fc5b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D', // 💡 swap later
    title: 'Secure & Convenient\n',
    titleHighlight: 'Virtual Care',
    description: 'Schedule appointments, chat, or video call with healthcare experts anytime, anywhere.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80', // 💡 swap later
    title: 'Personalized ',
    titleHighlight: 'Health Support',
    description: 'Get tailored advice, prescriptions, and ongoing care to stay on top of your health journey.',
    isLast: true,
  },
];

// ─────────────────────────────────────────────
//  DOT INDICATOR
// ─────────────────────────────────────────────
function Dots({ total, active }: { total: number; active: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center', marginVertical: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: active === i ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: active === i ? '#1A56FF' : '#D1D5DB',
          }}
        />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
//  MAIN WELCOME SCREEN
// ─────────────────────────────────────────────
const Welcome = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const goNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    }
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <View style={{ width, height, backgroundColor: '#fff' }}>

      {/* ── Doctor photo (top ~55% of screen) ── */}
      <Image
        source={{ uri: item.image }} // 💡 for local: source={item.image}
        style={{ width, height: height * 0.55 }}
        resizeMode="cover"
      />

      {/* ── White card overlapping the image ── */}
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -30,
          paddingHorizontal: 28,
          paddingTop: 24,
          paddingBottom: 24,
          alignItems: 'center',       // center everything horizontally
          justifyContent: 'center',   // center everything vertically
        }}
      >
        {/* Title */}
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', textAlign: 'center', lineHeight: 30 }}>
          {item.title}
          <Text style={{ color: '#1A56FF' }}>{item.titleHighlight}</Text>
        </Text>

        {/* Description */}
        <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginTop: 8 }}>
          {item.description}
        </Text>

        {/* Dots */}
        <Dots total={slides.length} active={activeIndex} />

        {/* ── Buttons ── */}
        {item.isLast ? (
          // Last slide: Login + Sign Up
          <View style={{ width: '100%', gap: 10 }}>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')} // 💡 change route if needed
              style={{ backgroundColor: '#1A56FF', borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup')} // 💡 change route if needed
              style={{ backgroundColor: '#EFF6FF', borderRadius: 14, paddingVertical: 15, alignItems: 'center' }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#1A56FF', fontWeight: '700', fontSize: 15 }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Regular slides: Skip + Next
          <View style={{ flexDirection: 'row', width: '100%', gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={{ flex: 1, borderRadius: 14, paddingVertical: 15, alignItems: 'center', backgroundColor: '#F3F4F6' }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#6B7280', fontWeight: '600', fontSize: 15 }}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goNext}
              style={{ flex: 1, borderRadius: 14, paddingVertical: 15, alignItems: 'center', backgroundColor: '#1A56FF' }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default Welcome;