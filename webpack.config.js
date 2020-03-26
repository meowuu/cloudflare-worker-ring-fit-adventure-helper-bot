const path = require('path');
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'index.ts'),
  watch: true,
  target: 'webworker',
  module: {
    rules: [{
      test: /.ts$/,
      include: [
        path.resolve(__dirname)
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules')
      ],
      loader: 'ts-loader'
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.ts']
  },
  devtool: 'source-map'
};