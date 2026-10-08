import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const forbidImports = (packages) => ({
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: packages.flatMap((name) => [name, `${name}/*`]),
          message:
            'Feature packages must not depend on each other. Move shared code to @app/shared.',
        },
      ],
    },
  ],
});

export default tseslint.config(
  { ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: { globals: { ...globals.browser } },
  },
  // Module boundaries: users and todos never import each other or the app.
  {
    files: ['packages/users/**/*.{ts,tsx}'],
    rules: forbidImports(['@app/todos', '@app/web']),
  },
  {
    files: ['packages/todos/**/*.{ts,tsx}'],
    rules: forbidImports(['@app/users', '@app/web']),
  },
  {
    files: ['packages/shared/**/*.{ts,tsx}'],
    rules: forbidImports(['@app/users', '@app/todos', '@app/web']),
  },
);
