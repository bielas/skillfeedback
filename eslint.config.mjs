// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  // --- boundaries ---
  {
    plugins: {
      boundaries,
      import: importPlugin,
    },
    settings: {
      'boundaries/elements': [
        {
          type: 'domain',
          pattern: 'src/*/core/domain/**',
          capture: ['domainName'],
        },
        {
          type: 'application',
          pattern: 'src/*/core/application/**',
          capture: ['domainName'],
        },
        {
          type: 'adapter-input',
          pattern: 'src/*/adapter/input/**',
          capture: ['domainName'],
        },
        {
          type: 'adapter-output',
          pattern: 'src/*/adapter/output/**',
          capture: ['domainName'],
        },
        {
          type: 'module',
          pattern: 'src/*/*.module.ts',
          capture: ['domainName'],
        },
        {
          type: 'shared',
          pattern: 'src/shared/**',
        },
        {
          type: 'infrastructure',
          pattern: 'src/infrastructure/**',
        },
      ],
      'boundaries/ignore': ['src/main.ts', 'src/app.module.ts'],

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: { type: 'domain' },
              allow: [
                {
                  to: {
                    type: 'domain',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                { to: { type: 'shared' } },
              ],
            },
            {
              from: { type: 'application' },
              allow: [
                {
                  to: {
                    type: 'application',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                {
                  to: {
                    type: 'domain',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                { to: { type: 'shared' } },
              ],
            },
            {
              from: { type: 'adapter-input' },
              allow: [
                {
                  to: {
                    type: 'adapter-input',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                {
                  to: {
                    type: 'application',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                {
                  to: {
                    type: 'domain',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                { to: { type: 'shared' } },
              ],
            },
            {
              from: { type: 'adapter-output' },
              allow: [
                {
                  to: {
                    type: 'adapter-output',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                {
                  to: {
                    type: 'domain',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                { to: { type: 'shared' } },
                { to: { type: 'infrastructure' } },
              ],
            },
            {
              from: { type: 'module' },
              allow: [
                {
                  to: {
                    type: 'domain',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                {
                  to: {
                    type: 'application',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                {
                  to: {
                    type: 'adapter-input',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                {
                  to: {
                    type: 'adapter-output',
                    captured: { domainName: '{{from.captured.domainName}}' },
                  },
                },
                { to: { type: 'shared' } },
                { to: { type: 'infrastructure' } },
              ],
            },
            {
              from: { type: 'shared' },
              allow: [{ to: { type: 'shared' } }],
            },
            {
              from: { type: 'infrastructure' },
              allow: [
                { to: { type: 'infrastructure' } },
                { to: { type: 'shared' } },
              ],
            },
          ],
        },
      ],
    },
  },
);
