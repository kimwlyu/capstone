/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                display: ['Pretendard Variable', 'Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
                body: ['Pretendard Variable', 'Inter', 'Noto Sans KR', 'system-ui', 'sans-serif']
            },
            colors: {
                brand: {50:'#eef6ff',100:'#dceaff',200:'#bdd8ff',300:'#90bbff',400:'#5f9dff',500:'#337dff',600:'#1f61e6',700:'#1a4db8',800:'#133b8a',900:'#0f2f6b'}
            },
            boxShadow: {
                soft: '0 10px 30px rgba(2,6,23,.06), 0 2px 8px rgba(2,6,23,.05)',
                card: '0 28px 64px -24px rgba(2,6,23,.25)'
            },
            borderRadius: { xl2: '1.25rem' }
        }
    },
    plugins: []
}
