# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.1] - 2025-05-07

### Changed
- Updated TypeScript type definitions:
  - Fixed Babel plugins type definition from `Array<string | Array | Function>` to `Array<string | any[] | Function>` to properly reflect actual usage
  - Added PostCSSOptions interface for PostCSS configuration
  - Added type definitions for browser targets, stage levels, and features
  - Added autoprefixer and custom plugins type support

## [2.7.0] - 2025-04-16

### Added
- New `useAppendTransform` option for Babel configuration
  - Automatically transforms `Element.append()` calls to `Element.appendChild()` for older browsers
  - Handles both node elements and string content appropriately
  - Provides compatibility with browsers like Chrome 35 that don't support `append` method
  - Properly manages multiple arguments to `append` method
- Enhanced Babel plugin support with custom plugins option
  - Added support for custom Babel plugins through the `plugins` property
  - Allows specifying plugins as strings, arrays, or function references
  - Seamlessly integrates user plugins with built-in transformations

### Changed
- Improved Babel configuration handling by separating preset options from plugin options
- Enhanced error handling for plugin loading failures

## [2.6.0] - 2025-04-15

### Added
- New `useCssMap` option to enable source map generation for CSS files
  - Creates source maps for minified CSS files to aid debugging
  - Automatically generates `.css.map` files alongside minified CSS
  - Works with or without PostCSS transformation
  - Preserves original source information for easier style debugging
  - Integrates with browser developer tools for seamless inspection

### Changed
- Enhanced documentation to include CSS source map examples and usage

## [2.5.1] - 2025-03-26

### Fixed

- Fixed an issue where packages with dependencies were not being deployed together.

## [2.5.0] - 2025-03-25

### Added

- PostCSS integration for processing modern CSS features
  - Support for CSS nesting rules using the `&` selector
  - Process CSS variables (custom properties) for older browsers
  - Transform modern color functional notation to browser-compatible formats
  - Integration with postcss-preset-env for CSS feature level control
- New `usePostCSS` option for enabling and configuring PostCSS processing
  - Browser targets configuration
  - Feature stage level control
  - Selective feature enabling/disabling
  - Autoprefixer integration with customizable options

### Changed

- Enhanced CSS processing pipeline to include PostCSS transformation before minification
- Updated documentation with PostCSS examples and configuration options

## [2.4.0] - 2025-03-20

### Added

- New `useJsMap` option to enable source map generation for JavaScript files during minification
  - Helps with debugging by mapping minified code back to original source code
  - Automatically generates `.map` files alongside minified JavaScript files
  - Works with Babel transformation for complete source mapping support

## [2.3.3] - 2025-02-14

### Improved

- Reduced npm package size by removing unnecessary files (.vscode, logs, tests, config files)

## [2.3.2] - 2025-02-14

### Fixed

- Fixed JS image versioning to handle existing versions and use global hash

## [2.3.1] - 2025-02-13

### Fixed

- Fixed `ext is not defined` error in image versioning log messages

## [2.3.0] - 2025-02-13

### Added

- Image versioning system with content-based hashing for cache busting
  - Support for multiple image formats (PNG, JPEG, GIF, SVG, WebP, etc.)
  - Automatic hash generation for images in CSS files
  - Random hash generation for JS image references
  - Support for various image path formats including absolute, relative, data URIs
  - Complex CSS background and image-set() syntax support
- New `useVersioning` option with configurable file extensions
- Hash management system for tracking and updating image versions
- Comprehensive image path resolution and processing utilities

### Changed

- Enhanced documentation with detailed image versioning examples and configuration options
- Improved path resolution system to handle various image reference formats
- Updated logging system to track image versioning operations

## [2.2.4] - 2024-08-23

### Changed

- Updated `resolveBabelOptions` function to dynamically import `@babel/preset-env` using `resolveModulePath`
- Modified `minifyAll` function to handle the new asynchronous `resolveBabelOptions`

### Improved

- Enhanced flexibility in loading Babel presets, allowing for better compatibility with different environments

## [2.2.3] - 2024-08-23

### Improved

- Enhanced type definitions using JSDoc comments for better IDE support and code documentation
- Added more specific type definitions for JSMinifyOptions and CSSMinifyOptions
- Improved type annotations for function parameters and return types

## [2.2.2] - 2024-08-22

### Fixed

- `excludeFolder` option now correctly excludes files in deeply nested directories
- Resolved `@babel/preset-env` dependency issue by implementing dynamic import for `babel-core`

## [2.2.0] - 2024-08-21

### Added

- Customizable minification options for both JavaScript and CSS
- New `jsMinifyOptions` parameter to allow fine-tuning of JavaScript minification
- New `cssMinifyOptions` parameter to allow fine-tuning of CSS minification

### Changed

- Updated `minifyAll` function to accept and use new minification options
- Refactored `FILE_HANDLERS` to accommodate new options
- Updated documentation to reflect new customization capabilities

### Improved

- Enhanced flexibility in minification process, allowing users to tailor the process to their specific needs

## [2.1.0] - 2024-08-20

### Changed

- Logging Enhancements:
  Structured Log Levels: Implemented a new logging system with defined log levels (e.g., info, warn, error) to improve log readability and management.
  Date-based Log Files: Logs are now stored in files organized by date, making it easier to track and analyze logs over time.
- Type Generation:
  Introduced a new type generation feature to improve type safety and consistency across the application.

## [2.0.0] - 2024-08-19

### Added

- See Breaking Changes

### Changed

- Switched from CommonJS (`require`) to ES modules (`import`) for better compatibility with modern JavaScript
- Improved error handling and reporting, providing clearer messages for troubleshooting
- Enhanced CLI interface with more user-friendly options and feedback

### Improved

- Significantly faster processing of large directories with many files
- More robust handling of different file types and encodings
- Better preservation of source maps in minified files

### Breaking Changes

- Minimum Node.js version requirement increased to v14.0.0
- Configuration file format changed (see migration guide for details)
- Some CLI options have been renamed for clarity (see documentation for new option names)
- Support for ES modules, allowing use of `import` statements in your projects
- New logging system for better error tracking and debugging
- Optional Babel integration for advanced JavaScript transpilation

## [1.3.2] - 2023-05-28

### Added

- New `CHANGELOG.md` file

### Changed

- When CSS warnings exist, no code is minified (2022-04-13)
- Updated UglifyJS to remove 'console.info, console.warn, console.error' (2021-11-12)
- Updated UglifyJS to work without 'console.log' but keep console.error, info, etc. (2021-03-17)

### Fixed

- Bug fix (v1.1.7): Solved CleanCSS first line delete error (2020-08-21)
- Bug fix (v1.1.3): [Description missing] (2020-08-15)

## [1.3.1] - 2020-11-03

### Changed

- Updated UglifyJS to support minification of JavaScript files with ES6 syntax

## [1.3.0] - 2020-08-26

### Changed

- Moved DevDependencies to Dependencies for production use

## [1.2.0] - 2020-08-21

### Fixed

- Solved CleanCSS commentary issue due to changed CSS options

### Added

- Support for command line execution with 2 parameters

## [1.1.0] - 2020-08-20

### Added

- New `exceptFolder` parameter to exclude specific folders from minification
- Support for using relative paths
