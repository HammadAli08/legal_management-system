/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                royal: '#1E3A5F',      // Regal Navy Blue
                gold: '#D4AF37',       // Gold Accent
                cream: '#F5F0E6',      // Cream Background
                burgundy: '#8B2635',   // Burgundy Secondary
                slate: '#4A5568',      // Slate Gray
                forest: '#2D5A27',     // Forest Green
                'bg-burgundy': '#F8E9EC', // Light Burgundy
                'bg-forest': '#E8F5E9',   // Light Green
                'bg-blue': '#E3F2FD',     // Light Blue
            },
        },
    },
    plugins: [],
}
