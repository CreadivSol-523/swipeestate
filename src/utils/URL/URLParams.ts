// utils/url.ts
export function URLParams(base: string, params: Record<string, any>): string {
     const query = Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => {
               if (Array.isArray(value)) {
                    return value.map(v => `${key}=${v}`).join('&');
               }
               return `${key}=${value}`;
          })
          .join('&');

     return query ? `${base}?${query}` : base;
}
