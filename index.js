const fs = require('fs');
const origin = 'origin';
const originSrc = fs
    .readdirSync(origin);
    .filter((file) => /\.css/.test(file))
    .map((files) => `${origin}/${files}`);
let html = '';

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
