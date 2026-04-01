/* Tailwind Configuration with Alpha Channel Support 
*/
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                /* Using the / <alpha-value> syntax to support opacity classes like bg-primary/50 */
                primary: "rgb(var(--color-primary) / <alpha-value>)",
                "primary-variant": "rgb(var(--color-primary-variant) / <alpha-value>)",
                surface: "rgb(var(--color-surface) / <alpha-value>)",
                "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
                "on-surface-variant": "rgb(var(--color-on-surface-variant) / <alpha-value>)",
                "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
            },
            boxShadow: {
                'primary-glow': "var(--shadow-primary-glow)",
            },
            fontFamily: {
                headline: ["Heebo", "sans-serif"],
                body: ["Assistant", "sans-serif"],
            },
            backgroundImage: {
                'hero-grad': "var(--gradient-hero)",
            },
            borderRadius: { 
                "DEFAULT": "0.125rem", 
                "lg": "0.25rem", 
                "xl": "0.5rem", 
                "full": "0.75rem" 
            },
        },
    },
}