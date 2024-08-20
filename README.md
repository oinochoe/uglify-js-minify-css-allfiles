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
-   [Parameters](#parameters)
-   [BabelOptions](#babeloptions)
-   [Changelog](#changelog)
-   [License](#license)

## Installation

Install with `npm`:

```bash
$ npm i uglify-js-minify-css-allfiles
```

## Usage

1. Basic usage (no Babel):

    ```js
    import minifyAll from 'uglify-js-minify-css-allfiles';

    await minifyAll('./src/', 'node_modules');
    ```

2. Using Babel with default settings:

    ```js
    import minifyAll from 'uglify-js-minify-css-allfiles';

    await minifyAll('./src/', 'node_modules', { useBabel: true });
    ```

3. Using custom Babel presets:

    ```js
    import minifyAll from 'uglify-js-minify-css-allfiles';

    await minifyAll('./src/', 'node_modules', {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        esmodules: false, // Target ES2015
                    },
                },
            ],
        ],
    });
    ```

## Parameters

The `minifyAll` function accepts the following parameters:

| Parameter       | Type           | Default | Description                                                                                  |
| --------------- | -------------- | ------- | -------------------------------------------------------------------------------------------- |
| `contentPath`   | string         | -       | The path to the directory containing the files to be minified. This is a required parameter. |
| `excludeFolder` | string         | `''`    | The name of a folder to exclude from minification. Leave empty to include all folders.       |
| `babelOptions`  | object or null | `null`  | An object containing Babel options or a flag to use default Babel settings.                  |

## BabelOptions

The `babelOptions` parameter can have the following properties:

| Property   | Type    | Default | Description                                                                                   |
| ---------- | ------- | ------- | --------------------------------------------------------------------------------------------- |
| `useBabel` | boolean | `false` | If set to `true`, enables Babel transformation with default presets targeting ES2015.         |
| `presets`  | array   | -       | Custom Babel presets to use for transformation. If provided, overrides the `useBabel` option. |

## Changelog

See CHANGELOG.md for details on each release.

[Changelog](/CHANGELOG.md)

## License

MIT. See [LICENSE.md](https://github.com/oinochoe/uglify-js-minify-css-allfiles/blob/master/LICENSE) for details.
