import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { getAvailablePurchases, useIAP } from 'react-native-iap';

import Spinner from '../../components/Loader/Spinner';
import colors from '../../assests/Colors/Colors';
import { useBuyPlanHandler, useGetPlanHandler, useVerifyApplePurchaseHandler } from '../../models/Plan/Plan';
import { Plans } from '../../redux/Plan/PlanTypes';
import ResToast from '../../components/ResToast/ResToast';

// Backend verification endpoint (/api/subscriptions/apple/verify) aur hook ready hain.
// Agar kabhi backend down ho to isay false kar do, warna Apple payment ho jayegi lekin subscription activate nahi hogi.
const APPLE_VERIFICATION_READY = true;

// Apple ke liye zaroori: subscription screen par Privacy Policy aur Terms of Use ke links
const PRIVACY_POLICY_URL = 'https://swipestate-adminpanel.vercel.app/privacy-policy';
const TERMS_OF_USE_URL = 'https://swipestate-adminpanel.vercel.app/terms-of-use';

const APPLE_PRODUCT_IDS = ['com.swipeestate.user.bronze', 'com.swipeestate.user.silver', 'com.swipeestate.user.platinum'];

const SelectIAPPlanScreen = ({ route }: { route?: any }) => {
     const { user } = route?.params || {};
     const [isLoading, setIsLoading] = useState(false);

     // Fetch user plans from the backend
     const { PlanData, PlanLoading, isFetching } = useGetPlanHandler({
          interval: 'month',
          type: 'user',
     });

     const plans: Plans[] = PlanData?.plans || [];

     // Existing backend API, used here for the free plan only
     const { handleBuyPlanAPI, isLoading: BuyPlanLoading } = useBuyPlanHandler();

     // Backend se Apple transaction verify karne wala handler
     const { verifyApplePurchase, isLoading: VerifyLoading } = useVerifyApplePurchaseHandler();

     // IAP callbacks purani values capture kar lete hain, is liye refs use kiye hain
     const plansRef = useRef<Plans[]>([]);
     plansRef.current = plans;

     const verifyRef = useRef(verifyApplePurchase);
     verifyRef.current = verifyApplePurchase;

     const userRef = useRef(user);
     userRef.current = user;

     // Same purchase ko do baar verify hone se rokta hai
     const handlingRef = useRef(false);

     const {
          connected,
          subscriptions: appleSubscriptions,
          fetchProducts,
          requestPurchase,
          restorePurchases,
          finishTransaction,
     } = useIAP({
          onPurchaseSuccess: async purchase => {
               if (handlingRef.current) {
                    return;
               }
               handlingRef.current = true;

               try {
                    setIsLoading(true);

                    const plan = plansRef.current.find(p => (p as any).appleProductId === purchase.productId);

                    const transactionId = String((purchase as any).transactionId ?? (purchase as any).id ?? '');

                    if (!plan || !transactionId) {
                         ResToast({
                              title: 'Purchase match nahi hui. Support se rabta karein.',
                              type: 'danger',
                         });
                         return;
                    }

                    const verified = await verifyRef.current({
                         planId: (plan as any)._id,
                         transactionId,
                         user: userRef.current,
                    });

                    // Transaction sirf verification ke baad finish hoti hai.
                    // Agar verify fail ho, to Apple isay dobara deliver karta hai.
                    if (verified) {
                         await finishTransaction({ purchase, isConsumable: false });
                    }
               } catch (error: any) {
                    console.error('Apple purchase handling failed:', error);
                    ResToast({
                         title: error?.message || 'Purchase verify nahi ho saki',
                         type: 'danger',
                    });
               } finally {
                    handlingRef.current = false;
                    setIsLoading(false);
               }
          },

          onPurchaseError: error => {
               setIsLoading(false);

               if (error.code !== 'user-cancelled') {
                    ResToast({
                         title: error.message || 'Apple purchase failed',
                         type: 'danger',
                    });
               }
          },

          onError: error => {
               console.error('Apple IAP error:', error.message);
               setIsLoading(false);
          },
     });

     // Load Apple subscription products
     useEffect(() => {
          if (connected) {
               fetchProducts({
                    skus: APPLE_PRODUCT_IDS,
                    type: 'subs',
               }).catch(error => {
                    console.error('Failed to fetch Apple subscriptions:', error);
               });
          }
     }, [connected, fetchProducts]);

     // Match each backend plan with its App Store product
     const getAppleProduct = (plan: Plans) => {
          return appleSubscriptions.find(product => product.id === (plan as any).appleProductId);
     };

     // Preserve the existing free-plan flow
     const handleFreePlan = async (plan: Plans) => {
          try {
               setIsLoading(true);

               await handleBuyPlanAPI({
                    RequestBuyPlan: {
                         email: user?.user?.email,
                         planId: (plan as any)._id,
                         token: '',
                         userId: user?.user?._id,
                         priceId: (plan as any).priceId,
                    },
                    user,
                    amount: plan.amount,
               });
          } catch (error) {
               console.error('Free plan activation failed:', error);
          } finally {
               setIsLoading(false);
          }
     };

     // Start Apple IAP for paid user plans
     const handleApplePurchase = async (plan: Plans) => {
          const product = getAppleProduct(plan);
          const productId = (plan as any).appleProductId;

          if (!connected) {
               return ResToast({
                    title: 'Apple Store is not connected',
                    type: 'danger',
               });
          }

          if (!productId || !product) {
               return ResToast({
                    title: 'Apple subscription product is unavailable',
                    type: 'danger',
               });
          }

          if (!APPLE_VERIFICATION_READY) {
               return ResToast({
                    title: 'Apple purchase verification is not configured yet',
                    type: 'danger',
               });
          }

          try {
               setIsLoading(true);

               await requestPurchase({
                    request: {
                         apple: {
                              sku: productId,
                         },
                    },
                    type: 'subs',
               });
          } catch (error: any) {
               setIsLoading(false);

               ResToast({
                    title: error?.message || 'Unable to start Apple purchase',
                    type: 'danger',
               });
          }
     };

     const openLink = (url: string) => {
          Linking.openURL(url).catch(() => {
               ResToast({
                    title: 'Unable to open the link',
                    type: 'danger',
               });
          });
     };

     // Restore Purchases (Apple ke liye zaroori): pehle se kharidi hui active subscription wapas hasil karo
     const handleRestorePurchases = async () => {
          if (!connected) {
               return ResToast({
                    title: 'Apple Store is not connected',
                    type: 'danger',
               });
          }

          if (handlingRef.current) {
               return;
          }
          handlingRef.current = true;

          try {
               setIsLoading(true);

               // App Store se sync karo, phir active purchases mangwao
               await restorePurchases();
               const purchases = await getAvailablePurchases();

               // Sirf hamare subscription products, sab se nayi purchase pehle
               const candidates = (purchases || []).filter(p => APPLE_PRODUCT_IDS.includes(p.productId)).sort((a, b) => ((b as any).transactionDate ?? 0) - ((a as any).transactionDate ?? 0));

               const purchase = candidates[0];

               if (!purchase) {
                    ResToast({
                         title: 'No active subscription found to restore',
                         type: 'warning',
                    });
                    return;
               }

               const plan = plansRef.current.find(p => (p as any).appleProductId === purchase.productId);
               const transactionId = String((purchase as any).transactionId ?? (purchase as any).id ?? '');

               if (!plan || !transactionId) {
                    ResToast({
                         title: 'Restored purchase does not match any plan',
                         type: 'danger',
                    });
                    return;
               }

               // Restore bhi backend se verify hoti hai, frontend par bharosa nahi
               const verified = await verifyRef.current({
                    planId: (plan as any)._id,
                    transactionId,
                    user: userRef.current,
               });

               if (verified) {
                    try {
                         await finishTransaction({ purchase, isConsumable: false });
                    } catch (error) {
                         console.warn('finishTransaction after restore failed:', error);
                    }
               }
          } catch (error: any) {
               console.error('Restore purchases failed:', error);
               ResToast({
                    title: error?.message || 'Unable to restore purchases',
                    type: 'danger',
               });
          } finally {
               handlingRef.current = false;
               setIsLoading(false);
          }
     };

     return (
          <>
               <Spinner visible={isLoading || BuyPlanLoading || VerifyLoading || PlanLoading || isFetching} color={colors.textBlue} />

               <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                         <Text style={styles.headerTitle}>SELECT PLAN</Text>
                         <Text style={styles.headerSubtitle}>Choose the subscription that suits your needs.</Text>
                    </View>

                    {plans.map((plan, index) => {
                         const appleProduct = plan.amount > 0 ? getAppleProduct(plan) : null;

                         const paidDisabled = plan.amount > 0 && (!connected || !appleProduct || !APPLE_VERIFICATION_READY);

                         return (
                              <View key={(plan as any)._id || index} style={styles.planCard}>
                                   <Text style={styles.planName}>{plan.title}</Text>

                                   <Text style={styles.planDescription}>{plan.description}</Text>

                                   <View style={styles.featuresContainer}>
                                        {(plan.planPoints || []).map((feature, idx) => (
                                             <View key={idx} style={styles.featureItem}>
                                                  <Text style={styles.featureTitle}>{String(feature)}</Text>
                                             </View>
                                        ))}
                                   </View>

                                   <View style={styles.priceRow}>
                                        <Text style={styles.price}>
                                             {plan.amount === 0 ? 'Free' : appleProduct?.displayPrice || 'Price unavailable'}
                                             {plan.amount > 0 && <Text style={styles.period}> / month</Text>}
                                        </Text>

                                        <TouchableOpacity
                                             style={[styles.getPlanButton, paidDisabled && styles.disabledButton]}
                                             disabled={isLoading || paidDisabled}
                                             onPress={() => {
                                                  if (plan.amount === 0) {
                                                       handleFreePlan(plan);
                                                  } else {
                                                       handleApplePurchase(plan);
                                                  }
                                             }}
                                        >
                                             <Text style={styles.getPlanButtonText}>{plan.amount === 0 ? 'GET PLAN' : !connected ? 'CONNECTING' : !appleProduct ? 'LOADING' : 'SUBSCRIBE'}</Text>
                                        </TouchableOpacity>
                                   </View>
                              </View>
                         );
                    })}

                    {connected && appleSubscriptions.length === 0 && (
                         <Text style={styles.infoText}>Apple subscription products are not available yet. Check the App Store Connect configuration and test on a supported iOS environment.</Text>
                    )}

                    <TouchableOpacity style={styles.restoreButton} disabled={isLoading || !connected} onPress={handleRestorePurchases}>
                         <Text style={[styles.restoreButtonText, (isLoading || !connected) && styles.restoreButtonTextDisabled]}>Restore Purchases</Text>
                    </TouchableOpacity>

                    <Text style={styles.legalText}>
                         Payment will be charged to your Apple ID account at confirmation of purchase. Subscriptions renew automatically every month unless cancelled at least 24 hours before the end
                         of the current period. Your account will be charged for renewal within 24 hours before the end of the current period. You can manage or cancel your subscription anytime in
                         your Apple ID Account Settings after purchase.
                    </Text>

                    <View style={styles.legalLinksRow}>
                         <TouchableOpacity onPress={() => openLink(PRIVACY_POLICY_URL)}>
                              <Text style={styles.legalLink}>Privacy Policy</Text>
                         </TouchableOpacity>
                         <Text style={styles.legalSeparator}>|</Text>
                         <TouchableOpacity onPress={() => openLink(TERMS_OF_USE_URL)}>
                              <Text style={styles.legalLink}>Terms of Use</Text>
                         </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSpacing} />
               </ScrollView>
          </>
     );
};

