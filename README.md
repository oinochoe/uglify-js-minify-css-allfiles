# uglify-js and minify-css allFiles

-   you will be able to minify all files as same file names which is js or css

## History

-   bug fixed(1.1.3) - 2020/08/15
-   you can use relative path
-   added exceptFolder parameter - 2020/08/20
-   added command line execution with 2 parameters

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

// Folder Name (you will change all files in Folders)
minifyAll('../test/', exceptFolder);
```

## Excute

```
node index.js

or

node index.js folderPath exceptionFolderPath
```
