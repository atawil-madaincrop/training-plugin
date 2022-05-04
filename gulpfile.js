
const gulp = require('gulp');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const minHTML = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');


// just test function to checek our gulp and understand it clearly
function logger(){
    console.log("calling function will be done ^_*");
}

function initGulp(cb) {
    // Here Our functionalities of gulp will be called --->
    logger()
    cb();
}

exports.default = initGulp;