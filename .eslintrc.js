module.exports = {
  extends: ['./node_modules/poetic/config/eslint/eslint-config.js'],
  rules: {
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'object-curly-spacing': ['error', 'always'],
    'semi': ['error', 'never'],
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'react/jsx-max-props-per-line': 1,
    'react/jsx-wrap-multilines': 1,
    'react/jsx-closing-bracket-location': [1, 'line-aligned'],
    'react/jsx-first-prop-new-line': [1, 'multiline-multiprop'],
    'react/jsx-tag-spacing': 1,
    'react/jsx-props-no-spreading': 0,
    'jsx-quotes': ['error', 'prefer-double'],
    'import/prefer-default-export': 'off',
    'no-multi-spaces': 1,
    'space-before-function-paren': ['error', 'always'],
    'no-use-before-define': 0,
  }
}
