tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "background": "#fdfbf7",
                "primary": "#b34000",
                "on-primary": "#ffffff",
                "surface": "#ffffff",
                "on-surface": "#2d2a26",
                "on-surface-variant": "#6b625b",
                "surface-variant": "#efebe7",
                "outline": "#d6d0cb",
                "divider": "#e6e2de",
                "badge-green-bg": "#f0fdf4",
                "badge-green-text": "#166534",
                "badge-gray-bg": "#f3f4f6",
                "badge-gray-text": "#374151"
            },
            fontFamily: {
                "sans": ["Plus Jakarta Sans", "sans-serif"],
                "serif": ["Noto Serif", "serif"]
            },
            boxShadow: {
                "card": "0 2px 10px rgba(0,0,0,0.03)",
                "btn": "0 2px 6px rgba(179,64,0,0.2)"
            }
        }
    }
}
