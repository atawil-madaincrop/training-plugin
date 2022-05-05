const gulp = require('gulp');
const del = require('del');
const minHTML = require('gulp-htmlmin');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

let version = new Date().getTime();
const destinationFolder = releaseFolder();

function releaseFolder() {
    var arr = __dirname.split("/");
    var fldr = arr.pop();
    arr.push(fldr + "_release");
    return arr.join("/");
}

console.log(">> Building to ", destinationFolder);

gulp.task('lint', () => {
    return gulp.src(['widget/**/*.js', 'control/**/*.js'])
        .pipe(eslint({
            "env": {
                "browser": true,
                "es6": true,
            },
            "parser": "@babel/eslint-parser",
            "extends": "eslint:recommended",
            "parserOptions": {
                "requireConfigFile": false,
                "sourceType": "module",
            },
            "rules": {
                "semi": [
                    "error",
                    "always"
                ],
                "no-console": [
                    "off"
                ]
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

const cssTasks = [
    { name: "widgetCSS", src: "widget/**/*.css", dest: "/widget" }
    , { name: "controlContentCSS", src: "control/content/**/*.css", dest: "/control/content" }
    , { name: "controlIntroductionCSS", src: "control/introduction/**/*.css", dest: "/control/introduction" }
    , { name: "controlLanguageCSS", src: "control/language/**/*.css", dest: "/control/language" }
    , { name: "controlTestsCSS", src: "control/tests/**/*.css", dest: "/control/tests" }
];

cssTasks.forEach(function (task) {
    gulp.task(task.name, function () {
        return gulp.src(task.src, { base: '.' })
            .pipe(minifyCSS())
            .pipe(concat('styles.min.css'))
            .pipe(gulp.dest(destinationFolder + task.dest))
    });
});

gulp.task("sharedJS", function () {
    return gulp.src(["widget/js/shared/**/*.js"], { base: '.' })
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.shared-min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destinationFolder + "/widget"));
});

const jsTasks = [
    { name: "widgetJS", src: "widget/js/*.js", dest: "/widget" },
    {
        name: "controlContentJS",
        src: [
            "control/content/js/searchTableConfig.js",
            "control/content/js/searchTableHelper.js",
            "control/content/js/content.controller.js",
            "control/content/js/content.js",
        ],
        dest: "/control/content",
    },
    { name: "controlIntroductionJS", src: "control/introduction/js/*.js", dest: "/control/introduction" },
    { name: "controlLanguageJS", src: "control/language/js/*.js", dest: "/control/language" },
    { name: "controlTestsJS", src: "control/tests/js/*.js", dest: "/control/tests" },
];

jsTasks.forEach(function (task) {
    gulp.task(task.name, function () {
        return gulp.src(task.src, { base: '.' })
            .pipe(sourcemaps.init())
            .pipe(concat('scripts-min.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(destinationFolder + task.dest));
    });
});

gulp.task('clean', function () {
    return del([destinationFolder], { force: true });
});

gulp.task('controlHTML', function () {
    return gulp.src(['control/**/*.html'], { base: '.' })
        .pipe(htmlReplace({
            bundleSharedJSFiles: "../../widget/scripts.shared-min.js?v=" + version
            , bundleJSFiles: "scripts-min.js?v=" + version
            , bundleCSSFiles: "styles.min.css?v=" + version
            , bundleControlBFMinJS: "../../../../scripts/buildfire.min.js"
            , bundleWidgetBFMinJS: "../../../scripts/buildfire.min.js"
            //data, data access, tests and analytics
            , bundleDataJSFiles: "../../data/scripts-min.js?v=" + version
            , bundleTestsJSFiles: "../../tests/scripts-min.js?v=" + version
        }))
        .pipe(minHTML({ removeComments: true, collapseWhitespace: true }))
        .pipe(gulp.dest(destinationFolder));
});

gulp.task('widgetHTML', function () {
    return gulp.src(['widget/*.html'], { base: '.' })
        .pipe(htmlReplace({
            bundleSharedJSFiles: "scripts.shared-min.js?v=" + version
            , bundleJSFiles: "scripts-min.js?v=" + version
            , bundleCSSFiles: "styles.min.css?v=" + version
            //data, data access and tests
            , bundleDataJSFiles: "../../data/scripts-min.js?v=" + version
            , bundleTestsJSFiles: "../../tests/scripts-min.js?v=" + version
        }))
        .pipe(minHTML({ removeComments: true, collapseWhitespace: true }))
        .pipe(gulp.dest(destinationFolder));
});

gulp.task('resources', function () {
    return gulp.src(['resources/*', 'plugin.json'], { base: '.' })
        .pipe(gulp.dest(destinationFolder));
});

gulp.task('images', function () {
    return gulp.src(['**/.images/**'], { base: '.' })
        .pipe(imagemin())
        .pipe(gulp.dest(destinationFolder));
});

var buildTasksToRun = ['controlHTML', 'widgetHTML', 'resources', 'images', 'sharedJS'];

cssTasks.forEach(function (task) { buildTasksToRun.push(task.name) });
jsTasks.forEach(function (task) { buildTasksToRun.push(task.name) });

gulp.task('build', gulp.series('lint', 'clean', ...buildTasksToRun));
