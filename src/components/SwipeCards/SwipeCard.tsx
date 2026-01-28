import { Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { windowHeight } from '../../utils/Dimension/Dimension';
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

     // Overlay Labels
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

                    {/* LEFT LABEL */}
                    <Animated.View style={[styles.leftLabel, leftOpacity]}>
                         <Text style={styles.labelText}>PASS</Text>
                    </Animated.View>

                    {/* RIGHT LABEL */}
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
          width: '100%',
          height: windowHeight * 0.95,
     },
     leftLabel: {
          position: 'absolute',
          top: 20,
          right: 30,
          padding: 8,
          borderRadius: 8,
          backgroundColor: '#FF3B30',
     },
     rightLabel: {
          position: 'absolute',
          top: 20,
          left: 30,
          padding: 8,
          borderRadius: 8,
          backgroundColor: colors.PrimaryColor, // ya tumhare colors.PrimaryColor
     },
     labelText: {
          color: '#fff',
          fontSize: 20,
          fontWeight: '600',
     },
});
