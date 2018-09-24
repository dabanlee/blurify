import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import sourcemaps from 'rollup-plugin-sourcemaps';

const packages = require('./package.json');
const fileName = process.env.NODE_ENV === 'development' ? packages.moduleName : `${packages.moduleName}.min`;

const configure = {
    input: `src/index.js`,
    output: [{
        format: 'umd',
        name: fileName,
        sourcemap: true,
        file: `dist/${fileName.toLowerCase()}.js`,
    }],
    plugins: [
        resolve(),
        commonjs(),
        sourcemaps(),
    ],
};

if (process.env.NODE_ENV === 'production') configure.plugins.push(uglify());

export default configure;
