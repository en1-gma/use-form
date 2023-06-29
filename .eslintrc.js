module.exports = {
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:all',
    'plugin:react/all',
    'plugin:react-hooks/recommended',
    'airbnb',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'simple-import-sort',
    'no-relative-import-paths',
  ],
  rules: {
    'default-param-last': 0,
    'function-call-argument-newline': ['error', 'consistent'],
    'function-paren-newline': ['error', 'consistent'],
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'linebreak-style': 0,
    'max-classes-per-file': 0,
    'max-len': ['error', { code: 128, ignoreComments: true }],
    'max-params': ['error', 3],
    'no-extra-boolean-cast': 0,
    'no-multi-spaces': ['error'],
    'no-param-reassign': 0,
    'no-sequences': 0,
    'no-plusplus': 0,
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    }],
    'react/destructuring-assignment': 0,
    'react/function-component-definition': 0,
    'react/jsx-key': ['error', { checkFragmentShorthand: true, checkKeyMustBeforeSpread: true }],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'react/no-unstable-nested-components': 0,
    'simple-import-sort/imports': 'error',
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { allowSameFolder: true, rootDir: 'src' },
    ],
    'import/extensions': 0,
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'react-hooks/rules-of-hooks': 0,
  },
  overrides: [
    // override "simple-import-sort" config
    {
      files: ['*.js', '*.jsx'],
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Packages `react` related packages come first.
              ['^react', '^@?\\w'],
              // Internal packages.
              ['^(@|components)(/.*|$)'],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.?(css)$'],
            ],
          },
        ],
      },
    },
  ],
};
