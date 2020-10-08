const { resolve } = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: resolve('dist'),
    filename: 'index.js',
    library: 'VueInteractiveForm',
    libraryTarget: 'commonjs',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.vue'],
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript'
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { 'legacy': true }],
              ]
            }
          }
        ],
      },
      {
        test: /\.s[ac]+ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: { additionalData: "@import '@/style/default.scss';" }
          }
        ],
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};
