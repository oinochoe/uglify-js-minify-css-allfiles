# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[2.1.0]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/compare/v1.3.2...v2.0.0
[1.3.2]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/oinochoe/uglify-js-minify-css-allfiles/compare/releases/tag/v1.1.0
