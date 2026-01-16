/** @type {import('tailwindcss').Config} */
module.exports = {
     content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],

     presets: [require('nativewind/preset')],
     theme: {
          extend: {
               colors: {
                    primary: '#476BE6',
                    secondary: '#F3F3F3',
                    'text-muted': '#555555',
                    'dark-heading': '#4B4B4B',
                    'text-blue': '#5347E6',
               },
               fontFamily: {
                    figtree400: ['Figtree-Medium'],
                    figtree500: ['Figtree-SemiBold'],
               },
          },
     },
     plugins: [],
};
