const gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var cleanCSS = require("gulp-clean-css");
gulp.task('sass', function (done) {
    // stream
    gulp.src('public/asset/style/*.scss') //タスクで処理するソースの指定
        .pipe(sass()) //処理させるモジュールを指定
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/asset/style/')); //保存先を指定
    console.log('sass compile');
    done();
});
gulp.task('watch', function (done) {
    gulp.watch('public/asset/style/*.scss', gulp.task('sass'));
    console.log('watch start');
    done();
});
//defaultタスクは、タスク名を指定しなかったときに実行されるタスクです。
gulp.task('default', gulp.task('sass'));
