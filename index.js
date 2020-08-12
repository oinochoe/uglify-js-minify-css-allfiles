const fs = require('fs');
const path = require('path');
const contentsDir = './contentsProject';
const supportExtensions = '*.js, *.css';

// getAllFiles
const getAllFiles = (pathDir, arrayFiles) => {
    files = fs.readdirSync(pathDir);
    allFiles = arrayFiles || [];

    files.forEach((file) => {
        if (fs.statSync(pathDir + '/' + file).isDirectory()) {
            allFiles = getAllFiles(pathDir + '/' + file, allFiles);
        } else {
            allFiles.push(path.join(__dirname, pathDir, '/', file));
        }
    });

    return allFiles;
};

getAllFiles(contentsDir);
/* let html = '';

for (let index = 0; index < originSrc.length; index++) {
    readFiles().then(function (resolveData) {
        console.log('dd');
    });

    function readFiles() {
        return new Promise(function (resolve, reject) {
            fs.readFile(originSrc[index], 'utf8', (error, data) => {
                if (error) throw error;
                console.log('읽기 완료');
                html = data;
                resolve(html);
            });
        });
    }
}
 */
