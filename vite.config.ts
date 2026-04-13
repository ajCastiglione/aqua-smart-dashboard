import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub project Pages uses /<repo>/; local dev uses /. Set VITE_BASE_PATH in CI (see deploy workflow).
const basePath = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base: basePath.endsWith('/') ? basePath : `${basePath}/`,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
})
