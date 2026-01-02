/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
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

                // Dark Theme Colors
                dark: {
                    primary: '#121826',    // Deep Navy
                    secondary: '#1E293B',  // Slate Blue
                    accent: '#8B5CF6',     // Vibrant Purple
                    text: '#E2E8F0',       // Soft White
                    border: '#334155',     // Medium Gray
                    success: '#10B981',    // Emerald Green
                    warning: '#F59E0B',    // Amber Gold
                }
            },
            fontFamily: {
                cinzel: ['Cinzel', 'serif'],
                playfair: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
}
