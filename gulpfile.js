/**
 * Gulp workflow for processing our files
 * @version 2.0.0
 */

import gulp from "gulp";
import terser from "gulp-terser";
import rename from "gulp-rename";

/**
 * Format our JS
 * @returns {*} Formatted JS in destination folder
 */
export function js() {
    return gulp
        .src("plvylist-component.js")
        .pipe(terser())
        .pipe(
            rename({
                suffix: ".min",
            })
        )
        .pipe(gulp.dest("./"));
}

const build = gulp.parallel(js);

export default build;
