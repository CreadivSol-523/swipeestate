import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';

interface PurchaseModalProps {
     visible: boolean;
     onClose: () => void;
     onBuy: () => void;
     isLoading: boolean;
     planTitle?: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ visible, onClose, onBuy, isLoading, planTitle }) => {
     return (
          <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
               <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlay}>
                         <TouchableWithoutFeedback>
                              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                                   <View style={styles.modalContent}>
                                        <Text style={styles.title}>Subscribe with Apple</Text>
                                        <Text style={styles.subtitle}>
                                             {planTitle
                                                  ? `You will confirm payment for "${planTitle}" with your Apple ID. After purchase, we verify your receipt on our server.`
                                                  : 'You will confirm payment with your Apple ID. After purchase, we verify your receipt on our server.'}
                                        </Text>

                                        <TouchableOpacity style={styles.buyButton} onPress={() => onBuy?.()} disabled={isLoading}>
                                             {isLoading ? <Text style={styles.buyButtonText}>Working…</Text> : <Text style={styles.buyButtonText}>Continue</Text>}
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={isLoading}>
                                             <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>
                                   </View>
                              </KeyboardAvoidingView>
                         </TouchableWithoutFeedback>
                    </View>
               </TouchableWithoutFeedback>
          </Modal>
     );
};

const styles = StyleSheet.create({
     overlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
     },
     modalContainer: {
          width: '100%',
          alignItems: 'center',
     },
     modalContent: {
          width: '85%',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: {
               width: 0,
               height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
     },
     title: {
          fontSize: 18,
          fontWeight: '700',
          color: '#00BCD4',
          textAlign: 'center',
          marginBottom: 8,
          letterSpacing: 0.5,
     },
     subtitle: {
          fontSize: 13,
          color: '#666666',
          textAlign: 'center',
          marginBottom: 24,
          lineHeight: 20,
     },
     buyButton: {
          width: '100%',
          height: 48,
          backgroundColor: '#00BCD4',
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 12,
     },
     buyButtonText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600',
          letterSpacing: 0.5,
     },
     cancelButton: {
          width: '100%',
          height: 44,
          justifyContent: 'center',
          alignItems: 'center',
     },
     cancelButtonText: {
          color: '#666666',
          fontSize: 15,
          fontWeight: '500',
     },
});

export default PurchaseModal;
