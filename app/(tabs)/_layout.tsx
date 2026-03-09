import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { CalendarDays, Home, Search, UserRound } from "lucide-react-native";
import React from "react";
import { Animated, Pressable } from "react-native";

const TAB_BAR_BG = "#1a1a2e";
const ACTIVE_BG = "#5f6FFF";
const INACTIVE_COLOR = "#888";
const ACTIVE_COLOR = "#fff";

type AnimatedTabButtonProps = {
  children: React.ReactNode;
  onPress?: BottomTabBarButtonProps["onPress"];
  onLongPress?: BottomTabBarButtonProps["onLongPress"];
  isFocused: boolean;
  label: string;
};

function AnimatedTabButton({
  children,
  onPress,
  onLongPress,
  isFocused,
  label,
}: AnimatedTabButtonProps) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const widthAnim = React.useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: false,
      friction: 7,
      tension: 60,
    }).start();
  }, [isFocused]);

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
      friction: 5,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [48, 120],
  });

  const labelOpacity = widthAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Pressable
      onPress={(e) => onPress?.(e)}
      onLongPress={(e) => onLongPress?.(e)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          width: animatedWidth,
          height: 46,
          borderRadius: 23,
          backgroundColor: isFocused ? ACTIVE_BG : "transparent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          overflow: "hidden",
        }}
      >
        {children}
        <Animated.Text
          style={{
            opacity: labelOpacity,
            color: ACTIVE_COLOR,
            fontWeight: "600",
            fontSize: 13,
          }}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const TABS = [
  { name: "home", label: "Home", Icon: Home },
  { name: "doctors", label: "Doctors", Icon: Search },
  { name: "booking", label: "Booking", Icon: CalendarDays },
  { name: "my-profile", label: "Profile", Icon: UserRound },
] as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: TAB_BAR_BG,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          paddingHorizontal: 8,
          borderRadius: 40,
          marginHorizontal: 16,
          marginBottom: 20,
          position: "absolute",
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        tabBarButton: (props: BottomTabBarButtonProps) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const { Icon, label } = tab;
          const isFocused = props.accessibilityState?.selected ?? false;

          return (
            <AnimatedTabButton
              onPress={props.onPress}
              onLongPress={props.onLongPress}
              isFocused={isFocused}
              label={label}
            >
              <Icon
                size={22}
                color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
                strokeWidth={isFocused ? 2.5 : 1.8}
              />
            </AnimatedTabButton>
          );
        },
      })}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.label }}
        />
      ))}
    </Tabs>
  );
}
