import { NativeModules, Platform } from 'react-native';
import {
     finishTransaction,
     getReceiptIOS,
     getSubscriptions,
     initConnection,
     requestSubscription,
     type SubscriptionPurchase,
} from 'react-native-iap';

const IAP_NOT_AVAILABLE = 'E_IAP_NOT_AVAILABLE';

function invalidProductHelp(requestedSku: string): string {
     return (
          `StoreKit does not know subscription "${requestedSku}" for this app build. ` +
          `Checklist: (1) Product ID must match App Store Connect exactly (case-sensitive). ` +
          `(2) Subscriptions must belong to the same bundle ID as this app (see Xcode → General); it must match the app in App Store Connect that contains these subscriptions. ` +
          `(3) In App Store Connect: Agreements / Paid Apps must be active; subscription must be in Ready to Submit or approved. ` +
          `(4) Simulator: add a StoreKit Configuration file to the run scheme, or test on a device with a Sandbox Apple ID. ` +
          `(5) New products can take up to a few hours to appear.`
     );
}

export function explainIapError(err: unknown, context?: { requestedSku?: string }): string {
     const raw = err instanceof Error ? err.message : String(err);
     const lower = raw.toLowerCase();
     if (
          lower.includes('invalid product') ||
          raw.includes('E_DEVELOPER_ERROR') ||
          lower.includes('developer_error')
     ) {
          return context?.requestedSku ? invalidProductHelp(context.requestedSku) : invalidProductHelp('(unknown)');
     }
     if (raw === IAP_NOT_AVAILABLE || raw.includes(IAP_NOT_AVAILABLE)) {
          const { RNIapIos, RNIapIosSk2 } = NativeModules as {
               RNIapIos?: unknown;
               RNIapIosSk2?: { isAvailable?: () => number };
          };
          const sk2Ok = Platform.OS === 'ios' && RNIapIosSk2?.isAvailable?.() === 1;
          if (Platform.OS === 'ios' && !RNIapIos && !sk2Ok) {
               return 'In-App Purchase native code is missing from this app build. Stop Metro, run: cd ios && pod install && cd .. && npx react-native run-ios (do not rely on Fast Refresh). In Xcode: Signing & Capabilities → add In-App Purchase.';
          }
          if (Platform.OS === 'android') {
               return 'Google Play Billing native module is missing. Rebuild the Android app: npx react-native run-android after installing react-native-iap.';
          }
          return 'In-app purchases are not available on this device or build.';
     }
     return raw;
}

let connectionOpen = false;

async function ensureConnection(): Promise<void> {
     if (Platform.OS !== 'ios') {
          throw new Error('In-app subscriptions are only available on iOS in this app.');
     }
     if (!connectionOpen) {
          await initConnection();
          connectionOpen = true;
     }
}

function normalizeSubscriptionPurchase(
     result: SubscriptionPurchase | SubscriptionPurchase[] | null | void,
): SubscriptionPurchase | undefined {
     if (!result) {
          return undefined;
     }
     return Array.isArray(result) ? result[0] : result;
}

/**
 * Runs the StoreKit subscription sheet for `productId`, then returns the App Receipt (base64)
 * for your backend Apple verifyReceipt call.
 */
export async function purchaseIosSubscription(productId: string): Promise<{ receipt: string; purchase?: SubscriptionPurchase }> {
     try {
          await ensureConnection();
          const subs = await getSubscriptions({ skus: [productId] });

          if (!subs?.length) {
               throw new Error(invalidProductHelp(productId));
          }
          const known = subs.some(s => s.productId === productId);
          if (!known) {
               throw new Error(
                    `${invalidProductHelp(productId)} Loaded SKUs: ${subs.map(s => s.productId).join(', ') || '(none)'}.`,
               );
          }

          const raw = await requestSubscription({ sku: productId });
          const purchase = normalizeSubscriptionPurchase(raw);

          let receipt = await getReceiptIOS({ forceRefresh: false });
          if (!receipt) {
               receipt = await getReceiptIOS({ forceRefresh: true });
          }
          if (!receipt) {
               throw new Error('Could not read the App Store receipt. Try again or sign in with your sandbox Apple ID.');
          }

          if (purchase) {
               await finishTransaction({ purchase, isConsumable: false });
          }

          return { receipt, purchase };
     } catch (e) {
          throw new Error(explainIapError(e, { requestedSku: productId }));
     }
}
