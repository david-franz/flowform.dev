import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@flowtomic/flowform': path.resolve(__dirname, '../../src'),
      '@flowtomic/flowform-react': path.resolve(__dirname, '../react/src'),
    },
  },
  server: {
    port: 5181,
  },
});