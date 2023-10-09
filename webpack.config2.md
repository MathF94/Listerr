const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const dev = new webpack.EnvironmentPlugin({
    NODE_ENV: "development",
    DEBUG: false
});

let jsConfig = {
    entry: {
        user: "./src/app/src/user/js/user.js",
        admin: "./src/app/src/admin/js/admin.js",
        layout: "./src/app/src/layout/layout.js",
        utils: "./src/app/src/services/utils.js",
    },

    watch: true,

    output: {
        path: path.resolve(__dirname, "./src/app/public/js"),
        filename: "[name].bundle.js"
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
    optimization: {
    },

    devtool: dev ? "eval-cheap-module-source-map" : "source-map",
};

let pagesConfig = {
    entry: {
        login: "./src/app/src/user/pages/login.html",
        profil_user: "./src/app/src/user/pages/profil_user.html",
        registration: "./src/app/src/user/pages/registration.html",
        update: "./src/app/src/user/pages/update.html",
        profils_users: "./src/app/src/admin/pages/profils_users.html",

    },

    watch: true,

    output: {
        path: path.resolve(__dirname, "./src/app/public/pages"),
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/app/src/user/pages/registration.html",
            filename: "registration.html",
            chunks: ["user","layout"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/user/pages/login.html",
            filename: "login.html",
            chunks: ["user","layout"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/user/pages/profil_user.html",
            filename: "profil_user.html",
            chunks: ["user","layout"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/user/pages/update.html",
            filename: "update.html",
            chunks: ["user","layout"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/app/src/admin/pages/profils_users.html",
            filename: "profils_users.html",
            chunks: ["admin", "layout"],
        }),
    ],

    optimization: {
    },

    devtool: dev ? "eval-cheap-module-source-map" : "source-map",
};

if (!dev) {
    jsConfig.optimization.minimize = true;
    jsConfig.optimization.minimizer = new TerserPlugin();
}

if (!dev) {
    pagesConfig.optimization.minimize = true;
    pagesConfig.optimization.minimizer = new HtmlMinimizerPlugin();
}

module.exports = [jsConfig, pagesConfig]