// Extracted from
// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-types.md
const bannedTypes = {
  String: {
    message: 'Use string instead',
    fixWith: 'string',
  },
  Boolean: {
    message: 'Use boolean instead',
    fixWith: 'boolean',
  },
  Number: {
    message: 'Use number instead',
    fixWith: 'number',
  },
  Symbol: {
    message: 'Use symbol instead',
    fixWith: 'symbol',
  },

  Function: {
    message: [
      'The `Function` type accepts any function-like value.',
      'It provides no type safety when calling the function, which can be a common source of bugs.',
      'It also accepts things like class declarations, which will throw at runtime as they will not be called with `new`.',
      'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.',
    ].join('\n'),
  },

  // object typing
  Object: {
    message: [
      'The `Object` type actually means "any non-nullish value", so it is marginally better than `unknown`.',
      '- If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.',
      '- If you want a type meaning "any value", you probably want `unknown` instead.',
    ].join('\n'),
  },
  object: {
    message: [
      'The `object` type is currently hard to use ([see this issue](https://github.com/microsoft/TypeScript/issues/21732)).',
      'Consider using `Record<string, unknown>` instead, as it allows you to more easily inspect and use the keys.',
    ].join('\n'),
  },
};

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
    // 'prettier/@typescript-eslint',
    // 'plugin:react-hooks/recommended',
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/extensions': ['.ts', '.tsx'],
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'filenames',
    'prettier',
    'promise',
    'import',
  ],
  rules: {
    // typescript
    '@typescript-eslint/explicit-member-accessibility': ['off'],
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      {
        allowExpressions: true,
      },
    ],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/prefer-interface': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        variables: false,
        functions: false,
        typedefs: false,
      },
    ],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: bannedTypes,
        extendDefaults: false,
      },
    ],
    // Disable default eslint indent, as it may break typescript indent
    // Typescript indent is handled by prettier
    indent: 'off',

    // react @TODO
    'react/jsx-key': 2,
    'react/display-name': 'off',
    'react/prop-types': 'off',

    // react-hooks
    'react-hooks/rules-of-hooks': 'error',

    // filenames
    'filenames/match-regex': ['error', '^.?_?[a-z][a-z-.]*[a-z]$'],

    // Code
    semi: ['error', 'always'],
    'max-len': 'off',

    // Use prettier
    'prettier/prettier': 'error',

    // imports-plugin
    // 'import/named': 1,

    'import/order': [
      'warn',
      {
        groups: [
          'external',
          'builtin',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@api/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@utils/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@hooks/**',
            group: 'internal',
            position: 'before',
          },

          // global components
          {
            pattern: '@atoms',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@molecules/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@organisms/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@templates/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@modules/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@chakra-ui/**',
            group: 'internal',
            position: 'before',
          },

          {
            pattern: '@types/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '@styles',
            group: 'internal',
            position: 'after',
          },

          {
            pattern: './*.scss',
            group: 'sibling',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        'newlines-between': 'always-and-inside-groups',
      },
    ],
  },
};
