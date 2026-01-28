import React from 'react';
import { StyleSheet, Animated } from 'react-native';

interface skeletonProps {
     width: number;
     height: number;
     borderRadius: number;
}

const Skeleton = ({ width, height, borderRadius = 0 }: skeletonProps) => {
     const animatedValue = new Animated.Value(0);

     Animated.loop(
          Animated.sequence([
               Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
               }),
               Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
               }),
          ]),
     ).start();

     const backgroundColor = animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['#E3E3E3', '#C6C6C6'], // Adjusted colors
     });
     return (
          <Animated.View
               style={[
                    styles.skeleton,
                    {
                         width,
                         height,
                         borderRadius,
                         backgroundColor,
                    },
               ]}
          />
     );
};

export default Skeleton;

const styles = StyleSheet.create({
     skeleton: {
          backgroundColor: '#E0E0E0',
     },
});
