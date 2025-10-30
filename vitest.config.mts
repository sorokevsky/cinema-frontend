import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    projects: [
      defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/{e2e,unit}/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
