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
        if (file.includes(SUPPORT.JAVASCRIPT)) {
            try {
                fs.writeFile(file, uglifyJS.minify(code).code, function () {});
            } catch (error) {
                console.log(error);
            }
        } else if (file.includes(SUPPORT.STYLESHEET)) {
            try {
                fs.writeFile(file, new cleanCSS().minify(code).styles, function () {});
            } catch (error) {
                console.log(error);
            }
        }
    });
})();
