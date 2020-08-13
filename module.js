const contentsPath = require('./minify.js');
const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');
const cleanCSS = require('clean-css');
const SUPPORT = {
    JAVASCRIPT: 'js',
    STYLESHEET: 'css',
};
let errorFilesNumber = 0;

// directory 나 array에서 JS, CSS 모든 파일 가져오기
const getAllFiles = (pathDir, arrayFiles) => {
    let files = fs.readdirSync(pathDir);
    let allFiles = arrayFiles || [];
    files.forEach((file) => {
        if (fs.statSync(pathDir + '/' + file).isDirectory()) {
            allFiles = getAllFiles(pathDir + '/' + file, allFiles);
        } else {
            if (file.includes(SUPPORT.JAVASCRIPT) || file.includes(SUPPORT.STYLESHEET)) {
                allFiles.push(path.join(__dirname, pathDir, '/', file));
            }
        }
    });
    return allFiles;
};

// 변경
async function changeFiles() {
    let CONTENTSDIR = contentsPath.contentsPath;
    const fileArray = (await getAllFiles(CONTENTSDIR)) || [];
    if (fileArray == undefined || fileArray.length < 1) return;
    // 지원하는 파일 형식 파일만 할당
    await getAllFiles(CONTENTSDIR).forEach((file) => {
        let code = fs.readFileSync(file, 'utf-8');
        let result = '';
        if (file.includes(SUPPORT.JAVASCRIPT)) {
            result = uglifyJS.minify(code).code;
            writeFiles(file, result);
        } else if (file.includes(SUPPORT.STYLESHEET)) {
            result = new cleanCSS().minify(code).styles;
            writeFiles(file, result);
        }
    });

    function writeFiles(file, result) {
        console.log(file);
        if (typeof result == 'undefined' || result === '' || result === null) {
            console.error('************error file*********** :  \n' + file);
            errorFilesNumber += 1;
            return;
        } else {
            fs.writeFile(file, result, 'utf-8', function (error) {
                if (error) return console.log(error);
            });
        }
    }

    console.log('file change ended... errorFilesNumber : ' + errorFilesNumber);
}
exports.changeFiles = changeFiles;
