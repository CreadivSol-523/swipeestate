// permissions.ts
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { Camera } from 'react-native-vision-camera';

export async function requestCameraPermission(): Promise<boolean> {
     try {
          // Check current status
          const status = await Camera.getCameraPermissionStatus();

          if (status === 'granted') {
               return true;
          }

          // Request permission
          const newStatus = await Camera.requestCameraPermission();

          if (newStatus === 'denied') {
               Alert.alert('Camera Permission Required', 'Please enable camera access from settings to continue.');
               return false;
          }

          return newStatus === 'granted';
     } catch (error) {
          console.warn('Camera permission error:', error);
          return false;
     }
}
