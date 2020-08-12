const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');
const cleanCSS = require('clean-css');
const CONTENTSDIR = './contentsProject';
const SUPPORT = {
    JAVASCRIPT: 'js',
    STYLESHEET: 'css',
};

// directory 나 array에서 JS, CSS 모든 파일 가져오기
const getAllFiles = (pathDir, arrayFiles) => {
    files = fs.readdirSync(pathDir);
    allFiles = arrayFiles || [];

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
(async function changeFiles() {
    // 지원하는 파일 형식 파일만 할당
    await getAllFiles(CONTENTSDIR).forEach((file) => {
        let code = fs.readFileSync(file, 'utf-8');
        let result;
        if (file.includes(SUPPORT.JAVASCRIPT)) {
            result = uglifyJS.minify(code);
            fs.writeFile(file, result.code, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        } else if (file.includes(SUPPORT.STYLESHEET)) {
            result = new cleanCSS().minify(code);
            fs.writeFile(file, result.styles, function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
})();
