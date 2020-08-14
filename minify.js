module.exports = require('./module');

(async function () {
    await changeFiles().catch((e) => console.log(e));
})();
