export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
  },
];
