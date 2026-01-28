import { Easing, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Notifier } from 'react-native-notifier';
import colors from '../../assests/Colors/Colors';
import { windowWidth } from '../../utils/Dimension/Dimension';
interface ResToastProps {
     title?: string;
     res?: any;
     type?: 'warning' | 'success' | 'danger' | '';
}
const ResToast = ({ title, type, res }: ResToastProps) => {
     const toastComp = () => {
          const textColor = type === 'warning' ? '#F0AD4E' : type === 'danger' ? '#D9534F' : colors.PrimaryColor;
          return res ? (
               (res?.error as any)?.data?.details ? (
                    (res?.error as any)?.data?.details.map((detail: string, index: number) => (
                         <View key={index} style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <View
                                   style={{
                                        padding: 20,
                                        backgroundColor: 'white',
                                        marginTop: 20,
                                        width: windowWidth - 20,
                                        borderRadius: 10,
                                        elevation: 5,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                   }}
                              >
                                   <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{detail}</Text>
                              </View>
                         </View>
                    ))
               ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                         <View
                              style={{
                                   padding: 20,
                                   backgroundColor: 'white',
                                   marginTop: 20,
                                   width: windowWidth - 20,
                                   borderRadius: 10,
                                   elevation: 5,
                                   shadowColor: '#000',
                                   shadowOffset: { width: 0, height: 2 },
                                   shadowOpacity: 0.25,
                                   shadowRadius: 3.84,
                              }}
                         >
                              <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>
                                   {(res?.error as any)?.data?.message ? (res?.error as any)?.data?.message : 'Something went wrong'}
                              </Text>
                         </View>
                    </View>
               )
          ) : !(res?.error as any)?.data?.details && res?.error ? (
               <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View
                         style={{
                              padding: 20,
                              backgroundColor: 'white',
                              marginTop: 20,
                              width: windowWidth - 20,
                              borderRadius: 10,
                              elevation: 5,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                         }}
                    >
                         <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{res?.error?.error}</Text>
                    </View>
               </View>
          ) : (
               <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View
                         style={{
                              padding: 20,
                              backgroundColor: 'white',
                              marginTop: 20,
                              width: windowWidth - 20,
                              borderRadius: 10,
                              elevation: 5,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.25,
                              shadowRadius: 3.84,
                         }}
                    >
                         <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{title}</Text>
                    </View>
               </View>
          );
     };
     return Notifier.showNotification({
          duration: 2000,
          showAnimationDuration: 800,
          showEasing: Easing.linear,
          hideOnPress: false,
          Component: toastComp,
     });
};
export default ResToast;
const styles = StyleSheet.create({});
