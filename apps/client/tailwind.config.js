const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app,lib}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      screens: {
        'h-sm': { raw: '(min-height: 640px)' },
        'h-md': { raw: '(min-height: 800px)' },
        'h-lg': { raw: '(min-height: 1024px)' },
        'h-xl': { raw: '(min-height: 1300px)' },
      },
    },
  },
  plugins: [require('tw-elements/dist/plugin.cjs')],
};
