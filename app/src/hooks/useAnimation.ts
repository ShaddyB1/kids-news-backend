import { useRef } from 'react';
import { Animated } from 'react-native';

interface AnimationConfig {
  duration?: number;
  toValue?: number;
  useNativeDriver?: boolean;
}

export function useAnimation(initialValue = 1) {
  const animation = useRef(new Animated.Value(initialValue)).current;

  const fadeIn = (config?: AnimationConfig) => {
    return Animated.timing(animation, {
      toValue: config?.toValue ?? 1,
      duration: config?.duration ?? 300,
      useNativeDriver: config?.useNativeDriver ?? true,
    });
  };

  const fadeOut = (config?: AnimationConfig) => {
    return Animated.timing(animation, {
      toValue: config?.toValue ?? 0,
      duration: config?.duration ?? 300,
      useNativeDriver: config?.useNativeDriver ?? true,
    });
  };

  const pulse = (config?: AnimationConfig) => {
    return Animated.sequence([
      Animated.timing(animation, {
        toValue: config?.toValue ?? 0.7,
        duration: config?.duration ?? 150,
        useNativeDriver: config?.useNativeDriver ?? true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: config?.duration ?? 150,
        useNativeDriver: config?.useNativeDriver ?? true,
      }),
    ]);
  };

  const scale = (config?: AnimationConfig) => {
    return Animated.sequence([
      Animated.timing(animation, {
        toValue: config?.toValue ?? 0.95,
        duration: config?.duration ?? 100,
        useNativeDriver: config?.useNativeDriver ?? true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: config?.duration ?? 100,
        useNativeDriver: config?.useNativeDriver ?? true,
      }),
    ]);
  };

  return {
    animation,
    fadeIn,
    fadeOut,
    pulse,
    scale,
  };
}
