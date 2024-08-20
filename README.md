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

- [Installation](#installation)
- [Usage](#usage)
- [Parameters](#parameters)
- [Options](#options)
- [Changelog](#changelog)
- [License](#license)

## Installation

Install with `npm`:

```bash
$ npm i uglify-js-minify-css-allfiles
```

## Usage

1. Basic usage (no Babel):

   ```js
   import minifyAll from 'uglify-js-minify-css-allfiles';

   await minifyAll('./src/');
   ```

2. Using options:

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
   });
   ```

3. Using Babel and custom logging options:

   ```js
   import minifyAll from 'uglify-js-minify-css-allfiles';

   await minifyAll('./src/', {
     useBabel: { targets: 'chrome 40' },
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

## Parameters

The `minifyAll` function accepts the following parameters:

| Parameter     | Type   | Default | Description                                                                                  |
| ------------- | ------ | ------- | -------------------------------------------------------------------------------------------- |
| `contentPath` | string | -       | The path to the directory containing the files to be minified. This is a required parameter. |
| `options`     | object | `{}`    | An object containing options for minification, Babel, and logging.                           |

## Options

The `options` object can have the following properties:

| Property        | Type              | Default | Description                                                                                |
| --------------- | ----------------- | ------- | ------------------------------------------------------------------------------------------ |
| `excludeFolder` | string            | `''`    | The name of a folder to exclude from minification.                                         |
| `useBabel`      | boolean \| object | `false` | If `true`, enables Babel with default settings. If an object, specifies Babel options.     |
| `useLog`        | boolean \| object | `true`  | If `true`, enables logging with default settings. If an object, specifies logging options. |

### Babel Options

When `useBabel` is an object, it can have the following properties:

| Property                              | Type                        | Description                                                                                               |
| ------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| `targets`                             | string \| object            | Specifies the target environments.                                                                        |
| `modules`                             | string \| false             | Enables transformation of ES6 module syntax to another module type.                                       |
| `useBuiltIns`                         | 'usage' \| 'entry' \| false | Configures how babel-preset-env handles polyfills.                                                        |
| `corejs`                              | number \| object            | Specifies the core-js version.                                                                            |
| ... (other @babel/preset-env options) | Various                     | Refer to [@babel/preset-env documentation](https://babeljs.io/docs/en/babel-preset-env) for more options. |

### Log Options

When `useLog` is an object, it can have the following properties:

| Property        | Type    | Default        | Description                                                           |
| --------------- | ------- | -------------- | --------------------------------------------------------------------- |
| `logDir`        | string  | `'logs'`       | Specifies the directory for log files.                                |
| `retentionDays` | number  | 30             | Number of days to retain log files.                                   |
| `logLevel`      | string  | `'info'`       | Specifies the level of logging (e.g., `'info'`, `'warn'`, `'error'`). |
| `dateFormat`    | string  | `'YYYY-MM-DD'` | Format for the date in log entries.                                   |
| `timeZone`      | string  | `'UTC'`        | Time zone for timestamps in log entries.                              |
| `logToConsole`  | boolean | `true`         | Determines if logs should also be output to the console.              |
| `logToFile`     | boolean | `true`         | Determines if logs should be written to a file.                       |

## Changelog

See CHANGELOG.md for details on each release.

[Changelog](/CHANGELOG.md)

## License

MIT. See [LICENSE.md](https://github.com/oinochoe/uglify-js-minify-css-allfiles/blob/master/LICENSE) for details.
