import { defineConfig } from '@sunshj/eslint-config'

export default defineConfig(
  [
    {
      rules: {
        'vue/component-name-in-template-casing': [
          'error',
          'PascalCase',
          { registeredComponentsOnly: false }
        ],
        'unicorn/no-new-array': 'off'
      }
    },
    {
      ignores: ['playground/src/components/*.gen.vue']
    }
  ],
  {
    vue: true
  }
)
