import { defineConfig } from 'vite'

const sandboxExternals = new Set([
  'electron',
  'electron/renderer',
  'events',
  'node:events',
  'node:timers',
  'node:url',
  'timers',
  'url',
])

export default defineConfig({
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    lib: {
      entry: 'src/preload/index.ts',
      fileName: () => 'index.cjs',
      formats: ['cjs'],
    },
    minify: false,
    outDir: 'dist/preload',
    reportCompressedSize: false,
    rolldownOptions: {
      external: (id) => sandboxExternals.has(id),
    },
    sourcemap: true,
    target: 'node22',
  },
})
