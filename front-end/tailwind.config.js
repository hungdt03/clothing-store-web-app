/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#fb923c'
                // primary: '#db2666'
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
}