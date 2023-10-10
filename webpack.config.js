const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const dev = new webpack.EnvironmentPlugin({
    NODE_ENV: "development",
    DEBUG: false
});

let config = {
    entry: {
        layout: "./src/app/src/layout/layout.js",
        user: "./src/app/src/user/js/user.js",
        admin: "./src/app/src/admin/js/admin.js",
    },

    watch: true,

    output: {
        path: path.resolve(__dirname, "./src/app/public"),
        filename: "./js/[name].bundle.js"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true
                    }
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/app/src/index.html",
            filename: "index.html",
            chunks: ["layout", "user", "admin"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/home/pages/home.html",
            filename: "home.html",
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/user/pages/registration.html",
            filename: "registration.html",

        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/user/pages/login.html",
            filename: "login.html",

        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/user/pages/profil.html",
            filename: "profil.html",

        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/user/pages/update.html",
            filename: "update.html",

        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/admin/pages/profils.html",
            filename: "profils.html",

        }),
    ],

    optimization: {
    },

    devtool: dev ? "eval-cheap-module-source-map" : "source-map",
};

if (!dev) {
    config.optimization.minimize = true;
    config.optimization.minimizer = [new TerserPlugin(), new HtmlMinimizerPlugin()];
}

module.exports = config