const styles = StyleSheet.create({
     scrollView: {
          flex: 1,
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
     },
     headerSubtitle: {
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          lineHeight: 20,
     },
     planCard: {
          backgroundColor: '#FFF',
          borderRadius: 16,
          padding: 20,
          marginHorizontal: 20,
          marginTop: 20,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#F5F5F5',
     },
     planName: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#0EA5E9',
          marginBottom: 8,
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
     },
     priceRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
          gap: 10,
     },
     price: {
          flexShrink: 1,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#0EA5E9',
     },
     period: {
          fontSize: 13,
          fontWeight: 'normal',
          color: '#666',
     },
     getPlanButton: {
          backgroundColor: '#0EA5E9',
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 12,
     },
     disabledButton: {
          backgroundColor: '#9CA3AF',
     },
     getPlanButtonText: {
          color: '#FFF',
          fontSize: 12,
          fontWeight: 'bold',
     },
     infoText: {
          marginHorizontal: 24,
          marginTop: 20,
          color: '#666',
          textAlign: 'center',
     },
     restoreButton: {
          alignSelf: 'center',
          marginTop: 24,
          paddingHorizontal: 20,
          paddingVertical: 10,
     },
     restoreButtonText: {
          color: '#0EA5E9',
          fontSize: 14,
          fontWeight: '600',
          textDecorationLine: 'underline',
     },
     restoreButtonTextDisabled: {
          color: '#9CA3AF',
     },
     legalText: {
          marginHorizontal: 24,
          marginTop: 16,
          color: '#888',
          fontSize: 11,
          lineHeight: 16,
          textAlign: 'center',
     },
     legalLinksRow: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 12,
          gap: 10,
     },
     legalLink: {
          color: '#0EA5E9',
          fontSize: 13,
          fontWeight: '600',
          textDecorationLine: 'underline',
     },
     legalSeparator: {
          color: '#9CA3AF',
          fontSize: 13,
     },
     bottomSpacing: {
          height: 30,
     },
});

export default SelectIAPPlanScreen;
