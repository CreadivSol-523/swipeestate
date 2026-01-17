import './global.css';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigation from './src/navigation/RootNavigation';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { StripeProvider } from '@stripe/stripe-react-native';

function App() {
     return (
          <Provider store={store}>
               <SafeAreaProvider>
                    <GestureHandlerRootView>
                         <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                              <StripeProvider publishableKey="pk_test_51SN0PD6LeihmLmRESnfivV5WX3wlrfaM6MSlXnuDjbsHDtCdKzKEfCdyEqLZm58JuvxzTqzWhWsjaaq4uWDGivIf00Rq5iTgf8">
                                   <PaperProvider>
                                        <RootNavigation />
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
