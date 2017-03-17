var gulp = require('gulp'),
    watch = require('gulp-watch'),
    browserSync = require("browser-sync"),
    prefixer = require('gulp-autoprefixer'),
    stylus = require('gulp-stylus'),
    jade = require('gulp-jade'),
    cleancss = require('gulp-clean-css'),
    notify = require("gulp-notify"),
    cache = require('gulp-cached'),
    reload = browserSync.reload,
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    environment = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development',
    sourcemaps = require('gulp-sourcemaps');

var path = {
    build: {
        html: 'build/html',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/image/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/jade/*.jade',
        js: 'src/js/main.js',
        style: 'src/style/main.styl',
        img: 'src/image/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.jade',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.styl',
        img: 'src/image/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build",
        index: "index.html"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Building::",

};

gulp.task('html:build', function () {
    var YOUR_LOCALS = {};
    gulp.src(path.src.html)
        .pipe(cache('jading...'))
        .pipe(jade({locals: YOUR_LOCALS, pretty: true}))
        .on('error', notify.onError(function (err) {
            return {
                title: 'Jade',
                message: err.message
            };
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true})); 
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js)) 
        .pipe(reload({stream: true})); 
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(gulpif( environment == 'development' ,sourcemaps.init()))
        .pipe(stylus({'include css': true}))
        .on('error', notify.onError(function (err) {
            return {
                title: 'Stylus',
                message: err.message
            };
        }))
        .pipe(prefixer({
            browsers: ['last 4 versions','> 1%','Android 4.4','ios_saf >=7']
        }))
        .pipe(cleancss())
        .pipe(gulpif( environment == 'development' , sourcemaps.write('./source_maps')))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img));
});

gulp.task('compress-images', function(){
    return gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: false,
            optimizationLevel: 7
        }))
        .pipe(gulp.dest('build/image/'));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function () {
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', ['build', 'webserver', 'watch']);