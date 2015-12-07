var gulp = require('gulp');
var babel = require('gulp-babel');

var path = {
	SRC_JSX: ['src/*.js','src/*.jsx'],
	DEST_JS: 'static'
};

gulp.task('transform', function() {
	gulp.src(path.SRC_JSX)
		.pipe(babel({presets: ["react"]}))
		.pipe(gulp.dest(path.DEST_JS));
});

