const { changeFiles } = require('./module');

exports.contentsPath = './contentsProject/contents/';

(async function () {
    await changeFiles().catch((e) => console.log(e));
})();
