# Ugly-Code

-   you will be able to minify all files as same file names which is js or css
-   you are able to minify all files in a specific folder.
-   you can do this easily via `demo.js` file in `node_modules/uglify-js-minify-css-allfiles`
-   if you have a question or some problem, contact me anywhen.
-   please email me copstyle86@gmail.com or use github issue tab.

## History
-   When Css Warnings is exist, not minify any code - 2022/04/13
-   UglifyJS Updated removing 'console.info, console.warn, console.error'. - 2021/11/12
-   UglifyJS Updated working without 'console.log' not console.error, info etc. - 2021/03/17
-   UglifyJS Updated and you can uglify js even es6 sentences! - 2020/11/03
-   DevDependencies to Dependencies for this production - 2020/08/26
-   changed css option - solved cleancss commentary issue - 2020/08/21
-   bug fixed(1.1.7) - solved cleancss first line delete error - 2020/08/21
-   added command line execution with 2 parameters
-   added exceptFolder parameter - 2020/08/20
-   you can use relative path
-   bug fixed(1.1.3) - 2020/08/15

## Usage

```

npm install uglify-js-minify-css-allfiles

or

yarn add uglify-js-minify-css-allfiles
```

```javascript
// index.js
const minifyAll = require('uglify-js-minify-css-allfiles');

// param1 : Type a path you will change all files inside this path
// param2 : folder or file name you want to take off
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
<!-- 
<a href="https://www.buymeacoffee.com/eYs1lFK" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a> -->