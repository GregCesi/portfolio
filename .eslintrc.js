module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended", // Recommandé pour Vue 3
    'plugin:prettier/recommended', // Active Prettier comme une règle ESLint
  ],
  plugins: ["prettier"],
  rules: {
    'prettier/prettier': ["error", { singleQuote: true, semi: false }], // Exemple de réglages Prettier
  },
}
