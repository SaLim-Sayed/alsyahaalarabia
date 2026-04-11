import React, { useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { SparklesIcon } from 'react-native-heroicons/solid';

const { width, height } = Dimensions.get('window');

interface CustomSplashScreenProps {
  onFinish: () => void;
}

export const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({ onFinish }) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Show splash for 2.5 seconds then fade out
    const timeout = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 800 });
      scale.value = withTiming(1.1, { duration: 1000 });
      
      // Notify parent to unmount after animation
      setTimeout(onFinish, 900);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ImageBackground 
        source={require('../assets/images/splash_bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Top Gold Line */}
          <View className="w-12 h-1 bg-accent rounded-full mb-10" />

          {/* Main Title */}
          <Text className="text-accent text-5xl font-[Cairo_700Bold] text-center px-10 leading-[70px]">
            مجلة السياحة العربية
          </Text>

          {/* Subtitle */}
          <Text className="text-white/60 text-lg font-[Cairo_400Regular] text-center mt-6 tracking-[2px]">
            بوابتك إلى الفخامة والتراث
          </Text>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View className="w-48 h-[1px] bg-accent/20 mb-6" />
            <Text className="text-accent/40 text-xs font-[Cairo_400Regular] tracking-[3px]">
              جاري التحميل...
            </Text>
            
            <View className="mt-10">
               <SparklesIcon size={32} color="#fbbf24" opacity={0.5} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: '#1a3c34',
  },
  background: {
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 60, 52, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  }
});
