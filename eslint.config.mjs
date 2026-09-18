// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  { ignores: ['.history'] },
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
    },
  },
)
