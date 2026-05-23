/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],

    theme: {
        extend: {
            colors: {
                purpleGlow: '#7c3aed',
                blueGlow: '#2563eb',
                cyanGlow: '#06b6d4',
                pinkGlow: '#ec4899',
                orangeGlow: '#f97316',
                greenGlow: '#22c55e',
            },

            boxShadow: {
                neon: '0 0 20px rgba(124,58,237,0.45), 0 0 50px rgba(37,99,235,0.25)',
            },
        },
    },

    plugins: [],
};