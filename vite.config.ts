// vite.config.js
import { resolve } from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import topLevelAwait from "vite-plugin-top-level-await";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    dts({ include: "lib", insertTypesEntry: true, }),
    topLevelAwait({}),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'React Reactive Storage',
      fileName: 'react-reactive-storage',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
