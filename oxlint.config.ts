import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['react', 'react-perf', 'typescript', 'unicorn'],
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    curly: ['error', 'multi-line', 'consistent'],
    eqeqeq: 'error',
    'max-params': ['error', { max: 3 }],
    'no-console': 'error',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
      },
    ],
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'prefer-destructuring': 'error',
    'sort-keys': [
      'error',
      'asc',
      { allowLineSeparatedGroups: true, natural: true },
    ],
    'typescript/no-explicit-any': 'error',
    'unicorn/no-array-for-each': 'error',
    yoda: ['error', 'never', { exceptRange: true }],
  },
})
