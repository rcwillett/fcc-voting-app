var gulp = require("gulp");
var gutil = require("gulp-util");
var gulpConcat = require("gulp-concat");
var rename = require('gulp-rename');
var uglify = require("gulp-uglify");
var cleanCss = require("gulp-clean-css");

//Sources
var cssSources = ["./public/css/main.css", "./node_modules/bootstrap/dist/css/bootstrap.css"];
var jsSources = ["./node_modules/jquery/dist/jquery.js", "./node_modules/bootstrap/dist/js/bootstrap.js", "./node_modules/angular/angular.js", "./node_modules/angular-route/angular-route.js", "./node_modules/chart.js/dist/Chart.min.js", "./models/*.js", "./public/js/app/**/*.js", "./public/js/app/*.js"];

gulp.task("generateSiteCss", function(){
    gulp.src(cssSources)
    .pipe(gulpConcat("site.min.css").on('error', gutil.log))
    .pipe(cleanCss().on('error', gutil.log))
    .pipe(gulp.dest("./public/css/"));
});

gulp.task("generateSiteJs", function(){
    gulp.src(jsSources)
    .pipe(gulpConcat("site.js").on('error', gutil.log))
    .pipe(gulp.dest("./public/js/"))
    .pipe(uglify().on('error', gutil.log))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest("./public/js/"));
});

gulp.task("watch", function(){
    gulp.watch(cssSources, ["generateSiteCss"]);
    gulp.watch(jsSources, ["generateSiteJs"]);
});

gulp.task("default", ["generateSiteCss", "generateSiteJs", "watch"]);