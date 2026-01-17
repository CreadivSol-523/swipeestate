import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { authUser } from '../../redux/Features/authState';
import { useCreateIntendHandler } from '../../models/Subscription/Subscription';
import { useStripe } from '@stripe/stripe-react-native';
import Spinner from '../../components/Loader/Spinner';
import colors from '../../assests/Colors/Colors';

const SelectPlan = ({
     route,
}: {
     route: { params: { email: string; password: string; name: string; city: string; phone: string; selectedIncome: string; confirmPassword: string; acountType: string; craditScore: string } };
}) => {
     const [isLoading, setIsLoading] = useState(false);
     const { email, password, name, city, confirmPassword, phone, selectedIncome, acountType, craditScore } = route.params;
     const dispatch = useDispatch();

     const [isPaymentSheetReady, setIsPaymentSheetReady] = useState(false);
     const [selectedPlan, setSelectedPlan] = useState<any>(null);

     const { initPaymentSheet, presentPaymentSheet } = useStripe();

     const plans = [
          {
               name: 'Bronze',
               description: 'Entry-level plan for occasional buyers',
               features: ['30 swipes per month', 'Unlock 5 Match Packs', 'Access to limited property info'],
               price: '9.99',
               period: 'MONTH',
          },
          {
               name: 'Silver',
               description: 'Most popular plan for regular buyers',
               features: ['100 swipes per month', 'Unlock 20 Match Packs', 'Access to more detailed property info'],
               price: '19.99',
               period: 'MONTH',
          },
          {
               name: 'Diamond',
               description: 'For power users and serious buyers',
               features: ['Unlimited swipes', 'Unlock unlimited Match Packs', 'Full access to property info', 'Priority badges/features'],
               price: '49.99',
               period: 'MONTH',
          },
     ];

     const { handleCreateIntendAPI } = useCreateIntendHandler();
     const handleSelectPlan = async (plan: any) => {
          console.log(plan);
          setSelectedPlan(plan);
          await initializePaymentSheet(plan);
     };

     const openPaymentSheet = async () => {
          const { error } = await presentPaymentSheet();

          if (error) {
               console.error('Payment failed:', error);
               return;
          }

          dispatch(
               authUser({
                    data: {
                         email,
                         password,
                         name,
                         city,
                         confirmPassword,
                         phone,
                         selectedIncome,
                         role: acountType,
                         craditScore,
                    },
               }),
          );
     };

     const initializePaymentSheet = async (plan: any) => {
          try {
               setIsLoading(true);
               const paymentRes = await handleCreateIntendAPI(Number(plan.price));

               if (!paymentRes?.paymentIntend) return;

               const { error } = await initPaymentSheet({
                    merchantDisplayName: 'ABC, Inc.',
                    paymentIntentClientSecret: paymentRes.paymentIntend,
                    allowsDelayedPaymentMethods: true,
               });

               if (error) {
                    setIsLoading(false);
                    console.error('Init Sheet Error:', error);
                    return;
               } else {
                    setIsLoading(false);
               }
               openPaymentSheet();
          } catch (err) {
               console.error(err);
          }
     };

     return (
          <>
               <Spinner visible={isLoading} color={colors.textBlue} />
               <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                         <Text style={styles.headerTitle}>SELECT PLAN</Text>
                         <Text style={styles.headerSubtitle}>Pick the option that gives you the comfort you deserve</Text>
                    </View>

                    {/* Plans */}
                    {plans.map((plan, index) => (
                         <View key={index} style={styles.planCard}>
                              <Text style={styles.planName}>{plan.name}</Text>
                              <Text style={styles.planDescription}>{plan.description}</Text>

                              {/* Features */}
                              <View style={styles.featuresContainer}>
                                   {plan.features.map((feature, idx) => (
                                        <View key={idx} style={styles.featureItem}>
                                             <Text style={styles.featureTitle}>{feature}</Text>
                                        </View>
                                   ))}
                              </View>

                              {/* Price and Button */}
                              <View style={styles.priceRow}>
                                   <Text style={styles.price}>
                                        {plan.price}
                                        <Text style={styles.period}>/ {plan.period}</Text>
                                   </Text>
                                   <TouchableOpacity style={styles.getPlanButton} onPress={() => handleSelectPlan(plan)}>
                                        <Text style={styles.getPlanButtonText}>GET PLAN</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                    ))}

                    <View style={styles.bottomSpacing} />
               </ScrollView>
          </>
     );
};

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#FFFFFF',
     },
     scrollView: {
          flex: 1,
     },
     logoSection: {
          alignItems: 'center',
          paddingTop: 40,
          paddingBottom: 20,
     },
     logoContainer: {
          width: 100,
          height: 100,
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 5,
          borderWidth: 1,
          borderColor: '#F0F0F0',
     },
     logoEmoji: {
          fontSize: 42,
     },
     brandName: {
          fontSize: 32,
          fontWeight: 'bold',
          color: '#00A8E8',
          marginBottom: 4,
     },
     tagline: {
          fontSize: 11,
          color: '#666',
          letterSpacing: 1.2,
          fontStyle: 'italic',
     },
     header: {
          paddingHorizontal: 20,
          paddingTop: 30,
          paddingBottom: 10,
     },
     headerTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#0EA5E9',
          textAlign: 'center',
          marginBottom: 8,
          letterSpacing: 0.5,
     },
     headerSubtitle: {
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          lineHeight: 20,
          paddingHorizontal: 10,
     },
     planCard: {
          backgroundColor: '#FFF',
          borderRadius: 16,
          padding: 20,
          marginHorizontal: 20,
          marginTop: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#F5F5F5',
     },
     planName: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#0EA5E9',
          marginBottom: 8,
          letterSpacing: 0.5,
     },
     planDescription: {
          fontSize: 13,
          color: '#666',
          marginBottom: 16,
          lineHeight: 18,
     },
     featuresContainer: {
          marginBottom: 20,
     },
     featureItem: {
          backgroundColor: '#F0EFFF',
          borderRadius: 12,
          padding: 14,
          marginBottom: 8,
     },
     featureTitle: {
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
          marginBottom: 4,
     },
     featureDesc: {
          fontSize: 12,
          color: '#666',
          lineHeight: 16,
     },
     priceRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
     },
     price: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#0EA5E9',
     },
     period: {
          fontSize: 14,
          fontWeight: 'normal',
     },
     getPlanButton: {
          backgroundColor: '#0EA5E9',
          borderRadius: 20,
          paddingHorizontal: 28,
          paddingVertical: 12,
          shadowColor: '#0EA5E9',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
     },
     getPlanButtonText: {
          color: '#FFF',
          fontSize: 14,
          fontWeight: 'bold',
          letterSpacing: 0.5,
     },
     bottomSpacing: {
          height: 30,
     },
});

export default SelectPlan;
