var nodeExternals = require('webpack-node-externals');

module.exports = [
    {
        name: "Rancher-gen",
        entry: "./src/main.ts",
        output: {
            filename: "./dist/main.js",
            pathinfo: true
        },
        target: "node",
        externals: [nodeExternals()],
        resolve: {
            extensions: ['.ts']
        },
        module: {
            loaders: [
                { test: /\.ts$/, loader: 'ts-loader' }
            ]
        }
    }
];
