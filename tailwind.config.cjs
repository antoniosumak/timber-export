/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: "#644836",
				primaryhover: "#432e24",
				secondary: "#192e40",
				secondaryhover: "#0f1c27",
				dark :"#365964",
				darker : "#263e46",
				"text-dark": "#b2cccc",
				"text-darker" : "rgba(212,212,216)",
				"text-light" : "rgba(119, 119, 119, 1)"
			}
		},
	},
	plugins: [],
}
