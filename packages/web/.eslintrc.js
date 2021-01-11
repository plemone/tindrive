module.exports = {
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
    ],
    plugins: ['react', '@typescript-eslint', 'jest'],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    rules: {
        'linebreak-style': 'off',
        '@typescript-eslint/indent': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/prop-types': 0,
        'max-len': [1, 180],
        'react/jsx-props-no-spreading': 0,
        'no-empty': 0,
        'import/no-cycle': 0,
        'react/jsx-fragments': 0,
        'arrow-parens': ['error', 'as-needed'],
        'arrow-body-style': ['error', 'as-needed'],
        'eslint/no-shadow': 0,
        '@typescript-eslint/no-shadow': 0,
        'no-unused-expressions': 0,
        '@typescript-eslint/no-unused-expressions': 0,
        'no-plusplus': 0,
        'no-param-reassign': 0,
        'no-nested-ternary': 0,
        'import/prefer-default-export': 0
    },
};
