import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        card: "var(--bg-elevated)",
        "card-foreground": "var(--text-primary)",
        primary: "var(--accent-primary)",
        secondary: "var(--bg-secondary)",
        accent: "var(--accent-primary)",
        "accent-glow": "var(--accent-glow)",
        border: "var(--border-subtle)",
        danger: "var(--danger)",
        success: "var(--success)",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        "glow-primary": "var(--glow-primary)",
        "glow-accent": "var(--glow-accent)",
      },
    },
  },
};

export default config;
