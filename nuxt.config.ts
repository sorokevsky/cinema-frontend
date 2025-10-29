import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true, viteInspect: false, },
  modules: ['@pinia/nuxt', '@nuxt/test-utils', '@nuxt/eslint'],
  typescript: {
    typeCheck: true,
  },
  routeRules: {
    '/': { redirect: '/movies' },
  },
  css: ['@/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      BASE_URL: import.meta.env.BASE_URL,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: import.meta.env.BASE_URL,
          changeOrigin: true,
        },
      },
    },
  },
})