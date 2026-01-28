import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const CustomLogo = () => {
     const Icon = ({ name, size = 20, color = '#000' }: { name: string; size: number; color: string }) => {
          const icons: any = {
               mail: '✉',
               lock: '🔒',
               eye: '👁',
               eyeOff: '👁',
               home: '🏠',
               heart: '❤️',
               sparkles: '✨',
               google: 'G',
               facebook: 'f',
          };

          return <Text style={{ fontSize: size, color }}>{icons?.[name] || '•'}</Text>;
     };
     return (
          <View style={styles.logoBox}>
               <View style={styles.houseIconContainer}>
                    <Icon name="home" size={60} color="#0EA5E9" />
                    <View style={styles.heartBadge}>
                         <Icon name="heart" size={20} color="#EF4444" />
                    </View>
               </View>
               <View style={styles.sparkle1}>
                    <Icon name="sparkles" size={18} color="#FBBF24" />
               </View>
               <View style={styles.sparkle2}>
                    <Icon name="sparkles" size={14} color="#FBBF24" />
               </View>
               <View style={styles.sparkle3}>
                    <Icon name="sparkles" size={16} color="#FBBF24" />
               </View>
          </View>
     );
};

export default CustomLogo;

const styles = StyleSheet.create({
     logoBox: {
          width: 120,
          height: 120,
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
          position: 'relative',
     },
     houseIconContainer: {
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
     },
     heartBadge: {
          position: 'absolute',
          top: -10,
          right: -10,
     },
     sparkle1: {
          position: 'absolute',
          top: -8,
          right: -8,
     },
     sparkle2: {
          position: 'absolute',
          top: 15,
          right: -15,
     },
     sparkle3: {
          position: 'absolute',
          top: -15,
          right: 15,
     },
});
