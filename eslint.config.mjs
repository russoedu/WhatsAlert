import { FlatCompat } from '@eslint/eslintrc'
import json from '@eslint/json'
import nx from '@nx/eslint-plugin'
import pluginJest from 'eslint-plugin-jest'
import jsonc from 'eslint-plugin-jsonc'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsdoc from 'eslint-plugin-tsdoc'
import yaml from 'eslint-plugin-yml'
import { defineConfig } from 'eslint/config'
import globalsConfig from 'globals'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat()

/* #region  RULES */
const tsRules = {
  // This is the job of eslint-config-standard
  'no-unused-vars':        'off',
  'no-dupe-class-members': 'off',
  'no-var':                'error',
  'prefer-const':          'error',
  'no-extra-boolean-cast': 'off',
  'no-throw-literal':      'off',
  'object-curly-spacing':  ['error', 'always'],
  'no-useless-escape':     'off',
  semi:                    ['error', 'never'],
  'no-magic-numbers':      [
    'warn',
    {
      ignoreArrayIndexes:            true,
      ignoreDefaultValues:           true,
      ignoreClassFieldInitialValues: true,
      // TS only
      ignoreEnums:                   true,
      ignoreNumericLiteralTypes:     true,
      ignoreReadonlyClassProperties: true,
      ignoreTypeIndexes:             true,
    }],
  'comma-dangle': [
    'error',
    {
      arrays:    'always-multiline',
      objects:   'always-multiline',
      imports:   'always-multiline',
      exports:   'always-multiline',
      functions: 'always-multiline',
    },
  ],
  'key-spacing': [
    'error',
    {
      align: {
        beforeColon: false,
        afterColon:  true,
        on:          'value',
      },
    },
  ],
  'newline-before-return': 'error',

  '@nx/enforce-module-boundaries': 'off',

  'tsdoc/syntax':                                      'warn',
  // This is the job of eslint-config-standard
  '@typescript-eslint/indent':                         'off',
  '@typescript-eslint/no-floating-promises':           'error',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any':                'off',
  '@typescript-eslint/no-non-null-assertion':          'off',
  '@typescript-eslint/consistent-type-definitions':    'off',
  '@typescript-eslint/prefer-regexp-exec':             'off',
  '@typescript-eslint/no-require-imports':             'error',
  '@typescript-eslint/no-unused-vars':                 [
    'error',
    {
      argsIgnorePattern:         '^_',
      varsIgnorePattern:         '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  'react-in-jsx-scope':                   'off',
  'react/jsx-uses-react':                 'error',
  'react/jsx-uses-vars':                  'error',
  'react-refresh/only-export-components': [
    'warn',
    { allowConstantExport: true },
  ],
  // 'react/no-unescaped-entities':          'off',
  // 'react/react-in-jsx-scope':             'off',
  // 'react-hooks/immutability':             'off',
  // 'react-hooks/exhaustive-deps':          'off',
}

const tsJestRules = {
  ...tsRules,
  '@typescript-eslint/no-require-imports': 'off',
  'import/first':                          'off',
}

const tsReactRules = {
  ...tsRules,
  '@typescript-eslint/no-floating-promises': 'off',
  'react/react-in-jsx-scope':                'off',
  'react/jsx-uses-react':                    'error',
  'react/jsx-uses-vars':                     'error',
  'react-refresh/only-export-components':    [
    'warn',
    { allowConstantExport: true },
  ],
  'react-hooks/immutability':    'off',
  'react-hooks/exhaustive-deps': 'off',
}

const jsonRules = {
  'eol-last':                    ['error', 'never'],
  'jsonc/auto':                  'error',
  'jsonc/array-bracket-newline': [
    'error',
    { multiline: true },
  ],
  'jsonc/array-element-newline': [
    'error',
    {
      ArrayExpression: 'consistent',
      ArrayPattern:    { minItems: 1 },
    },
  ],
  'no-multiple-empty-lines': [
    'error',
    { max: 1, maxEOF: 0 },
  ],
}

const yamlRules = {
  'eol-last':       ['error', 'never'],
  'spaced-comment': 'off',
}
/* #endregion */

/* #region  GLOBALS - add as needed in your project */
const globals = {
  ...globalsConfig.node,
  ...globalsConfig.jest,
  ...globalsConfig.browser,
  // ...globals.jquery`
}
/* #endregion */

/******************************************************************************
 ******************************************************************************
 ********** PLEASE BE SURE YOU KNOW WHAT YOU ARE DOING FROM NOW ON! ***********
 ******************************************************************************
 ****************** YOU PROBABLY WANT TO FOCUS ON THE RULES *******************
 ******************************************************************************
 *****************************************************************************/
/* #region  TYPES */
const typeTs = {
  files:   ['**/*.{ts,mts,cts,js,mjs,cjs, tsx,jsx}'],
  extends: [
    ...nx.configs['flat/typescript'],
    ...tseslint.configs.stylisticTypeChecked, // OK here, now scoped only to TS
  ],
  settings: {
    react: {
      version: '19.2',
    },
  },
  languageOptions: {
    globals,
    parserOptions: {
      project:             './tsconfig.json',
      tsconfigRootDir:     import.meta.dirname,
      allowDefaultProject: true,
      ecmaFeatures:        { jsx: true },
    },
  },
  plugins: {
    tsdoc,
    jest: pluginJest,
    react,
  },
  rules: tsRules,
}
const typeTsx = {
  ...typeTs,
  files: ['**/*.{tsx,jsx}'],
  rules: tsReactRules,
}
const typeTsJest = {
  ...typeTs,
  files: ['**/*.{test,spec}.{ts,mts,cts,js,mjs,cjs, tsx,jsx}'],
  rules: tsJestRules,
}
/* #endregion */

/* #region  CONFIG */
export default defineConfig([
  {
    ignores: [
      '.nx/*',
      'coverage/*',
      'dist/*',
      'lib/*',
      'dist-dev/*',
      'dist-preprod/*',
      'dist-prod/*',
      'doc/*',
      'node_modules/**',
      '.azurite/**',
      'tmp/*',
      '**/node_modules',
      'package.json',
      'package-lock.json',
    ],
  },
  // GENERAL BASE CONFIGS
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  // REACT CONFIGS
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.recommended,

  // Apply JSON/YAML presets
  ...jsonc.configs['flat/recommended-with-json'],
  ...jsonc.configs['flat/recommended-with-jsonc'],
  ...jsonc.configs['flat/recommended-with-json5'],
  ...yaml.configs['flat/standard'],

  // JS STANDARD CONFIG
  ...compat.extends('eslint-config-standard'),

  /** -----------------------------------------
   *  TS/JS CONFIG
   * ---------------------------------------- */
  typeTs,
  typeTsJest,
  typeTsx,

  /** -----------------------------------------
   *  JSON CONFIG
   * ---------------------------------------- */
  {
    files: [
      '**/*.json',
      '**/*.jsonc',
      '**/*.json5',
    ],
    plugins: {
      json,
      jsonc,
    },
    rules: jsonRules,
  },
  /** -----------------------------------------
   *  YAML CONFIG
   * ---------------------------------------- */
  {
    files:   ['*.yaml', '*.yml', '**/*.yaml', '**/*.yml'],
    plugins: {
      yml: yaml,
    },
    language: 'yml/yaml',
    rules:    yamlRules,
  },
])
/* #endregion */
