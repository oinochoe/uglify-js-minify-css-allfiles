[![NPM downloads][npm-downloads]][npm-url]
[![NPM total downloads][npm-total-downloads]][npm-url]

| &nbsp;<br>[![Donate][donate-badge]][donate-url] <br>&nbsp; | Your help is appreciated! [Create a PR][create-pr] or just [buy me a coffee][donate-url] |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------- |

[npm-url]: https://www.npmjs.com/package/uglify-js-minify-css-allfiles
[npm-downloads]: https://img.shields.io/npm/dm/uglify-js-minify-css-allfiles.svg
[npm-total-downloads]: https://img.shields.io/npm/dt/uglify-js-minify-css-allfiles.svg?label=total+downloads
[donate-badge]: https://img.shields.io/badge/Buy%20me%20a%20coffee-Donate-red.svg
[donate-url]: https://github.com/sponsors/oinochoe
[create-pr]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/pulls

# uglify-js-minify-css-allfiles

uglify-js-minify-css-allfiles helps hide the code you don't want to see, obfuscate the code in the deployment environment through a simple CLI in the build environment, and make it less recognizable to others. you can do this easily via `demo.js` file in `node_modules/uglify-js-minify-css-allfiles`. you are able to minify all files in a specific folder.

[![NPM](https://nodei.co/npm/uglify-js-minify-css-allfiles.png?downloads=true&stars=true)](https://www.npmjs.com/package/uglify-js-minify-css-allfiles)

---

## Table of Contents

-   [Installation](#installation)
-   [Examples](#examples)
-   [Changelog](#changelog)
-   [License](#license)
<!-- -   [API](#api)
    -   [`Methods`](#methods) -->

## Installation

Install with `npm`:

```bash
$ npm i uglify-js-minify-css-allfiles
```

## Examples

```js
// index.js
const minifyAll = require('uglify-js-minify-css-allfiles');

/**
 * @param1 - Type the folder name you want to change all files inside.
 * @param2 - Type the folder name you never want to change all files inside.
 * @functions - minifyAll(minifyFolder, noMinifyFolder)
 */

// Example 1
minifyAll('../test/', 'lib');

// Example 2
minifyAll(process.argv.slice(2)[0], process.argv.slice(2)[1]);
```

<!--
## API

### `Methods`

Create a new progress bar. It's necessary to wait for the [`ready` event](https://github.com/electron/electron/blob/master/docs/api/app.md#event-ready) to be emitted by [Electron's BrowserWindow](https://github.com/electron/electron/blob/master/docs/api/browser-window.md), since the progress bar is displayed within it. Optionally, you can pass the electron app as a second parameter (parameter `electronApp`) when creating the progress bar. Check the sample code on this page for detailed examples on how to set properties to `options`.

You can define most of the characteristics of the progress bar using the `options` parameter. Below is a list of properties that you can set for the `options` parameter.

| Option name  | Type                 | Default value      | Description                                                                                                                                                                                                            |
| ------------ | -------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| debug        | <code>boolean</code> | <code>false</code> | Specifies whether debugging should be enabled. If set to `true`, the browser's DevTools panel will automatically open when the progress bar is created. This can be helpful when debugging and/or dealing with issues. |
| abortOnError | <code>boolean</code> | <code>false</code> | Specifies whether the progress bar should automatically abort and close if an error occurs internally.                                                                                                                 | -->

---

## Changelog

[Changelog](/CHANGELOG.md)

## License

MIT. See [LICENSE.md](https://github.com/oinochoe/uglify-js-minify-css-allfiles/blob/master/LICENSE) for details.
