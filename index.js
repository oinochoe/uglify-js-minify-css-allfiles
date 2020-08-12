const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');
const CONTENTSDIR = './contentsProject';
const SUPPORT = {
    JAVASCRIPT: 'js',
    STYLESHEET: 'css',
};
/* var cacheFileName = '/tmp/cache.json';
var options = {
    mangle: {
        properties: true,
    },
    nameCache: JSON.parse(fs.readFileSync(cacheFileName, 'utf8')),
}; */
// directory 나 array에서 모든 파일 가져오기
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

// 지원하는 파일 형식 파일만 할당
const setSupportFiles = getAllFiles(CONTENTSDIR);
console.log(setSupportFiles);

// 변경
/* setSupportFiles.forEach((file) => {
    fs.writeFileSync(
        file.split('/').pop(),
        UglifyJS.minify(fs.readFileSync(file.split('/').pop()), 'utf8'),
    );
    fs.writeFileSync(cacheFileName, JSON.stringify(options.nameCache), 'utf8');
}); */
