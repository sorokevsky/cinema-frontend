import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@nuxt/test-utils', '@nuxt/eslint'],
  imports: {
    dirs: ['types'],
  },
  devtools: { enabled: true, viteInspect: false },
  css: ['@/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      BASE_URL: import.meta.env.BASE_URL,
    },
  },
  routeRules: {
    '/': { redirect: '/movies' },
  },
  compatibilityDate: '2025-07-15',
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
  typescript: {
    typeCheck: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
