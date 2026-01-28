import { CardField } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';

interface PurchaseModalProps {
     visible: boolean;
     onClose: () => void;
     onBuy: () => void;
     isLoading: boolean;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ visible, onClose, onBuy, isLoading }) => {
     const handleBuy = (): void => {
          onBuy?.();
     };

     return (
          <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
               <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.overlay}>
                         <TouchableWithoutFeedback>
                              <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                                   <View style={styles.modalContent}>
                                        {/* Header */}
                                        <Text style={styles.title}>ENTER DETAILS</Text>
                                        <Text style={styles.subtitle}>Please enter the required information</Text>

                                        {/* Input Field */}
                                        <View style={{ width: '100%', marginVertical: 20 }}>
                                             <Text style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 16 }}>Card Number</Text>
                                             <CardField
                                                  postalCodeEnabled={false}
                                                  style={{ width: '100%', height: 50 }}
                                                  cardStyle={{ backgroundColor: '#ffffff', textColor: '#000000', borderColor: '#000000', borderWidth: 1, borderRadius: 8 }}
                                                  onCardChange={cardDetails => {
                                                       console.log('cardDetails', cardDetails);
                                                  }}
                                                  onFocus={focusedField => {
                                                       console.log('focusField', focusedField);
                                                  }}
                                             />
                                        </View>

                                        {/* Buy Button */}
                                        <TouchableOpacity style={[styles.buyButton]} onPress={handleBuy}>
                                             {isLoading ? <Text style={styles.buyButtonText}>Loading...</Text> : <Text style={styles.buyButtonText}>BUY</Text>}
                                        </TouchableOpacity>

                                        {/* Cancel Button */}
                                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
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
     },
     input: {
          width: '100%',
          height: 50,
          backgroundColor: '#F5F5F5',
          borderRadius: 8,
          paddingHorizontal: 16,
          fontSize: 15,
          color: '#333333',
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#E0E0E0',
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
     buyButtonDisabled: {
          backgroundColor: '#B0E5ED',
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
