# uglify-js-minify-css-allfiles

A powerful tool to minify and obfuscate JavaScript and CSS files in your project.  
It helps protect your code in deployment environments and makes it less recognizable to others, all through a simple CLI interface.  
You can easily minify all files in a specific folder, with the option to exclude certain directories.

[![NPM downloads][npm-downloads]][npm-url]
[![NPM total downloads][npm-total-downloads]][npm-url]
[![NPM](https://nodei.co/npm/uglify-js-minify-css-allfiles.png?downloads=true&stars=true)](https://www.npmjs.com/package/uglify-js-minify-css-allfiles)

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [Parameters](#parameters)
- [Options](#options)
- [Advanced Features](#advanced-features)
  - [Babel Integration](#babel-integration)
  - [Image Versioning](#image-versioning)
  - [Logging System](#logging-system)
- [API Reference](#api-reference)
- [Minification Options](#minification-options)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🚀 JavaScript and CSS minification with advanced options
- 📦 Babel transformation support for modern JavaScript
- 🖼️ Automatic image versioning and cache busting
- 📝 Comprehensive logging system
- 🛡️ Configurable file exclusion
- 🔄 ES module support
- 📊 Processing statistics and summaries

## Installation

Install with `npm`:

```bash
$ npm i uglify-js-minify-css-allfiles
```

## Usage

### Basic Usage

```js
import minifyAll from 'uglify-js-minify-css-allfiles';

await minifyAll('./src/');
```

### Advanced Usage

```js
import minifyAll from 'uglify-js-minify-css-allfiles';

await minifyAll('./src/', {
  excludeFolder: 'node_modules',
  useBabel: {
    targets: 'chrome 40',
    modules: false,
    useBuiltIns: 'usage',
    corejs: 3,
  },
  useLog: {
    logDir: 'logs',
    retentionDays: 30,
    logLevel: 'info',
    dateFormat: 'YYYY-MM-DD',
    timeZone: 'UTC',
    logToConsole: true,
    logToFile: true,
  },
  jsMinifyOptions: {
    compress: {
      dead_code: true,
      drop_debugger: true,
      pure_funcs: ['console.log'],
      conditionals: true,
      evaluate: true,
      unused: true,
    },
    mangle: true,
  },
  cssMinifyOptions: {
    level: 2,
  },
  useVersioning: {
    extensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
  },
});
```

## Advanced Features

### Babel Integration

Built-in Babel support for modern JavaScript transpilation:

- Configurable target environments
- Module transformation options
- Built-ins and CoreJS integration
- Customizable plugin/preset options

```js
await minifyAll('./src/', {
  useBabel: {
    targets: 'chrome 40',
    modules: false,
    useBuiltIns: 'usage',
    corejs: 3,
  },
});
```

### Image Versioning

Automatic versioning for image references in JS and CSS files:

- Content-based hashing for images in CSS files
- Random hash generation for JS image references
- Support for multiple image formats (PNG, JPEG, GIF, SVG, WebP, etc.)
- Handles various image path formats:
  - Complex CSS background declarations
  - image-set() syntax support

```js
await minifyAll('./src/', {
  useVersioning: {
    extensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
  },
});
```

### Logging System

Comprehensive logging capabilities:

- Multiple log levels (error, warn, info, debug)
- File rotation with retention policies
- Customizable date formats and timezones
- Console and file output options
- Processing statistics and summaries

```js
await minifyAll('./src/', {
  useLog: {
    logDir: 'logs',
    retentionDays: 30,
    logLevel: 'info',
    dateFormat: 'YYYY-MM-DD',
    timeZone: 'UTC',
    logToConsole: true,
    logToFile: true,
  },
});
```

## API Reference

### minifyAll(contentPath, options)

Main function to process files.

- `contentPath` (string): Source directory path
- `options` (object): Configuration options
  - `excludeFolder` (string): Directory to exclude
  - `useBabel` (boolean|object): Babel configuration
  - `useLog` (boolean|object): Logging configuration
  - `jsMinifyOptions` (object): JavaScript minification options
  - `cssMinifyOptions` (object): CSS minification options
  - `useVersioning` (object): Image versioning configuration
    - `extensions` (string[]): List of image extensions to version

### Babel Options

The `useBabel` object supports all @babel/preset-env options:

```js
{
  targets: string | string[] | Object,
  modules: 'amd' | 'umd' | 'systemjs' | 'commonjs' | false,
  debug: boolean,
  include: string[],
  exclude: string[],
  useBuiltIns: 'usage' | 'entry' | false,
  corejs: 2 | 3 | { version: 2 | 3, proposals: boolean },
  forceAllTransforms: boolean,
  configPath: string,
  ignoreBrowserslistConfig: boolean,
  shippedProposals: boolean
}
```

### JavaScript Minification Options

Supports all UglifyJS options:

```js
{
  compress: {
    dead_code: boolean,
    drop_debugger: boolean,
    pure_funcs: string[],
    conditionals: boolean,
    evaluate: boolean,
    booleans: boolean,
    loops: boolean,
    unused: boolean,
    if_return: boolean,
    join_vars: boolean,
    cascade: boolean,
    side_effects: boolean
  },
  mangle: boolean | Object,
  output: {
    beautify: boolean,
    comments: boolean | 'all' | 'some' | RegExp
  }
}
```

### CSS Minification Options

Supports Clean-CSS options:

```js
{
  level: 0 | 1 | 2 | {
    1: {
      all: boolean,
      specialComments: boolean | string
    },
    2: {
      mergeSemantically: boolean,
      restructureRules: boolean
    }
  },
  compatibility: string | string[],
  format: string | Object
}
```

## Contributing

Your help is appreciated! [Create a PR][create-pr] or just [buy me a coffee][donate-url]

## License

MIT. See [LICENSE.md](https://github.com/oinochoe/uglify-js-minify-css-allfiles/blob/master/LICENSE) for details.

[npm-url]: https://www.npmjs.com/package/uglify-js-minify-css-allfiles
[npm-downloads]: https://img.shields.io/npm/dm/uglify-js-minify-css-allfiles.svg
[npm-total-downloads]: https://img.shields.io/npm/dt/uglify-js-minify-css-allfiles.svg?label=total+downloads
[donate-badge]: https://img.shields.io/badge/Buy%20me%20a%20coffee-Donate-red.svg
[donate-url]: https://github.com/sponsors/oinochoe
[create-pr]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/pulls
