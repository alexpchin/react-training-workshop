var path = require('path');

module.exports = {
  entry: path.join(process.cwd(), 'src', 'app.js'),
  output: {
    path: './built',
    filename: 'webpack-dev-build.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      exlude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react'],
        cacheDirectory: true
      }
    }]
  }
}
