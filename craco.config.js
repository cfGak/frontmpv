const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "crypto": require.resolve("crypto-browserify"),
          "url": require.resolve("url/"),
          "util": require.resolve("util/"),
          "buffer": require.resolve("buffer/"),
          "stream": require.resolve("stream-browserify"),
          "process": require.resolve("process/browser"),
          "vm": require.resolve("vm-browserify")
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      ]
    }
  }
};
