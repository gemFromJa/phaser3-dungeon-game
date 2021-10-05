const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
	mode: isProd ? "production" : "development",
	entry: "./src/index.js",
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "public"),
	},
	module: {
		rules: [],
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: "src/assets",
					to: "assets",
				},
			],
		}),
	],
};
