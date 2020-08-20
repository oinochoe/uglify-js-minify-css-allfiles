const minifyAll = require('./minify.js');

minifyAll(process.argv.slice(2)[0], process.argv.slice(2)[1]);
