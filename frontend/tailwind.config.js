/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3525cd",
        "primary-container": "#4f46e5",
        secondary: "#00687a",
        "secondary-container": "#57dffe",
        tertiary: "#684000",
        "tertiary-container": "#885500",
        background: "#f7f9fb",
        surface: "#f7f9fb",
        "surface-container": "#eceef0",
        "surface-container-low": "#f2f4f6",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-surface": "#191c1e",
        "on-surface-variant": "#464555",
        outline: "#777587",
        "outline-variant": "#c7c4d8",
        success: "#10B981",
        gold: "#FCD34D",
        silver: "#94A3B8",
        bronze: "#D97706",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "wizard-width": "640px",
        gutter: "24px",
        unit: "8px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
}
