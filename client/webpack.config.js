const webpack = require("webpack");
const path = require("path");

const DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

var config = {
    mode: "development",
    entry: SRC_DIR + "/app/index.js",
    output: {
        path: DIST_DIR + "/app",
        filename: "bundle.js",
        publicPath: "/app/"
    },
    devServer: {
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                include: SRC_DIR,
                use: {
                    loader: "babel-loader",
                    query: {
                        presets: ["react", "es2015", "stage-2"]
                    }
                }
            }
        ]
    }
};

module.exports = config;