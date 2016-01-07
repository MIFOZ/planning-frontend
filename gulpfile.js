var gulp;

gulp = require('gulp');
concat = require('gulp-concat');
sass = require('gulp-sass');
babel = require('gulp-babel');
include = require('gulp-include');

gulp.task('default', ['compile-scss', 'js']);

gulp.task('compile-scss', function() {
  gulp.src('app/assets/stylesheets/**/*.scss')
    .pipe(sass({ indentedSyntax: false, errLogConsole: true }))
    .pipe(gulp.dest('public/assets'));
});

gulp.task('js', function() {
    gulp.src('./js/**/tasks.js')
        .pipe(include())
          .on('error', console.log)
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./')); // даем команду на перезагрузку страницы
});

gulp.task('watch', ['watch-scss']);

gulp.task('watch-scss', function() {
  gulp.watch('app/assets/stylesheets/**/*.scss', ['compile-scss'])
});
