// src/components/common/AnimatedContainer.js
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const AnimatedContainer = ({ 
  children, 
  style, 
  animation = 'fadeIn', 
  duration = 800, 
  delay = 0,
  ...props 
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const animations = [];
    
    if (animation === 'fadeIn' || animation === 'fadeInUp') {
      animations.push(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      );
    }
    
    if (animation === 'fadeInUp' || animation === 'slideUp') {
      animations.push(
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        })
      );
    }
    
    if (animation === 'scaleIn') {
      animations.push(
        Animated.timing(scaleValue, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      );
    }

    const animation_sequence = Animated.parallel(animations);
    
    if (delay > 0) {
      setTimeout(() => animation_sequence.start(), delay);
    } else {
      animation_sequence.start();
    }
  }, []);

  const getAnimatedStyle = () => {
    switch (animation) {
      case 'fadeIn':
        return { opacity: animatedValue };
      case 'fadeInUp':
        return { 
          opacity: animatedValue,
          transform: [{ translateY }]
        };
      case 'scaleIn':
        return { 
          opacity: animatedValue,
          transform: [{ scale: scaleValue }]
        };
      case 'slideUp':
        return { 
          transform: [{ translateY }]
        };
      default:
        return { opacity: animatedValue };
    }
  };

  return (
    <Animated.View style={[style, getAnimatedStyle()]} {...props}>
      {children}
    </Animated.View>
  );
};

export default AnimatedContainer;
