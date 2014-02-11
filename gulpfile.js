var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    compass = require('gulp-compass'),
    ftp = require('gulp-ftp');


gulp.task('styles', function() {
  return gulp.src('scss/main.scss')
    .pipe(compass({
        css: 'css',
        sass: 'scss',
        image: 'img',
        javascript: "js",
        font: 'fonts',
        style: 'nested',
        relative: true,
        comments: false
    }))
    .pipe(gulp.dest('css'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'SCSS compiled and minified' }));
});

gulp.task('lib-scripts', function() {
  return gulp.src('js/lib/**/*.js')
    .pipe(jshint.reporter('default'))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Lib Scripts task complete' }));
});

gulp.task('scripts', function(){
  return gulp.src('js/main.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('markup', function(){
  return gulp.src(['*.php', 'includes/*.php'])
    .pipe(livereload(server))
    .pipe(notify({ message: 'Markup changes reloaded'}));
});

gulp.task('default', function() {
    gulp.start('styles', 'lib-scripts', 'scripts');
});

gulp.task('watch', function() {

  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };

    // Watch tasks go inside inside server.listen()
    // Watch .scss files
    gulp.watch('scss/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('js/**/*.js', ['scripts']);

    gulp.watch('*.php', ['markup']);
    gulp.watch('includes/*.php', ['markup']);

  });

});