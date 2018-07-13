const path = require('path');

module.exports = {
  entry: {
    recorder: './src/recorder.js',
    visu: './src/visu.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader" },
      {
          test:/\.css$/,
          use:['style-loader','css-loader']
      }
      ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './'
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
  }],
  resolve: {
  alias: {
    'jquery-ui': 'jquery-ui-dist/jquery-ui.js'
  }
}
};
