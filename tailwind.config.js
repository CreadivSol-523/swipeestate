/** @type {import('tailwindcss').Config} */
module.exports = {
     content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
     presets: [require('nativewind/preset')],
     theme: {
          extend: {
               colors: {
                    primary: '#38B6FF',
                    secondary: '#FFFDFE',
               },
               fontFamily: {
                    figtree400: ['Figtree-Medium'],
                    figtree500: ['Figtree-SemiBold'],
               },
          },
     },
     plugins: [],
};
