module.exports = {
  root: true,
  extends: ['react-app', 'react-app/jest'],
  plugins: ['import'],
  rules: {
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
      },
    ],
  },
};
