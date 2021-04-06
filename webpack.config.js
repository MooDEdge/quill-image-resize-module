var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [{
    entry: "./src/ImageResize.js",
    output: {
        path: path.resolve(__dirname, 'dist/umd'),
        library: 'ImageResize',
        libraryTarget: 'umd',
        filename: "image-resize.min.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        "presets": [["es2015", { "modules": false }]],
                        "plugins": ["babel-plugin-transform-class-properties"]
                    }
                }]
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: 'raw-loader'
                }]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src'),
                to: path.resolve(__dirname, 'dist/esm'),
                toType: 'dir',
                transform(content, path) {
                    return maybeTransform(content.toString());
                }
            }
        ])
    ]
}];

function maybeTransform(content) {

    return content.toString().replace(
        /import (.*) from 'quill\/assets\/(.*)';/g,
        "import { $1 } from './client-side-assets.js';"
    );

}
