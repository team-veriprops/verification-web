import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class",
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	prefix: "",
	theme: {
		screens: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1280px", // cap container here
		},
		container: {
			center: true,
            padding: "1.5rem",
		},
		extend: {
            fontFamily: {
                sans: ["DM Sans", "system-ui", "sans-serif"],
                display: ["Outfit", "system-ui", "sans-serif"],
            },
			colors: {
				border: 'var(--color-border)',
				input: 'var(--color-input)',
				ring: 'var(--color-ring)',
				background: 'var(--color-background)',
				foreground: 'var(--color-foreground)',
				primary: {
					DEFAULT: 'var(--color-primary)',
					foreground: 'var(--color-primary-foreground)',
					hover: 'var(--color-primary-hover)'
				},
				secondary: {
					DEFAULT: 'var(--color-secondary)',
					foreground: 'var(--color-secondary-foreground)'
				},
				destructive: {
					DEFAULT: 'var(--color-destructive)',
					foreground: 'var(--color-destructive-foreground)'
				},
				muted: {
					DEFAULT: 'var(--color-muted)',
					foreground: 'var(--color-muted-foreground)'
				},
				accent: {
					DEFAULT: 'var(--color-accent)',
					foreground: 'var(--color-accent-foreground)',
					strong: 'var(--color-accent-strong)'
				},
				popover: {
					DEFAULT: 'var(--color-popover)',
					foreground: 'var(--color-popover-foreground)'
				},
				card: {
					DEFAULT: 'var(--color-card)',
					foreground: 'var(--color-card-foreground)'
				},
                success: {
                DEFAULT: "var(--color-success)",
                foreground: "var(--color-success-foreground)",
                },
                warning: {
                DEFAULT: "var(--color-warning)",
                foreground: "var(--color-warning-foreground)",
                },
                danger: {
                DEFAULT: "var(--color-danger)",
                foreground: "var(--color-danger-foreground)",
                },
				sidebar: {
					DEFAULT: 'var(--color-sidebar-background)',
					foreground: 'var(--color-sidebar-foreground)',
					primary: 'var(--color-sidebar-primary)',
					'primary-foreground': 'var(--color-sidebar-primary-foreground)',
					accent: 'var(--color-sidebar-accent)',
					'accent-foreground': 'var(--color-sidebar-accent-foreground)',
					border: 'var(--color-sidebar-border)',
					ring: 'var(--color-sidebar-ring)'
				}
			},
			borderRadius: {
				lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl: "calc(var(--radius) + 4px)",
                "2xl": "calc(var(--radius) + 8px)",
			},
			keyframes: {
				"accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" },
                },
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
			}
		},
	plugins: [
        
  ],
};


throw new Error("TAILWIND CONFIG LOADED");

export default config
