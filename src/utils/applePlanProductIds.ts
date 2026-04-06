/**
 * TEMPORARY — App Store subscription IDs by plan **title** (as shown in your DB / UI).
 * Free plans are not in App Store: keep `amount === 0` and the app skips IAP.
 *
 * Keys are matched case-insensitively to `plan.title` (e.g. "Bronze", "bronze").
 */
export const APPLE_PRODUCT_ID_BY_PLAN_TITLE: Record<string, string> = {
     Bronze: 'com.swipeestate.plan.bronze',
     Silver: 'com.swipeestate.plan.silver',
     Platinum: 'com.swipeestate.plan.platinum',
};

function titleKey(title: string): string {
     return title.trim().toLowerCase();
}

/**
 * Uses `APPLE_PRODUCT_ID_BY_PLAN_TITLE` by `plan.title`, then optional `plan.productId` from API.
 */
export function resolveAppleProductId(plan: { title?: string; productId?: string | null }): string | undefined {
     const raw = plan.title?.trim();
     if (raw) {
          const exact = APPLE_PRODUCT_ID_BY_PLAN_TITLE[raw];
          if (exact) {
               return exact;
          }
          const needle = titleKey(raw);
          for (const [name, productId] of Object.entries(APPLE_PRODUCT_ID_BY_PLAN_TITLE)) {
               if (titleKey(name) === needle) {
                    return productId;
               }
          }
     }

     const fromDb = typeof plan.productId === 'string' ? plan.productId.trim() : '';
     return fromDb.length > 0 ? fromDb : undefined;
}
