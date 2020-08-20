import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'

const isProd = process.env.NODE_ENV === 'production'
const { moduleName, name } = require('./package.json')
const fileName = name
const getFilePath = (format = '') => `dist/${fileName}${format == '' ? '' : '.'}${format}.js`
const output = options => ({
    name: moduleName,
    sourcemap: true,
    ...options,
    globals: {
        // 
    },
})

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
        typescript(),
        commonjs(),
        nodeResolve(),
    ],
    external: [],
}

if (isProd) {
    configure.output = configure.output.map(output => {
        const format = output.format == 'umd' ? '' : `.${output.format}`
        output.file = `dist/${fileName}${format}.min.js`
        return output
    })
    configure.plugins.push(terser())
}

module.exports = configure
