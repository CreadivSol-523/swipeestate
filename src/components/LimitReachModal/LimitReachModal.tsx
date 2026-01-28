import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../assests/color/color';
import Font from '../../assests/fonts/Font';

interface LimitReachedModalProps {
     visible: boolean;
     onClose: () => void;
     onUpgrade: () => void;
     limitType: 'listings' | 'swipes' | 'featured' | 'analytics';
     currentLimit?: number;
     currentPlan?: string;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ visible, onClose, onUpgrade, limitType, currentLimit, currentPlan = 'Basic' }) => {
     // Dynamic content based on limit type
     const getModalContent = () => {
          switch (limitType) {
               case 'listings':
                    return {
                         icon: 'home-outline',
                         iconColor: '#EF4444',
                         iconBg: '#FEE2E2',
                         title: 'Listing Limit Reached',
                         message: `You've reached your limit of ${currentLimit} property listings on the ${currentPlan} plan.`,
                         suggestion: 'Upgrade to add more properties and reach more potential tenants.',
                    };
               case 'swipes':
                    return {
                         icon: 'people-outline',
                         iconColor: '#F59E0B',
                         iconBg: '#FEF3C7',
                         title: 'Daily Swipe Limit Reached',
                         message: `You've used all your daily swipes on the ${currentPlan} plan.`,
                         suggestion: 'Upgrade for unlimited swipes and never miss a potential tenant.',
                    };
               case 'featured':
                    return {
                         icon: 'star-outline',
                         iconColor: '#8B5CF6',
                         iconBg: '#EDE9FE',
                         title: 'Feature Not Available',
                         message: `Featured listings are not available on the ${currentPlan} plan.`,
                         suggestion: 'Upgrade to boost your properties to the top of search results.',
                    };
               case 'analytics':
                    return {
                         icon: 'analytics-outline',
                         iconColor: '#3B82F6',
                         iconBg: '#DBEAFE',
                         title: 'Advanced Analytics Locked',
                         message: `Advanced analytics are not included in the ${currentPlan} plan.`,
                         suggestion: 'Upgrade to access detailed insights and performance metrics.',
                    };
               default:
                    return {
                         icon: 'alert-circle-outline',
                         iconColor: colors.PrimaryColor,
                         iconBg: '#DBEAFE',
                         title: 'Limit Reached',
                         message: `You've reached the limit on your ${currentPlan} plan.`,
                         suggestion: 'Upgrade to unlock more features.',
                    };
          }
     };

     const content = getModalContent();

     return (
          <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
               <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                         {/* Close Button */}
                         <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                              <Icon name="close" size={24} color="#666" />
                         </TouchableOpacity>

                         {/* Icon */}
                         <View style={[styles.iconContainer, { backgroundColor: content.iconBg }]}>
                              <Icon name={content.icon} size={48} color={content.iconColor} />
                         </View>

                         {/* Title */}
                         <Text style={styles.title}>{content.title}</Text>

                         {/* Message */}
                         <Text style={styles.message}>{content.message}</Text>

                         {/* Suggestion */}
                         <View style={styles.suggestionBox}>
                              <Icon name="bulb-outline" size={20} color={colors.PrimaryColor} />
                              <Text style={styles.suggestionText}>{content.suggestion}</Text>
                         </View>

                         {/* Benefits List */}
                         <View style={styles.benefitsContainer}>
                              <Text style={styles.benefitsTitle}>Upgrade Benefits:</Text>
                              <View style={styles.benefitItem}>
                                   <Icon name="checkmark-circle" size={20} color="#10B981" />
                                   <Text style={styles.benefitText}>{limitType === 'listings' ? 'Up to 20 or Unlimited listings' : 'Unlimited daily swipes'}</Text>
                              </View>
                              <View style={styles.benefitItem}>
                                   <Icon name="checkmark-circle" size={20} color="#10B981" />
                                   <Text style={styles.benefitText}>Featured property placement</Text>
                              </View>
                              <View style={styles.benefitItem}>
                                   <Icon name="checkmark-circle" size={20} color="#10B981" />
                                   <Text style={styles.benefitText}>Advanced analytics & insights</Text>
                              </View>
                              <View style={styles.benefitItem}>
                                   <Icon name="checkmark-circle" size={20} color="#10B981" />
                                   <Text style={styles.benefitText}>Priority support 24/7</Text>
                              </View>
                         </View>

                         {/* Action Buttons */}
                         <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
                              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                              <Icon name="arrow-forward" size={20} color="#fff" />
                         </TouchableOpacity>

                         <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                              <Text style={styles.cancelButtonText}>Maybe Later</Text>
                         </TouchableOpacity>
                    </View>
               </View>
          </Modal>
     );
};

export default LimitReachedModal;

const styles = StyleSheet.create({
     overlay: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
     },
     modalContainer: {
          backgroundColor: '#fff',
          borderRadius: 24,
          padding: 24,
          width: '100%',
          maxWidth: 400,
          alignItems: 'center',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
     },
     closeButton: {
          position: 'absolute',
          top: 16,
          right: 16,
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
     },
     iconContainer: {
          width: 96,
          height: 96,
          borderRadius: 48,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
     },
     title: {
          fontSize: 24,
          fontFamily: Font.font500,
          color: '#000',
          textAlign: 'center',
          marginBottom: 12,
     },
     message: {
          fontSize: 15,
          fontFamily: Font.font400,
          color: '#666',
          textAlign: 'center',
          lineHeight: 22,
          marginBottom: 16,
     },
     suggestionBox: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          backgroundColor: '#F0F7FF',
          padding: 14,
          borderRadius: 12,
          gap: 10,
          marginBottom: 20,
          width: '100%',
     },
     suggestionText: {
          flex: 1,
          fontSize: 14,
          fontFamily: Font.font400,
          color: colors.PrimaryColor,
          lineHeight: 20,
     },
     benefitsContainer: {
          width: '100%',
          backgroundColor: '#F8F9FA',
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
     },
     benefitsTitle: {
          fontSize: 15,
          fontFamily: Font.font500,
          color: '#000',
          marginBottom: 12,
     },
     benefitItem: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          marginBottom: 8,
     },
     benefitText: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#666',
          flex: 1,
     },
     upgradeButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.PrimaryColor,
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 16,
          width: '100%',
          gap: 8,
          marginBottom: 12,
          elevation: 2,
          shadowColor: colors.PrimaryColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
     },
     upgradeButtonText: {
          fontSize: 16,
          fontFamily: Font.font500,
          color: '#fff',
     },
     cancelButton: {
          paddingVertical: 12,
     },
     cancelButtonText: {
          fontSize: 14,
          fontFamily: Font.font400,
          color: '#999',
     },
});

// Usage Example:
/*
const [modalVisible, setModalVisible] = useState(false);

<LimitReachedModal
     visible={modalVisible}
     onClose={() => setModalVisible(false)}
     onUpgrade={() => {
          setModalVisible(false);
          navigation.navigate('Subscription');
     }}
     limitType="listings"
     currentLimit={5}
     currentPlan="Basic"
/>
*/
