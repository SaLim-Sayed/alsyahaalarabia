import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  onFinish,
}) => {
  const opacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const bgOpacity = useSharedValue(1);

  useEffect(() => {
    // Initial entrance animation
    opacity.value = withTiming(1, { duration: 1000 });
    logoScale.value = withTiming(1, { duration: 1200 });

    const timeout = setTimeout(() => {
      // Fade out background and notify finish
      bgOpacity.value = withTiming(0, { duration: 800 });
      setTimeout(onFinish, 900);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.overlay}>
        {/* Main Logo Icon */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image
            source={require("../assets/images/ATـLogo.png")}
            style={styles.atLogo}
            resizeMode="contain"
          />

          <View className="h-4" />

          <Image
            source={require("../assets/images/Al-Syaha-Updated-2.png")}
            style={styles.textLogo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Bottom Branding */}
        <View style={styles.bottomSection}>
          <View className="w-16 h-[2px] bg-accent mb-6" />
          <Text className="text-accent text-[10px] font-[Cairo_700Bold] uppercase tracking-[4px]">
            Alsyaha Alarabiya
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  atLogo: {
    width: 140,
    height: 140,
  },
  textLogo: {
    width: 280,
    height: 90,
  },
  bottomSection: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },
});
