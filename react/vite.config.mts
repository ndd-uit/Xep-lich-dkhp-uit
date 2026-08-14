import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

const publicUrl = process.env.PUBLIC_URL || '/';
const base = publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`;

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
      types: fileURLToPath(new URL('./src/types.ts', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 2500,
    outDir: 'build',
    rolldownOptions: {
      checks: {
        pluginTimings: false,
      },
    },
    sourcemap: false,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
});
