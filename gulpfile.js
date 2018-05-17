process.env.DISABLE_NOTIFIER = true;

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

    var displayError = function(error) {

        // Initial building up of the error
        var errorString = '[' + error.plugin + ']';
        errorString += ' ' + error.message.replace("\n",'\n'); // Removes new line at the end - Q nope
    
        // If the error contains the filename or line number add it to the string
        if(error.fileName)
            errorString += ' in ' + error.fileName;
    
        if(error.lineNumber)
            errorString += ' on line ' + error.lineNumber;
    
        // This will output an error like the following:
        // [gulp-sass] error message in file_name on line 1
        console.error(errorString);
    }    

    gulp.task('styles', function() {
        return gulp.src('src/styles/styles.scss')
          .pipe(sass().on('error', function(err){
            displayError(err);
        }))
          .pipe(autoprefixer('last 2 version'))
          .pipe(gulp.dest('dist/assets/css'))
          .pipe(rename({suffix: '.min'}))
          .pipe(cssnano())
          .pipe(gulp.dest('dist/assets/css'))
          .pipe(notify({ message: 'Styles task complete' }));
    });

    gulp.task('scripts', function() {
        return gulp.src('src/scripts/**/*.js')
          .pipe(jshint('.jshintrc'))
          .pipe(jshint.reporter('default'))
          .pipe(concat('main.js'))
          .pipe(gulp.dest('dist/assets/js'))
          .pipe(rename({suffix: '.min'}))
          .pipe(uglify())
          .pipe(gulp.dest('dist/assets/js'))
          .pipe(notify({ message: 'Scripts task complete' }));
    });

    gulp.task('images', function() {
        return gulp.src('src/images/**/*')
          .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
          .pipe(gulp.dest('dist/assets/img'))
          .pipe(notify({ message: 'Images task complete' }));
    });

    gulp.task('clean', function() {
        return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img']);
    });

    gulp.task('default', ['clean'], function() {
        gulp.start('styles', 'scripts', 'images');
    });

    gulp.task('watch', function() {

        // Watch .scss files
        gulp.watch('src/styles/**/*.scss', ['styles']);
      
        // Watch .js files
        gulp.watch('src/scripts/**/*.js', ['scripts']);
      
        // Watch image files
        gulp.watch('src/images/**/*', ['images']);

        livereload.listen();

        // Watch any files in dist/, reload on change
        gulp.watch(['dist/**']).on('change', livereload.changed);
            
    });