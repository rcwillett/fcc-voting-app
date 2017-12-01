var gulp = require("gulp");
var gutil = require("gulp-util");
var gulpConcat = require("gulp-concat");
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require("gulp-uglify");
var cleanCss = require("gulp-clean-css");
var sourceMaps = require("gulp-sourcemaps");

//Sources
var sassSources = ["./public/scss/site/site.scss", "./public/scss/bootstrap/bootstrap.scss"];
var sassFiles = ["./public/scss/**/*.scss", "./public/scss/**/**/*.scss"];
var jsSources = ["./models/*.js", "./public/js/app/**/*.js", "./public/js/app/*.js"];
var libraries = ["./node_modules/angular/*", "./node_modules/angular-route/*", "./node_modules/angular-toastr/*", "./node_modules/angular-toastr/**/*", "./node_modules/chart.js/dist/*"]

gulp.task("generateSiteCss", function() {
    gulp.src(sassSources)
        .pipe(sass().on('error', gutil.log))
        .pipe(gulp.dest("./public/css/"))
        .pipe(gulpConcat("styles.css").on('error', gutil.log))
        .pipe(gulp.dest("./public/css/"))
        .pipe(sourceMaps.init({ largeFile: true }))
        .pipe(cleanCss().on('error', gutil.log))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourceMaps.write("../maps"))
        .pipe(gulp.dest("./public/css/"));
});

gulp.task("generateSiteJs", function() {
    gulp.src(jsSources)
        .pipe(sourceMaps.init({ largeFile: true }))
        .pipe(gulpConcat("site.js").on('error', gutil.log))
        .pipe(gulp.dest("./public/js/"))
        .pipe(uglify().on('error', gutil.log))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourceMaps.write("../maps"))
        .pipe(gulp.dest("./public/js/"));
});

gulp.task("copyLibs", function(){
    gulp.src(libraries, {base:"node_modules"})
    .pipe(gulp.dest("./public/libs/"));
});

gulp.task("watch", function() {
    gulp.watch(sassFiles, ["generateSiteCss"]);
    gulp.watch(jsSources, ["generateSiteJs"]);
});

gulp.task("default", ["generateSiteCss", "generateSiteJs", "copyLibs", "watch"]);