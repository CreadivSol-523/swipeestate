import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

interface SpinnerProps {
     visible: boolean;
     size?: 'small' | 'large';
     color?: string;
}

const Spinner = ({ visible, size = 'large', color = '#000' }: SpinnerProps) => {
     if (!visible) return null;

     return (
          <Modal transparent animationType="fade">
               <View style={styles.overlay}>
                    <View style={styles.spinnerContainer}>
                         <ActivityIndicator size={size} color={color} />
                    </View>
               </View>
          </Modal>
     );
};

const styles = StyleSheet.create({
     overlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)', // dim background
          justifyContent: 'center',
          alignItems: 'center',
     },
     spinnerContainer: {
          padding: 20,
          backgroundColor: '#fff',
          borderRadius: 10,
     },
});

export default Spinner;
