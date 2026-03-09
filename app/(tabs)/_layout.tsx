import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs, usePathname } from "expo-router";
import {
  CalendarDays as CalendarIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  UserRound as UserIcon,
} from "lucide-react-native";
import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TAB_BAR_BG = "#1a1a2e";
const ACTIVE_BG = "#fff";
const INACTIVE_COLOR = "#94a3b8";
const ACTIVE_COLOR = "#5f6FFF";

type AnimatedTabButtonProps = {
  children: React.ReactNode;
  onPress?: BottomTabBarButtonProps["onPress"];
  onLongPress?: BottomTabBarButtonProps["onLongPress"];
  isFocused: boolean;
  label: string;
  routeName: string;
};

function AnimatedTabButton({
  children,
  onPress,
  onLongPress,
  isFocused: isFocusedProp,
  label,
  routeName,
}: AnimatedTabButtonProps) {
  const pathname = usePathname();

  // Deriving focus from both accessibility state and current pathname for maximum reliability
  const isFocused = isFocusedProp || pathname === `/${routeName}` || (pathname === "/" && routeName === "home");

  const isFocusedAnim = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    isFocusedAnim.value = withSpring(isFocused ? 1 : 0, {
      damping: 18,
      stiffness: 150,
    });
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      // Balanced widths for 4 tabs: 110 active, 68 inactive
      width: interpolate(isFocusedAnim.value, [0, 1], [68, 110]),
      backgroundColor: interpolateColor(
        isFocusedAnim.value,
        [0, 1],
        ["transparent", ACTIVE_BG]
      ),
      gap: 4, // Tight gap to save space
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(isFocusedAnim.value, [0, 1], [0.6, 1]),
      width: interpolate(isFocusedAnim.value, [0, 1], [42, 65]),
    };
  });

  return (
    <Pressable
      onPress={(e) => onPress?.(e)}
      onLongPress={(e) => onLongPress?.(e)}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View
        style={[
          {
            height: 40, // More compact height
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            // Professional shadow for the active pill
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isFocused ? 0.08 : 0,
            shadowRadius: 3,
            elevation: isFocused ? 3 : 0,
          },
          animatedStyle,
        ]}
      >
        <View style={{ width: 18, height: 18, alignItems: "center", justifyContent: "center" }}>
          {children}
        </View>
        <Animated.View style={[{ overflow: 'hidden' }, labelStyle]}>
          <Animated.Text
            style={{
              color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
              fontWeight: "700",
              fontSize: 11, // Slightly smaller for better fit
              letterSpacing: -0.4,
              width: 65,
            }}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const TABS = [
  { name: "home", label: "Home", Icon: HomeIcon },
  { name: "doctors", label: "Doctors", Icon: SearchIcon },
  { name: "booking", label: "Booking", Icon: CalendarIcon },
  { name: "my-profile", label: "Profile", Icon: UserIcon },
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
          height: 70, // Optimized height
          paddingBottom: 20,
          paddingTop: 10,
          paddingHorizontal: 10,
          borderRadius: 35,
          marginHorizontal: 12, // More margin to keep pill safe
          marginBottom: 24,
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 15,
          elevation: 10,
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
              routeName={route.name}
            >
              <Icon
                size={18}
                color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
                strokeWidth={isFocused ? 2.5 : 2}
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
