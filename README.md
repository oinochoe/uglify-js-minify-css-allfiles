# uglify-js and minify-css allFiles

-   you will be able to minify all files as same file names which is js or css

## History

-   changed css option - solved cleancss commentary issue - 2020/08/21
-   bug fixed(1.1.7) - solved cleancss first line delete error - 2020/08/21
-   added command line execution with 2 parameters
-   added exceptFolder parameter - 2020/08/20
-   you can use relative path
-   bug fixed(1.1.3) - 2020/08/15

## Usage

```

npm install uglify-js-minify-css-allfiles

npm install clean-css uglify-js

or

yarn add clean-css uglify-js
```

```javascript
// index.js
const minifyAll = require('uglify-js-minify-css-allfiles');

// param1 : path you will change , param2 : folder or file name you want to take off
// (1)
minifyAll('../test/', 'lib');

// (2)
minifyAll(process.argv.slice(2)[0], process.argv.slice(2)[1]);
```

## Excute

```
(1)
node index.js

or

(2)
node index.js folderPath exceptionFolderPath
```
