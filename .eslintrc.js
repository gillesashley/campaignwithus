module.exports = {
  // Add to your .eslintrc.js if not already included
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['next/babel']
    }
  },

  // extends: ['next/babel', 'next/core-web-vitals', 'plugin:import/recommended', 'prettier'],
  extends: ['next/babel', 'next/core-web-vitals'],
  rules: {
    'jsx-a11y/alt-text': 'off',
    'react/display-name': 'off',
    'react/no-children-prop': 'off',
    '@next/next/no-img-element': 'off',
    '@next/next/no-page-custom-font': 'off',
    'lines-around-comment': 'off',
    // [
    //   'error',
    //   {
    //     beforeBlockComment: true,
    //     beforeLineComment: true,
    //     allowBlockStart: true,
    //     allowObjectStart: true,
    //     allowArrayStart: true
    //   }
    // ],
    'padding-line-between-statements': 'off',

    // [
    //   'error',
    //   {
    //     blankLine: 'any',
    //     prev: 'export',
    //     next: 'export'
    //   },
    //   {
    //     blankLine: 'always',
    //     prev: ['const', 'let', 'var'],
    //     next: '*'
    //   },
    //   {
    //     blankLine: 'any',
    //     prev: ['const', 'let', 'var'],
    //     next: ['const', 'let', 'var']
    //   },
    //   {
    //     blankLine: 'always',
    //     prev: '*',
    //     next: ['function', 'multiline-const', 'multiline-block-like']
    //   },
    //   {
    //     blankLine: 'always',
    //     prev: ['function', 'multiline-const', 'multiline-block-like'],
    //     next: '*'
    //   }
    // ],
    'newline-before-return': 'off',
    'import/newline-after-import': 'off',

    // [
    //   'error',
    //   {
    //     count: 1
    //   }
    // ],
    'import/order': 'off'

    // [
    //   'error',
    //   {
    //     groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], ['object', 'unknown']],
    //     pathGroups: [
    //       {
    //         pattern: 'react',
    //         group: 'external',
    //         position: 'before'
    //       },
    //       {
    //         pattern: 'next/**',
    //         group: 'external',
    //         position: 'before'
    //       },
    //       {
    //         pattern: '~/**',
    //         group: 'external',
    //         position: 'before'
    //       },
    //       {
    //         pattern: '@/**',
    //         group: 'internal'
    //       }
    //     ],
    //     pathGroupsExcludedImportTypes: ['react', 'type'],
    //     'newlines-between': 'always-and-inside-groups'
    //   }
    // ]
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/parsers': {},
    'import/resolver': {
      typescript: {
        project: './jsconfig.json'
      }
    }
  },
  overrides: []
}
