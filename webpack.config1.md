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
            chunks: ["admin", "user", "layout"],
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

<!-- <script type="module" src="../../layout/layout.js"></script>
    <script type="module" src="../js/actions_user.js"></script>
    <script type="module" src="../js/login.js"></script> -->