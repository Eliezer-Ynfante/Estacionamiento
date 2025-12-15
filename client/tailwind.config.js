export const theme = {
    extend: {
        fontFamily: {
            'montserrat': ['Montserrat', 'sans-serif'],
            'open-sans': ['Open Sans', 'sans-serif'],
        },
        keyframes: {
            'fade-in': {
                '0%': { opacity: '0', transform: 'translateY(10px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            },
        },
        animation: {
            'fade-in': 'fade-in 0.5s ease-in-out',
        },
    }
};