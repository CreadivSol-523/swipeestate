import './global.css';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigation from './src/navigation/RootNavigation';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { StripeProvider } from '@stripe/stripe-react-native';
import Config from 'react-native-config';
import { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import ErrorBoundary from './src/components/ErrorBoundary/ErrorBoundary';

function App() {
     useEffect(() => {
          // Hide splash screen when app is ready
          BootSplash.hide({ fade: true });
     }, []);

     return (
          <Provider store={store}>
               <SafeAreaProvider>
                    <GestureHandlerRootView>
                         <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                              <StripeProvider publishableKey={Config.STRIPE_PUBLISHABLE_KEY || ''}>
                                   <PaperProvider>
                                        <ErrorBoundary>
                                             <RootNavigation />
                                        </ErrorBoundary>
                                   </PaperProvider>
                              </StripeProvider>
                         </SafeAreaView>
                    </GestureHandlerRootView>
               </SafeAreaProvider>
          </Provider>
     );
}
const styles = StyleSheet.create({});
export default App;
