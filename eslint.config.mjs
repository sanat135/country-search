import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['node_modules/**', 'public/js/**', 'coverage/**'],
  },
  ...tseslint.configs.recommended,
];
