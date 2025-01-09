import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  target: 'es2020',
  dts: true,
  clean: true,
  treeshake: true,
  external: ['vue', 'vue-router']
})
