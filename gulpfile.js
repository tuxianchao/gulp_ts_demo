var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

var paths = {
    pages: ['./*.html']
};

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series(gulp.parallel('copy-html'), function () {
    // 将把所有模块捆绑成一个JavaScript文件
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/Main.ts'],
        cache: {},
        packageCache: {}
    })
        // 使用tsify插件调用Browserify，而不是gulp-typescript。
        .plugin(tsify)
        .transform('babelify', {
            presets: ['es2015'],
            extensions: ['.ts']
        })
        // 使用source（vinyl-source-stream的别名）把输出文件命名为bundle.js
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
}));