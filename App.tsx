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
                              <StripeProvider publishableKey="pk_live_51SUAWx37OtZDzMilzhN2AqFFidTz2aCvVAttrYwcMbr1clvx9myDHJ9YftVl39wlMcorcF1yuXo1kdrBJv1mFlSE00oVB3qsfy">
                                   <PaperProvider>
                                        <RootNavigation />
                                        {/* <View>
                                        <Text className="text-[100px]">hello</Text>
                                   </View> */}
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
