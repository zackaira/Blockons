const gulp = require("gulp");
const zip = require("gulp-zip");

function bundle() {
	return gulp
		.src([
			"**/*",
			"!node_modules/**",
			"!blocks/**",
			"!src/**",
			"!bundled/**",
			"!inc/**",
			"!gulpfile.js",
			"!package.json",
			"!package-lock.json",
			"!webpack.config.js",
			"!webpack.config.admin.js",
			"!.editorconfig",
			"!.gitignore",
		])
		.pipe(zip("blockons.zip"))
		.pipe(gulp.dest("bundled"));
}

exports.bundle = bundle;
