import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import { windowWidth } from '../../utils/Dimension/Dimension';

const PropertyCardSkeleton = () => {
     return (
          <View style={styles.card}>
               {/* Featured and Rent badges area */}
               <View style={styles.badgesContainer}>
                    <Skeleton width={80} height={24} borderRadius={12} />
                    <Skeleton width={50} height={24} borderRadius={12} />
               </View>

               {/* Image area */}
               <Skeleton width={windowWidth - 80} height={180} borderRadius={12} />

               {/* Title area */}
               <View style={styles.titleContainer}>
                    <Skeleton width={60} height={20} borderRadius={4} />
                    <Skeleton width={50} height={16} borderRadius={8} />
               </View>

               {/* Location */}
               <View style={styles.locationContainer}>
                    <Skeleton width={12} height={12} borderRadius={6} />
                    <Skeleton width={40} height={14} borderRadius={4} />
               </View>

               {/* Stats row */}
               <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                         <Skeleton width={24} height={24} borderRadius={4} />
                         <Skeleton width={40} height={16} borderRadius={4} />
                         <Skeleton width={30} height={12} borderRadius={4} />
                    </View>

                    <View style={styles.statItem}>
                         <Skeleton width={24} height={24} borderRadius={4} />
                         <Skeleton width={20} height={16} borderRadius={4} />
                         <Skeleton width={30} height={12} borderRadius={4} />
                    </View>

                    <View style={styles.statItem}>
                         <Skeleton width={24} height={24} borderRadius={4} />
                         <Skeleton width={30} height={16} borderRadius={4} />
                         <Skeleton width={25} height={12} borderRadius={4} />
                    </View>
               </View>
          </View>
     );
};

export default PropertyCardSkeleton;

const styles = StyleSheet.create({
     card: {
          width: '95%',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          marginHorizontal: 8,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
     },
     badgesContainer: {
          flexDirection: 'row',
          gap: 8,
          marginBottom: 12,
     },
     titleContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          marginBottom: 8,
     },
     locationContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
     },
     statsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
     },
     statItem: {
          alignItems: 'center',
          gap: 4,
     },
});
