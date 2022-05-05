
const gulp = require('gulp');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const minHTML = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var fs = require('fs');



// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

let globalStates = {
  currentDest: `${__dirname}`,
  fileDest: "",
  allFiles: [/* all files with destiniation will be storesd here as objects */],
  allFolders: [/* all folders with destiniation will be storesd here as objects */]
}

// Set all files in the global state array
function sendFileFolderToState(fileName, fileDest) {
  if (fileName.split(".")[1]) {
    globalStates.allFiles.push({
      file: fileName,
      dest: fileDest
    })
  } else {
    globalStates.allFolders.push({
      file: fileName,
      dest: fileDest
    })
  }
}
function setFiles(fileName) {
  let fileDest = globalStates.currentDest.split("/");
  fileDest = fileDest[fileDest.length - 1];

  sendFileFolderToState(fileName, fileDest)
}
function setInternalFiles(file) {
  sendFileFolderToState(file, globalStates.fileDest)
}

// extract files from folders and store them in files arr with their dest -=>
function extractAllFilesFromFolders(folderItem) {
  if (folderItem.file.split(".")[1]) {
    globalStates.allFiles.push(folderItem);
  } else {
    globalStates.currentDest = `${__dirname}/${folderItem.dest}/${folderItem.file}`;
    var folderContent = fs.readdirSync(`${globalStates.currentDest}`);
    globalStates.fileDest = `${folderItem.dest}/${folderItem.file}`
    folderContent.forEach(setInternalFiles);
  }
}
// loop throw folders arr -=> 
function loopThrowFolders() {
  let index = 0;
  let folderItem = globalStates.allFolders[index];
  while (folderItem) {
    extractAllFilesFromFolders(folderItem);
    index += 1;
    folderItem = globalStates.allFolders[index];
  }
}
// loop throw files arr -=>
function loopThrowFiles() {
  globalStates.allFiles.forEach(minifyHandlers)
}
// Get files and destinations -=>
function getFiles() {
  globalStates.currentDest = `${__dirname}/widget`;
  let files = fs.readdirSync(`${globalStates.currentDest}`);
  files.forEach(setFiles);

  globalStates.currentDest = `${__dirname}/control`;
  files = fs.readdirSync(`${globalStates.currentDest}`);
  files.forEach(setFiles);
}
// Function to minify all files with respect to extentions -=>
function minifyHandlers(file) {
  let extension = file.file.split(".")[1];
  switch (extension) {
    case "js":
      console.log("-- js", file.dest);
      break;
    case "css":
      console.log("-- css", file.dest);
      break;
    case "html":
      console.log("-- html", file.dest);
      break;
    default:
      console.log("-- image file", file.dest);
      break;
  }
}
// function to Minify our styles and set them back to the same directoty -=>
function setMinifyStyles() {
  // will minify styles here -=>
  return gulp.src('./widget/*.css')
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('./widget'))
}

function initGulp(cb) {
  // Here Our functionalities of gulp will be called --->
  getFiles();
  loopThrowFolders();

  loopThrowFiles();
  cb();
}

exports.default = initGulp;