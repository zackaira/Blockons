const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // Delete old files
const TerserPlugin = require("terser-webpack-plugin"); // JS minify
const autoprefixer = require("autoprefixer");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("css-minimizer-webpack-plugin");

const config = {
	entry: {
		settings: "./src/settings.js",
		"settings.min": "./src/settings.js",
		admin: "./src/backend/admin/admin.js",
		"admin.min": "./src/backend/admin/admin.js",
		editor: "./src/backend/editor/editor.js",
		"editor.min": "./src/backend/editor/editor.js",
		frontend: "./src/frontend/frontend.js",
		"frontend.min": "./src/frontend/frontend.js",
		"swiper-video.min": "./assets/slider/swiper-video.js",
		"imagegallery.min": "./assets/blocks/image-gallery/imagegallery.js",
		// Premium Files
		"cart-pro.min": "./assets/blocks/wc-mini-cart/pro/cart.js",
		"search-pro.min": "./assets/blocks/search/pro/search.js",
		"imagegallery-pro.min": "./assets/blocks/image-gallery/pro/imagegallery.js",
	},
	output: {
		// filename: "[name].js", // Uses the name of the file
		filename: (pathData) => {
			return pathData.chunk.name === "search-pro.min" ||
				pathData.chunk.name === "cart-pro.min" ||
				pathData.chunk.name === "imagegallery-pro.min"
				? "pro/[name].js"
				: "[name].js";
		},
		// path: path.resolve(process.cwd(), "dist"),
		path: path.resolve(__dirname, "dist"),
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				// include: /(\.min)\.(js|css)$/,
				exclude: /(?<!\.min)\.(js|css)$/,
				extractComments: false,
			}),
			new OptimizeCSSAssetsPlugin({
				exclude: /(?<!\.min)\.css$/,
			}),
		],
	},
	plugins: [
		// new CleanWebpackPlugin(),
		new MiniCSSExtractPlugin({
			// filename: "[name].css",
			filename: (pathData) => {
				return pathData.chunk.name === "cart-pro.min"
					? "pro/[name].css"
					: "[name].css";
			},
		}),
	],
	devtool: false, // "cheap-module-source-map", // https://webpack.js.org/configuration/devtool/
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
					},
				},
			},
			{
				test: /\.css$/,
				use: [
					// "style-loader",
					MiniCSSExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									autoprefixer({ overrideBrowserslist: ["last 2 versions"] }),
								],
							},
						},
					},
				],
			},
		],
	},
};

module.exports = config;
