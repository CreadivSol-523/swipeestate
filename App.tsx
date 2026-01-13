import './global.css';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import RootNavigation from './src/navigation/RootNavigation';

function App() {
  return (
    // <Provider store={store}>
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <PaperProvider>
            <View>
              <Text>okok</Text>
            </View>
            {/* <RootNavigation /> */}
          </PaperProvider>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
    // </Provider>
  );
}
const styles = StyleSheet.create({});
export default App;
