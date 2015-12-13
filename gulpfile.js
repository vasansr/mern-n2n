var gulp = require('gulp');
var babel = require('gulp-babel');

var path = {
	SRC_JSX: ['src/*.js','src/*.jsx'],
	DEST_JS: 'static'
};

gulp.task('transform', function() {
	gulp.src(path.SRC_JSX)
		.pipe(babel({presets: ["react"]}))
		.on('error', function(err) {
			console.log('Caught error: ', err);
			console.log(err.stack);
			this.emit('end');	// ideally this should not be done in production'.
		})
		.pipe(gulp.dest(path.DEST_JS));
});

gulp.task('watch', function(){
	gulp.watch(path.SRC_JSX, ['transform']);
});

gulp.task('default', ['transform','watch']);

