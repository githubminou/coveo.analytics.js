import typescript from 'rollup-plugin-typescript2';
import {uglify} from 'rollup-plugin-uglify';
import {terser} from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import bundleSize from 'rollup-plugin-bundle-size';

const tsPlugin = () =>
    typescript({
        useTsconfigDeclarationDir: true,
    });

const umdConfig = (file) => ({
    file,
    format: 'umd',
    name: 'coveoua',
    sourcemap: true,
});

const browser = {
    input: './src/coveoua/browser.ts',
    output: [umdConfig('./dist/coveoua.js')],
    plugins: [
        tsPlugin(),
        uglify(),
        bundleSize(),
        process.env.SERVE
            ? serve({
                  contentBase: ['dist', 'public'],
                  port: 9001,
                  open: true,
                  headers: {
                      'Access-Control-Allow-Origin': 'http://localhost:9001',
                  },
              })
            : null,
    ],
};

const libUMD = {
    input: './src/coveoua/library.ts',
    output: [umdConfig('./dist/library.js')],
    plugins: [tsPlugin(), uglify(), bundleSize()],
};

const libESM = {
    input: './src/coveoua/headless.ts',
    output: {
        file: './dist/library.es.js',
        format: 'es',
        sourcemap: true,
    },
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {compilerOptions: {target: 'es6'}},
        }),
    ],
};

const libRN = {
    input: './src/react-native/index.ts',
    output: {
        file: './dist/react-native.es.js',
        format: 'es',
        sourcemap: true,
    },
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {compilerOptions: {target: 'es6'}},
        }),
    ],
};

export default [browser, libUMD, libESM, libRN];
