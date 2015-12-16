var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var vinylSource = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('build', function() {
	return browserify('src/App.js')
		.transform('babelify', {presets: 'react'}) 
		.bundle()
		.pipe(vinylSource('bundle.js'))
		.pipe(gulp.dest('static/'));

});

gulp.task('watch', function() {
	var opts = { debug: true, cache: {}, packageCache: {}};
	var watcher = watchify(browserify('src/App.js', opts))
		.transform('babelify', {presets: 'react'});

	watcher.on('update', function() {
		watcher.bundle()
			.on('error', function(err) {
				console.log(err.message);
				console.log(err.codeFrame);
			})
			.pipe(vinylSource('bundle.js'))
			.pipe(gulp.dest('static/'));
		console.log('Updated');
	})
		.bundle()
		.on('error', function(err) {
			console.log(err.message);
			console.log(err.codeFrame);
		})
		.pipe(vinylSource('bundle.js'))
		.pipe(gulp.dest('static/'));

	return watcher;
});

gulp.task('default', ['watch']);
