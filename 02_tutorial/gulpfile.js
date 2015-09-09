var gulp = require('gulp'),
  path = require('path'),
  $ = require('gulp-load-plugins')(),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.config.js'),
  bundler = webpack(webpackConfig),
  browserSync = require('browser-sync'),
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
    },
    port: 8080,
    open: false
  });
});

gulp.task('default', ['webpack:build', 'webserver-dev'], function() {
  gulp.watch('src/**/*.js', ['webpack:build']);
});
