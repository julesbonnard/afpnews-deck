module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [
    {
      files: ['**/*.vue'],
      extends: [
        'eslint:recommended',
        'plugin:vue/recommended'
      ],
      plugins: [
        'vue'
      ]
    },
    {
      files: ['**/*.ts'],
      extends: [
        'eslint:recommended',
        '@vue/typescript',
        'plugin:@typescript-eslint/recommended'
      ],
      plugins: [
        '@typescript-eslint'
      ]
    }
  ]
}
