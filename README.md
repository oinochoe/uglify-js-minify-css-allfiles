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

A powerful tool to minify and obfuscate JavaScript and CSS files in your project.  
It helps protect your code in deployment environments and makes it less recognizable to others, all through a simple CLI interface.  
You can easily minify all files in a specific folder, with the option to exclude certain directories.

[![NPM](https://nodei.co/npm/uglify-js-minify-css-allfiles.png?downloads=true&stars=true)](https://www.npmjs.com/package/uglify-js-minify-css-allfiles)

---

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Changelog](#changelog)
-   [License](#license)

## Installation

Install with `npm`:

```bash
$ npm i uglify-js-minify-css-allfiles
```

## Usage

Import the module in your script:

```js
import minifyAll from './dist/module.js';

/**
 * @param {string} minifyFolder - The folder containing files to minify.
 * @param {string} [excludeFolder] - The folder to exclude from minification (optional).
 */

minifyAll(minifyFolder, excludeFolder);
```

Execute script:

```js
import minifyAll from 'uglify-js-minify-css-allfiles';

// Example 1: Minify all files in '../test/' except those in 'lib' folder
minifyAll('../test/', 'lib');

// Example 2: Use command line arguments
minifyAll(process.argv[2], process.argv[3]);
```

## Changelog

See CHANGELOG.md for details on each release.

[Changelog](/CHANGELOG.md)

## License

MIT. See [LICENSE.md](https://github.com/oinochoe/uglify-js-minify-css-allfiles/blob/master/LICENSE) for details.
