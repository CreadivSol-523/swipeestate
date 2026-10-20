import { Easing, Text, View } from 'react-native';
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
          const error = (res?.error as any) || null;
          const status = error?.status;
          const details = error?.data?.details;
          const message = error?.data?.message;

          const wrap = (content: React.ReactNode) => (
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
                         {content}
                    </View>
               </View>
          );

          if (status === 'FETCH_ERROR' || status === 'TIMEOUT_ERROR') {
               return wrap(
                    <Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>
                         {status === 'TIMEOUT_ERROR' ? 'Request timed out. Please try again.' : 'Something wrong from server please try again after sometime'}
                    </Text>,
               );
          }

          if (details?.length) {
               return details.map((detail: string, index: number) => (
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
               ));
          }

          if (message) {
               return wrap(<Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{message}</Text>);
          }

          if (error?.error) {
               return wrap(<Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{error.error}</Text>);
          }

          return wrap(<Text style={{ fontSize: 18, fontWeight: '700', color: textColor }}>{title || 'Something went wrong'}</Text>);
     };
     return Notifier.showNotification({
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.linear,
          hideOnPress: false,
          Component: toastComp,
     });
};
export default ResToast;
