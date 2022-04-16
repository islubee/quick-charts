import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from "@rollup/plugin-commonjs";
import postcss from 'rollup-plugin-postcss';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
const packageJson = require("./package.json");

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
        sourcemap: true,
      }
    ],
    plugins: [
      resolve(), 
      postcss({
        plugins: [],
        minimize: true,
      }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react']
      }),
      commonjs(),
      external(),
      terser(),
    ]
  }
];