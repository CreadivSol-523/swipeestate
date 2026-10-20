// SwipeCard.tsx
import { Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import colors from '../../assests/Colors/Colors';

const SWIPE_THRESHOLD = 120;

type Props = {
     index: number;
     onSwipeLeft: () => void;
     onSwipeRight: () => void;
     disableLeftSwipe?: boolean;
     disableRightSwipe?: boolean;
     children: React.ReactNode;
};

const SwipeCard = ({ index, onSwipeLeft, onSwipeRight, children, disableRightSwipe, disableLeftSwipe }: Props) => {
     const translateX = useSharedValue(0);
     const rotate = useSharedValue(0);

     const gesture = Gesture.Pan()
          .onUpdate(e => {
               translateX.value = e.translationX;
               rotate.value = e.translationX / 10;
          })
          .onEnd(() => {
               if (translateX.value > SWIPE_THRESHOLD && !disableRightSwipe) {
                    runOnJS(onSwipeRight)();
                    translateX.value = withSpring(500);
               } else if (translateX.value < -SWIPE_THRESHOLD && !disableLeftSwipe) {
                    runOnJS(onSwipeLeft)();
                    translateX.value = withSpring(-500);
               } else {
                    translateX.value = withSpring(0);
                    rotate.value = withSpring(0);
               }
          });

     const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ translateX: translateX.value }, { rotate: `${rotate.value}deg` }],
     }));

     const leftOpacity = useAnimatedStyle(() => ({
          opacity: translateX.value < -SWIPE_THRESHOLD / 2 ? 1 : 0,
     }));

     const rightOpacity = useAnimatedStyle(() => ({
          opacity: translateX.value > SWIPE_THRESHOLD / 2 ? 1 : 0,
     }));

     return (
          <GestureDetector gesture={gesture}>
               <Animated.View style={[styles.card, animatedStyle]}>
                    {children}

                    <Animated.View style={[styles.leftLabel, leftOpacity]}>
                         <Text style={styles.labelText}>PASS</Text>
                    </Animated.View>

                    <Animated.View style={[styles.rightLabel, rightOpacity]}>
                         <Text style={styles.labelText}>LIKE</Text>
                    </Animated.View>
               </Animated.View>
          </GestureDetector>
     );
};

export default SwipeCard;

const styles = StyleSheet.create({
     card: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
     },
     leftLabel: {
          position: 'absolute',
          top: '25%',
          right: 30,
          padding: 8,
          borderRadius: 8,
          backgroundColor: '#FF3B30',
     },
     rightLabel: {
          position: 'absolute',
          top: '25%',
          left: 30,
          padding: 8,
          borderRadius: 8,
          backgroundColor: colors.PrimaryColor,
     },
     labelText: {
          color: '#fff',
          fontSize: 20,
          fontWeight: '600',
     },
});
