import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Font from '../../assests/fonts/Font';
import Skeleton from './Skeleton';
import { Text } from 'react-native';

const InfoCardSkeleton = () => (
     <View style={styles.infoCard}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={styles.infoContent}>
               <Skeleton width={80} height={10} borderRadius={5} />
               <View style={styles.gapSmall} />
               <Skeleton width={160} height={14} borderRadius={6} />
          </View>
     </View>
);

const ActionButtonSkeleton = () => (
     <View style={styles.actionButton}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <View style={styles.actionContent}>
               <Skeleton width={120} height={14} borderRadius={6} />
               <View style={styles.gapSmall} />
               <Skeleton width={190} height={10} borderRadius={5} />
          </View>
          <Skeleton width={16} height={16} borderRadius={8} />
     </View>
);

const ProfileSkeleton = () => {
     return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false} scrollEnabled={false}>
               {/* Header */}
               <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <Skeleton width={40} height={40} borderRadius={20} />
               </View>

               {/* Avatar */}
               <View style={styles.avatarSection}>
                    <Skeleton width={100} height={100} borderRadius={50} />
                    <View style={styles.gapMedium} />
                    <Skeleton width={160} height={22} borderRadius={8} />
               </View>

               {/* Personal Information */}
               <View style={styles.section}>
                    <View style={styles.sectionTitleSkeleton}>
                         <Skeleton width={150} height={18} borderRadius={8} />
                    </View>
                    <View style={styles.infoGrid}>
                         {Array.from({ length: 5 }).map((_, i) => (
                              <InfoCardSkeleton key={i} />
                         ))}
                    </View>
               </View>

               {/* Account Settings */}
               <View style={styles.section}>
                    <View style={styles.sectionTitleSkeleton}>
                         <Skeleton width={140} height={18} borderRadius={8} />
                    </View>
                    {Array.from({ length: 4 }).map((_, i) => (
                         <ActionButtonSkeleton key={i} />
                    ))}
               </View>

               {/* Logout */}
               <View style={styles.logoutWrapper}>
                    <Skeleton width={'100%'} height={54} borderRadius={12} />
               </View>

               <View style={styles.bottomSpacing} />
          </ScrollView>
     );
};

export default ProfileSkeleton;

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F8F9FA',
     },
     header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 20,
          backgroundColor: '#fff',
     },
     headerTitle: {
          fontSize: 28,
          fontFamily: Font.font500,
          color: '#000',
     },
     avatarSection: {
          alignItems: 'center',
          paddingVertical: 32,
          backgroundColor: '#fff',
          marginBottom: 16,
     },
     section: {
          paddingHorizontal: 24,
          marginBottom: 24,
     },
     sectionTitleSkeleton: {
          marginBottom: 16,
     },
     infoGrid: {
          gap: 12,
     },
     infoCard: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
     },
     infoContent: {
          flex: 1,
          marginLeft: 12,
     },
     actionButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
     },
     actionContent: {
          flex: 1,
          marginLeft: 12,
     },
     logoutWrapper: {
          marginHorizontal: 24,
     },
     gapSmall: {
          height: 6,
     },
     gapMedium: {
          height: 20,
     },
     bottomSpacing: {
          height: 100,
     },
});
