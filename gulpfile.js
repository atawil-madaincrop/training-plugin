
const gulp = require('gulp');
const concat = require('gulp-concat');
const htmlReplace = require('gulp-html-replace');
const minHTML = require('gulp-htmlmin');
// const imagemin = require('gulp-imagemin');
// const minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
var csso = require('gulp-csso');
// var del = require('del');
// var htmlmin = require('gulp-htmlmin');
// var runSequence = require('run-sequence');
// var uglify = require('gulp-uglify');
var uglify = require('gulp-uglify-es').default;
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
let version = new Date();
let globalStates = {
  includedControlsPointer: [],
  currentDest: `${__dirname}`,
  fileDest: "",
  allFiles: [/* all files with destiniation will be storesd here as objects */],
  allFolders: [/* all folders with destiniation will be storesd here as objects */],
  jsFilesManager: {
    /* array of objects to manage three types of js-files -> control, widget and common */
    common: [],
    control: [],
    widget: []
  }
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
// Function to sort arrays and set all of them ready to minify -=>
function sortHandler(a, b) {
  if (a.split('-handel')[1].split('.')[0] > b.split('-handel')[1].split('.')[0]) {
    return 1
  } else {
    return -1
  }
}
function sortArrays() {
  globalStates.jsFilesManager.widget.sort(sortHandler);
  globalStates.jsFilesManager.control.forEach(controlFolders => {
    controlFolders.items.sort(sortHandler);
  });
}
// Function to minify all files with respect to extentions -=>
function minifyHandlers(file) {
  let extension = file.file.split(".")[1];
  switch (extension) {
    case "js":
      jsManagement(file);
      break;
    case "css":
      setMinifyStyles(file.dest, file.file)
      break;
    case "html":
      setMinifyHTML(file.dest, file.file)
      break;
    default:
      setMinifyImages(file.dest, file.file)
      break;
  }
}
// function to Minify our styles and set them back to the same directoty -=>
function setMinifyStyles(dest, file) {
  // will minify styles here -=>
  return gulp.src(`./${dest}/${file}`)
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest(`./${dest}`))
}
// function to minify html files 
function setMinifyHTML(dest, file) {
  let mainDestination, sharedDestination;
  if (dest.includes("control")) {
    mainDestination = `../JS_Collection/${dest.split("/")[1]}`;
    sharedDestination = "../../widget/JS_Shared";
  } else {
    mainDestination = "./JS_Collection";
    sharedDestination = "./JS_Shared";
  }
  return gulp.src(`${dest}/${file}`)
    .pipe(htmlReplace({
      CommonJSFiles: `${sharedDestination}/scripts.min.js?v=${version}`
      , WidgetJSFiles: `${mainDestination}/scripts.min.js?v=${version}`
      , ControlJSFiles: `${mainDestination}/scripts.min.js?v=${version}`
    }))
    .pipe(minHTML({ removeComments: true, collapseWhitespace: true }))
    .pipe(gulp.dest(`./${dest}`));
}
function controlJSManagement(file) {
  // globalStates.jsFilesManager.control.push(`${file.dest}/${file.file}`)
  let headOfControl = file.dest.split("/")[1];
  if (globalStates.includedControlsPointer.includes(headOfControl)) {
    for (let i = 0; i < globalStates.jsFilesManager.control.length; i++) {
      if (globalStates.jsFilesManager.control[i].head == headOfControl) {
        globalStates.jsFilesManager.control[i].items.push(`${file.dest}/${file.file}`);
      }
    }
  } else {
    globalStates.includedControlsPointer.push(`${headOfControl}`);
    let newControlObj = {
      head: headOfControl,
      items: [`${file.dest}/${file.file}`]
    }
    globalStates.jsFilesManager.control.push(newControlObj);
  }
}
// function to minify JS files
function jsManagement(file) {
  if (file.dest.includes("control")) {
    controlJSManagement(file)
  } else if (file.dest.includes("common")) {
    globalStates.jsFilesManager.common.push(`${file.dest}/${file.file}`)
  } else {
    globalStates.jsFilesManager.widget.push(`${file.dest}/${file.file}`)
  }
}
function minify_JS_Handlers() {
  setMinifyJS(globalStates.jsFilesManager.common, `${__dirname}/widget/JS_Shared`);

  setMinifyJS(globalStates.jsFilesManager.widget, `${__dirname}/widget/JS_Collection`);
  globalStates.jsFilesManager.control.forEach(controlFolder => {
    setMinifyJS(controlFolder.items, `${__dirname}/control/JS_Collection/${controlFolder.head}`);
  })
}
function setMinifyJS(filesArr, destination) {
  console.log(filesArr);
  return gulp.src(filesArr)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .on('error', function (err) { console.log(err.toString()); })
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(destination));
}
// function to minify Images
function setMinifyImages(dest, file) {
  console.log("-- image file", file);
}

function initGulp(cb) {
  // Here Our functionalities of gulp will be called --->
  getFiles();
  loopThrowFolders();

  loopThrowFiles();

  sortArrays();

  minify_JS_Handlers();
  cb();
}

exports.default = initGulp;