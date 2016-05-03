import gulp from 'gulp';
import gBabel from 'gulp-babel';

gulp.task('babel', () => {
    gulp.src('src/*.js')
        .pipe(gBabel({ presets: ['es2015'] }))
        .pipe(gulp.dest('src'));
});

gulp.task('default', ['babel']);