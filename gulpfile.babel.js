import gulp from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import del from 'del';
import postcss from 'gulp-postcss';
import imageMin from 'gulp-imagemin';

const paths = {
  scripts: {
    src: 'src/js/*.js',
    dest: 'dist/js/'
  },
  css: {
    src: 'src/css/*.css',
    dest: 'dist/css/',
  },
  html: {
    src: 'src/**/*.html',
    dest: 'dist/',
  },
  images: {
    src: 'src/img/**/*',
    dest: 'dist/img/',
  },
};

// Task to clean /dist/ folder
const clean = () => del(['dist']);

// Tasks to build each individual part of the distribution package, and cumulative builder/compiler
function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
      .pipe(babel())
      .pipe(uglify())
      .pipe(concat('scripts.min.js'))
      .pipe(gulp.dest(paths.scripts.dest));
}

function css() {
  return gulp.src(paths.css.src, { sourcemaps: true })
      .pipe(postcss([
        require('tailwindcss'),
        require('autoprefixer'),
      ]))
      .pipe(gulp.dest(paths.css.dest));
}

function html() {
  return gulp.src(paths.html.src, { sourcemaps: true })
      .pipe(gulp.dest(paths.html.dest))
}

function images() {
  return gulp.src(paths.images.src)
      .pipe(imageMin())
      .pipe(gulp.dest(paths.images.dest))
}

const compile = gulp.parallel(scripts, css, html, images);

// Setup the BrowserSync server
import browserSync from 'browser-sync';
const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './dist/',
    },
  });
  done();
}

// Define watchers for each build component, and cumulative watcher
const watchScripts = () => gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
const watchCss = () => gulp.watch(paths.css.src, gulp.series(css, reload));
const watchHtml = () => gulp.watch(paths.html.src, gulp.series(html, reload));
const watchImages = () => gulp.watch(paths.images.src, gulp.series(images, reload));

const watch = gulp.parallel(watchScripts, watchCss, watchHtml);

// Default Task
const defaultTasks = gulp.series(clean, compile, serve, watch);

// Export named tasks
export { 
  clean, 
  scripts, 
  css, 
  html,
  compile,
  images,
}

export default defaultTasks