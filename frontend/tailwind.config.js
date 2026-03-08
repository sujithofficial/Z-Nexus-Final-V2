/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neonPurple: "#bc13fe",
                electricBlue: "#00d4ff",
                hotPink: "#ff0080",
                limeGreen: "#32cd32",
                orangeSplash: "#ff4500",
                urbanDark: "#0a0a0a",
                concreteGray: "#1a1a1a",
            },
            fontFamily: {
                graffiti: ["'Permanent Marker'", "cursive"],
                sans: ["'Inter'", "sans-serif"],
            },
            boxShadow: {
                'neon-purple': '0 0 10px #bc13fe, 0 0 20px #bc13fe',
                'neon-blue': '0 0 10px #00d4ff, 0 0 20px #00d4ff',
            }
        },
    },
    plugins: [],
}
