const gulp        = require('gulp'),
      browserSync = require('browser-sync'),
      concat      = require('gulp-concat'),
      rename      = require('gulp-rename'),
      uglify      = require('gulp-uglify');

// Compile CSS Files
gulp.task('css', function () {
  const postcss = require('gulp-postcss')

  return gulp.src('src/css/styles.css')
    // ...
    .pipe(postcss([
      // ...
      require('tailwindcss'),
      require('autoprefixer'),
      // ...
    ]))
    // ...
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Compile HTML Files
gulp.task('html', function() {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// Compile JS files
var jsFiles = 'src/js/**/*.js',  
    jsDest = 'dist/js';

gulp.task('scripts', function() {  
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest))
        .pipe(browserSync.reload({
          stream: true
        }));
});

// Spin up a server
gulp.task("browserSync", function() {
  browserSync({
    server: {
      baseDir: "dist"
    }
  })
});

// Live reload anytime a file changes
gulp.task("watch", gulp.parallel("browserSync", "css", "scripts", "html"), function() {
  gulp.watch("src/css/**/*.css", ["css"]);
  gulp.watch("src/js/**/*.js", ["scripts"]);
  gulp.watch("dist/*.html", ["html"]).on("change", browserSync.reload);
});

// Compiles all gulp tasks
gulp.task('default', gulp.parallel('html', 'css', 'scripts'));