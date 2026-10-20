import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface MatchApartmentCardSkeletonProps {
     count?: number;
}

const SingleSkeletonCard = () => {
     const animatedValue = useRef(new Animated.Value(0.3)).current;

     useEffect(() => {
          const pulse = Animated.loop(
               Animated.sequence([
                    Animated.timing(animatedValue, {
                         toValue: 1,
                         duration: 800,
                         useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                         toValue: 0.3,
                         duration: 800,
                         useNativeDriver: true,
                    }),
               ]),
          );
          pulse.start();
          return () => pulse.stop();
     }, [animatedValue]);

     return (
          <View style={styles.card}>
               {/* Image Placeholder */}
               <View style={styles.imageContainer}>
                    <Animated.View style={[styles.skeletonBlock, styles.fullImage, { opacity: animatedValue }]} />
                    {/* Badge Skeleton */}
                    <Animated.View style={[styles.skeletonBlock, styles.statusBadgeSkeleton, { opacity: animatedValue }]} />
                    {/* Favorite Button Skeleton */}
                    <Animated.View style={[styles.skeletonBlock, styles.favoriteButtonSkeleton, { opacity: animatedValue }]} />
               </View>

               {/* Content Placeholder */}
               <View style={styles.cardContent}>
                    {/* Title Skeleton */}
                    <Animated.View style={[styles.skeletonBlock, styles.titleSkeleton, { opacity: animatedValue }]} />

                    {/* Location Row Skeleton */}
                    <View style={styles.locationRow}>
                         <Animated.View style={[styles.skeletonBlock, styles.iconSkeleton, { opacity: animatedValue }]} />
                         <Animated.View style={[styles.skeletonBlock, styles.locationTextSkeleton, { opacity: animatedValue }]} />
                    </View>

                    {/* Features Row Skeleton (Beds / Baths / Sqft) */}
                    <View style={styles.featuresRow}>
                         <Animated.View style={[styles.skeletonBlock, styles.featurePillSkeleton, { opacity: animatedValue }]} />
                         <View style={styles.featureDivider} />
                         <Animated.View style={[styles.skeletonBlock, styles.featurePillSkeleton, { opacity: animatedValue }]} />
                         <View style={styles.featureDivider} />
                         <Animated.View style={[styles.skeletonBlock, styles.featurePillSkeleton, { opacity: animatedValue }]} />
                    </View>

                    {/* Footer Skeleton (Price + View Button) */}
                    <View style={styles.footer}>
                         <Animated.View style={[styles.skeletonBlock, styles.priceSkeleton, { opacity: animatedValue }]} />
                         <Animated.View style={[styles.skeletonBlock, styles.buttonSkeleton, { opacity: animatedValue }]} />
                    </View>
               </View>
          </View>
     );
};

const MatchApartmentCardSkeleton: React.FC<MatchApartmentCardSkeletonProps> = ({ count = 1 }) => {
     return (
          <>
               {Array.from({ length: count }).map((_, index) => (
                    <SingleSkeletonCard key={index} />
               ))}
          </>
     );
};

export default MatchApartmentCardSkeleton;

const styles = StyleSheet.create({
     card: {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          marginBottom: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#F3F4F6',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
     },
     skeletonBlock: {
          backgroundColor: '#E5E7EB',
     },
     imageContainer: {
          height: 180,
          width: '100%',
          position: 'relative',
          backgroundColor: '#F3F4F6',
     },
     fullImage: {
          width: '100%',
          height: '100%',
     },
     statusBadgeSkeleton: {
          position: 'absolute',
          top: 12,
          left: 12,
          width: 80,
          height: 24,
          borderRadius: 12,
     },
     favoriteButtonSkeleton: {
          position: 'absolute',
          top: 12,
          right: 12,
          width: 32,
          height: 32,
          borderRadius: 16,
     },
     cardContent: {
          padding: 16,
     },
     titleSkeleton: {
          height: 18,
          width: '75%',
          borderRadius: 4,
          marginBottom: 10,
     },
     locationRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 14,
     },
     iconSkeleton: {
          width: 14,
          height: 14,
          borderRadius: 7,
     },
     locationTextSkeleton: {
          height: 14,
          width: '50%',
          borderRadius: 4,
     },
     featuresRow: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 10,
          paddingHorizontal: 8,
          backgroundColor: '#F9FAFB',
          borderRadius: 10,
          marginBottom: 16,
     },
     featurePillSkeleton: {
          height: 14,
          width: '24%',
          borderRadius: 4,
     },
     featureDivider: {
          width: 1,
          height: 16,
          backgroundColor: '#E5E7EB',
     },
     footer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 4,
     },
     priceSkeleton: {
          height: 20,
          width: 90,
          borderRadius: 4,
     },
     buttonSkeleton: {
          height: 36,
          width: 76,
          borderRadius: 10,
     },
});
