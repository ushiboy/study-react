var gulp = require('gulp'),
  path = require('path'),
  $ = require('gulp-load-plugins')(),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.config.js'),
  bundler = webpack(webpackConfig),
  browserSync = require('browser-sync'),
  proxyMiddleware = require('http-proxy-middleware'),
  reload = browserSync.reload;

gulp.task('webpack:build', function(cb) {
  bundler.run(function(err, stats) {
    if (err) {
      throw new $.util.PluginError('webpack:build', err);
    }
    $.util.log('[webpack:build]', stats.toString({
      colors: true,
      chunkModules: false
    }));
    reload();
    cb();
  });
});

gulp.task('webserver-dev', function() {
  browserSync({
    server: {
      baseDir: path.join(__dirname),
      middleware: [
        proxyMiddleware('/api', { target: 'http://localhost:8081' })
      ]
    },
    port: 8080,
    open: false
  });
});

gulp.task('mock-server', function() {
  var mockServer = require('./mockserv');
  mockServer.start();
});

gulp.task('default', ['webpack:build', 'mock-server', 'webserver-dev'], function() {
  gulp.watch('src/**/*.js', ['webpack:build']);
});
