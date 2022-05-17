module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'vue/singleline-html-element-content-newline': 'off',
    'vue/order-in-components': 'off',
    'vue/max-attributes-per-line': 'off',
    // 'vue/no-unused-vars': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/html-self-closing': 'off',
    'vue/valid-template-root': 'off',
    'vue/no-v-html': 'off',
    'vue/attributes-order': 'off',
    'space-before-function-paren': 'off',
    'no-lonely-if': 'off',
    'no-trailing-spaces': 'off',
    'indent': 'off',
    'no-unused-vars': 'off',
    'import/order': 'off',
    'no-unreachable': 'off',
    'template-curly-spacing': 'off',
    'quotes': 'off'
  }
}
