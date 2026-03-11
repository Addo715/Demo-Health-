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

const TAB_BAR_BG = "#ffffff";     // white
const ACTIVE_BG = "#5f6FFF";  // blue (was #1e3a8a)
const INACTIVE_COLOR = "#9ca3af"; // gray icons
const ACTIVE_COLOR = "#ffffff";   // white text + icon

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

  const isFocused =
    isFocusedProp ||
    pathname === `/${routeName}` ||
    (pathname === "/" && routeName === "home");

  // Only animate when becoming active
  const isFocusedAnim = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    if (isFocused) {
      // Only run spring animation when this tab becomes active
      isFocusedAnim.value = withSpring(1, {
        damping: 18,
        stiffness: 150,
      });
    } else {
      // Instantly snap to 0 when inactive — no bounce
      isFocusedAnim.value = 0;
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(isFocusedAnim.value, [0, 1], [44, 90]),
      backgroundColor: interpolateColor(
        isFocusedAnim.value,
        [0, 1],
        ["transparent", ACTIVE_BG]
      ),
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(isFocusedAnim.value, [0, 1], [0, 1]),
      width: interpolate(isFocusedAnim.value, [0, 1], [0, 55]),
      marginLeft: interpolate(isFocusedAnim.value, [0, 1], [0, 4]),
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
            height: 40,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            paddingHorizontal: 10,
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            width: 18,
            height: 18,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </View>

        <Animated.View style={[{ overflow: "hidden" }, labelStyle]}>
          <Animated.Text
            numberOfLines={1}
            style={{
              color: ACTIVE_COLOR,
              fontWeight: "700",
              fontSize: 11,
              letterSpacing: -0.4,
            }}
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
          height: 70,
          paddingBottom: 20,
          paddingTop: 10,
          paddingHorizontal: 10,
          borderRadius: 35,
          marginHorizontal: 12,
          marginBottom: 24,
          position: "absolute",
          // Box shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 12,
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