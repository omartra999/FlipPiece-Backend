export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.log',
      '.env*'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'writable',
        module: 'writable',
        require: 'readonly',
        global: 'readonly'
      }
    },
    rules: {
      // Auto-fixable formatting rules
      'indent': [
        'error',
        2
      ],
      'quotes': [
        'error',
        'single'
      ],
      'semi': [
        'error',
        'always'
      ],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'object-curly-spacing': [
        'error',
        'always'
      ],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'comma-spacing': 'error',

      // MULTILINE OBJECT RULES
      'object-curly-newline': [
        'error',
        {
          ObjectExpression: {
            multiline: true,
            minProperties: 1  // Force newline for ANY object with properties
          },
          ObjectPattern: {
            multiline: true,
            minProperties: 2  // Destructuring with 2+ properties
          }
        }
      ],
      'object-property-newline': [
        'error',
        {
          allowAllPropertiesOnSameLine: false  // Never allow properties on same line
        }
      ],
      'brace-style': [
        'error',
        '1tbs',
        {
          allowSingleLine: false  // Never allow single-line blocks
        }
      ],
      'block-spacing': [
        'error',
        'always'
      ],
      'array-bracket-newline': [
        'error',
        {
          multiline: true,
          minItems: 2  // Arrays with 2+ items get newlines
        }
      ],
      'array-element-newline': [
        'error',
        {
          multiline: true,
          minItems: 2  // Each array element on new line if 2+ items
        }
      ],
      'function-paren-newline': [
        'error',
        'multiline'
      ],

      // Code quality rules
      // 'no-unused-vars': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': 'error',
      //'no-console': 'warn'
    }
  }
];
