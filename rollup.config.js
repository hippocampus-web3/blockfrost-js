/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

// eslint-disable-next-line no-undef
module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
};
