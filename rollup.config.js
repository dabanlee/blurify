import alias from 'rollup-plugin-alias';
import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

const isProd = process.env.NODE_ENV === 'production';
const { moduleName } = require('./package.json');
const getFilePath = (type = '') => `dist/${moduleName}${type == '' ? '' : '.'}${type}.js`;
const output = options => ({
    name: moduleName,
    sourcemap: true,
    ...options,
});

const configure = {
    input: 'src/index.ts',
    output: [output({
        file: getFilePath(),
        format: 'umd',
    }), output({
        file: getFilePath('es'),
        format: 'es',
    })],
    plugins: [
        alias({
            common: './common',
        }),
        typescript(),
        resolve({
            extensions: ['.js', '.ts'],
        }),
    ],
    external: [],
};

if (isProd) {
    configure.output = configure.output.map(output => {
        const format = output.format == 'umd' ? '' : `.${output.format}`;
        output.file = `dist/${moduleName}${format}.min.js`;
        return output;
    });
    configure.plugins.push(minify());
}

module.exports = configure;
