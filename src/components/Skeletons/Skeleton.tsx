import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, DimensionValue } from 'react-native';

interface SkeletonProps {
     width: DimensionValue;
     height: number;
     borderRadius?: number;
}

const Skeleton = ({ width, height, borderRadius = 0 }: SkeletonProps) => {
     const opacity = useRef(new Animated.Value(0.5)).current;

     useEffect(() => {
          const loop = Animated.loop(
               Animated.sequence([
                    Animated.timing(opacity, {
                         toValue: 1,
                         duration: 800,
                         useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                         toValue: 0.5,
                         duration: 800,
                         useNativeDriver: true,
                    }),
               ]),
          );

          loop.start();

          return () => loop.stop();
     }, [opacity]);

     return (
          <Animated.View
               style={[
                    styles.skeleton,
                    {
                         width,
                         height,
                         borderRadius,
                         opacity,
                    },
               ]}
          />
     );
};

export default Skeleton;

const styles = StyleSheet.create({
     skeleton: {
          backgroundColor: '#D9D9D9',
     },
});
