tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                "primary-variant": "var(--color-primary-variant)",
                surface: "var(--color-surface)",
                "on-surface": "var(--color-on-surface)",
                "on-surface-variant": "var(--color-on-surface-variant)",
                "surface-container": "var(--color-surface-container)",
            },
            fontFamily: {
                headline: ["Heebo", "sans-serif"],
                body: ["Assistant", "sans-serif"],
            },
            backgroundImage: {
                'hero-grad': "var(--gradient-hero)",
            },
            borderRadius: { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" },
        },
    },
}