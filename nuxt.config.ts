export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	modules: ["@pinia/nuxt"], // Removed @nuxtjs/apollo

	runtimeConfig: {
		public: {
			graphqlEndpoint: "http://localhost:1337/graphql",
		},
	},
});
