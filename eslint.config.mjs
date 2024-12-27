// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import prettierPlugin from 'eslint-plugin-prettier';

export default withNuxt({
  rules: {
    'no-unused-vars': 'warn',
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'prettier/prettier': 'error', // Applique les règles de Prettier
  },
  plugins: {
    prettier: prettierPlugin,
  },
})
