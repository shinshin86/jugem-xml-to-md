const webpack = require("webpack");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: "./src/index.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader", "shebang-loader"],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "index.js"
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })
  ]
};
