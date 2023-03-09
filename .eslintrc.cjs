module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
  },
  extends: ['airbnb', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'no-param-reassign': 'off',
  },
  ignorePatterns: [
    '*.json',
    '*.txt',
    '*.md',
    '*.lock',
    '*.log',
    '*.yaml',
    '*.d.ts',
    '*.config.js',
  ],
  overrides: [
    {
      files: ['*.cjs'],
      rules: {
        'import/no-commonjs': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
