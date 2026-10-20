import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { windowHeight } from '../../utils/Dimension/Dimension';
import colors from '../../assests/Colors/Colors';

interface isMessageProps {
     text?: string;
     height?: number;
     onRetry?: () => void;
     retryLabel?: string;
}
const Ismessage = ({ text, height, onRetry, retryLabel }: isMessageProps) => {
     return (
          <View style={{ justifyContent: 'center', alignItems: 'center', height: height ? height : windowHeight * 0.9 }}>
               <Text style={{ fontSize: 25, fontWeight: '600', color: colors.gray, textAlign: 'center', paddingHorizontal: 24 }}>
                    {text ? text : 'Message'}
               </Text>
               {onRetry ? (
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
                         <Text style={styles.retryText}>{retryLabel || 'Retry'}</Text>
                    </TouchableOpacity>
               ) : null}
          </View>
     );
};

export default Ismessage;

const styles = StyleSheet.create({
     retryButton: {
          marginTop: 20,
          backgroundColor: colors.PrimaryColor || '#38B6FF',
          paddingHorizontal: 28,
          paddingVertical: 12,
          borderRadius: 8,
     },
     retryText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
     },
});
