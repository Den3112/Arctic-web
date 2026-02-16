import nextConfig from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      '.next/**',
      '.vercel/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'public/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
      'next-env.d.ts',
      '*.config.ts',
      '*.config.mjs',
      '*.config.js',
      'package-lock.json',
      'tsconfig.tsbuildinfo',
    ],
  },
  ...nextConfig,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default config;
