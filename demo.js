const minifyAll = require('./minify.js');
console.log(process.argv.slice(2)[0], process.argv.slice(2)[1]);
minifyAll(process.argv.slice(2)[0], process.argv.slice(2)[1]);
