/**
 * Vitest Configuration
 * 
 * Test configuration for MADMall monorepo
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      '**/__tests__/**/*.{test,spec}.{ts,tsx}',
      '**/packages/**/__tests__/**/*.{test,spec}.{ts,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'packages/*/src/**/*.{ts,tsx}',
        'packages/*/components/**/*.{ts,tsx}',
        'packages/*/*.{ts,tsx}'
      ],
      exclude: [
        '**/__tests__/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.config.{ts,js}',
        '**/*.d.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@madmall/safety-layer': path.resolve(__dirname, './packages/safety-layer'),
      '@madmall/content-filter': path.resolve(__dirname, './packages/content-filter'),
      '@madmall/database': path.resolve(__dirname, './packages/database')
    }
  }
})

// Made with Bob
