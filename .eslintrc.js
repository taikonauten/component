
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    './node_modules/@taikonauten/linters-js/eslint/index.js',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: [
        '.eslintrc.js',
      ],
      env: {
        node: true
      },
      rules: {
        'no-console': 'off',
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      plugins: [
        '@typescript-eslint'
      ],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        './node_modules/@taikonauten/linters-typescript/eslint/index.js',
      ],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'warn'
      }
    },
    {
      files: [
        '**/tests/**/*.ts'
      ],
      rules: {
        'no-console': 'warn'
      }
    }
  ],
};
