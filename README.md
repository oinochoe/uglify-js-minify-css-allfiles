# uglify-js and minify-css allFiles

-   you will be able to minify all files as same file names which is js or css

## if you use Windows OS

```
just run minify.bat

or

node minify.js
```

## Others

```
node minify.js
```

## Usage

```
const { changeFiles } = require('./module');

exports.contentsPath = './contentsProject/contents/';

(async function () {
    await changeFiles().catch((e) => console.log(e));
})();

```