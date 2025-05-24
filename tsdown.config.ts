import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: 'esm',
  target: 'es2020',
  platform: 'neutral',
  plugins: [Vue({ isProduction: true })],
  dts: {
    vue: true
  },
  clean: true,
  external: ['vue', 'vue-router']
})
