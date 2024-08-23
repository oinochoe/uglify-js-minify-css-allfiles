/**
 * uglify-js and minify-css for all files
 * Released under the terms of MIT license
 * Copyright (C) 2024 yeongmin
 */

import { promises as fs } from 'fs';
import path from 'path';
import Logger from './modules/logger.js';
import { getAllFiles, writeFile } from './modules/fileHandler.js';
import { minifyJS, minifyCSS } from './modules/minifier.js';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves the path of a module.
 * @param {string} moduleName - The name of the module to resolve.
 * @returns {string} The resolved module path as a URL.
 */
function resolveModulePath(moduleName) {
  const modulePath = require.resolve(moduleName, { paths: [__dirname] });
  return pathToFileURL(modulePath).href;
}

/**
 * @typedef {Object} FileHandlerOptions
 * @property {BabelOptions} [babelOptions] - Babel transformation options.
 * @property {JSMinifyOptions} [jsMinifyOptions] - JavaScript minification options.
 * @property {CSSMinifyOptions} [cssMinifyOptions] - CSS minification options.
 */

/**
 * @callback FileHandler
 * @param {string} filePath - The path of the file to process.
 * @param {string} content - The content of the file.
 * @param {Logger} logger - The logger instance.
 * @param {FileHandlerOptions} options - Options for processing.
 * @returns {Promise<void>}
 */

/**
 * Object containing handlers for different file types.
 * @type {Object.<string, FileHandler>}
 */
const FILE_HANDLERS = {
  '.js': async (filePath, content, logger, options) => {
    try {
      let transformed = content;
      if (options.babelOptions) {
        const babelCoreUrl = resolveModulePath('@babel/core');
        const { transformSync } = await import(babelCoreUrl);
        transformed = transformSync(content, options.babelOptions).code;
      }
      const result = minifyJS(transformed, options.jsMinifyOptions);
      await writeFile(filePath, result, logger);
    } catch (error) {
      await logger?.error('JavaScript minification failed', { filePath, error: error.message });
    }
  },
  '.css': async (filePath, content, logger, options) => {
    try {
      const output = await minifyCSS(content, options.cssMinifyOptions);
      if (0 < output.warnings.length) {
        await logger?.warn('CSS minification warnings', { filePath, warnings: output.warnings });
      }
      await writeFile(filePath, output.styles, logger);
    } catch (error) {
      await logger?.error('CSS minification failed', { filePath, error: error.message });
    }
  },
};

/**
 * Processes a single file based on its extension.
 * @async
 * @param {string} filePath - The path of the file to process.
 * @param {Logger} logger - The logger instance.
 * @param {FileHandlerOptions} options - Options for processing.
 * @returns {Promise<void>}
 */
async function processFile(filePath, logger, options) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const fileExtension = path.extname(filePath).toLowerCase();
    const handler = FILE_HANDLERS[fileExtension];

    if (handler) {
      await handler(filePath, fileContent, logger, options);
    } else {
      await logger?.info(`Unsupported file type, skipping: ${filePath}`);
    }
  } catch (error) {
    await logger?.error('Error processing file', { filePath, error: error.message });
  }
}

/**
 * Resolves Babel options based on the provided configuration.
 * @param {boolean|BabelOptions} useBabel - The Babel options object or boolean.
 * @returns {BabelOptions|null} The resolved Babel options or null if no valid options are provided.
 */
function resolveBabelOptions(useBabel) {
  if (!useBabel) return null;
  return {
    presets: [['@babel/preset-env', typeof useBabel === 'object' ? useBabel : {}]],
  };
}

/**
 * Options for Babel configuration.
 * @typedef {Object} BabelOptions
 * @property {string|string[]|Object.<string, string>} [targets] - Specifies the target environments for the code.
 * @property {'amd'|'umd'|'systemjs'|'commonjs'|'cjs'|'auto'|false} [modules] - Module format to use for the output.
 * @property {boolean} [debug] - Enables or disables debug mode.
 * @property {string[]} [include] - List of plugins or features to include.
 * @property {string[]} [exclude] - List of plugins or features to exclude.
 * @property {'usage'|'entry'|false} [useBuiltIns] - Determines how polyfills are added.
 * @property {2|3|{version: 2|3, proposals: boolean}} [corejs] - Specifies the version of core-js to use and whether to include proposals.
 * @property {boolean} [forceAllTransforms] - Forces the application of all transformations.
 * @property {string} [configPath] - Path to the configuration file.
 * @property {boolean} [ignoreBrowserslistConfig] - Ignores the browserslist configuration.
 * @property {boolean} [shippedProposals] - Enables support for shipped proposals.
 */

/**
 * Options for logging configuration.
 * @typedef {Object} LogOptions
 * @property {string} [logDir] - Specifies the directory for log files.
 * @property {number} [retentionDays] - Number of days to retain log files.
 * @property {string} [logLevel] - Specifies the level of logging (e.g., 'info', 'warn', 'error').
 * @property {string} [dateFormat] - Format for the date in log entries.
 * @property {string} [timeZone] - Time zone for timestamps in log entries.
 * @property {boolean} [logToConsole] - Determines if logs should also be output to the console.
 * @property {boolean} [logToFile] - Determines if logs should be written to a file.
 */

/**
 * Options for JavaScript minification (UglifyJS options).
 * @typedef {Object} JSMinifyOptions
 * @property {Object} [compress] - Compression options.
 * @property {boolean|Object} [mangle] - Mangling options.
 * @property {Object} [output] - Output format options.
 */

/**
 * Options for CSS minification (Clean-CSS options).
 * @typedef {Object} CSSMinifyOptions
 * @property {0|1|2|Object} [level] - Optimization level.
 * @property {string|string[]} [compatibility] - Browser compatibility options.
 * @property {string|Object} [format] - Output formatting options.
 */

/**
 * Options for minification configuration.
 * @typedef {Object} MinifyOptions
 * @property {string} [excludeFolder=''] - Folder to exclude from minification.
 * @property {boolean|BabelOptions} [useBabel=false] - Whether to use Babel for transformation, and the options for Babel if used.
 * @property {boolean|LogOptions} [useLog=true] - Whether to use logging, and the options for logging if used.
 * @property {JSMinifyOptions} [jsMinifyOptions={}] - Options for JavaScript minification.
 * @property {CSSMinifyOptions} [cssMinifyOptions={}] - Options for CSS minification.
 */

/**
 * Minifies all JavaScript and CSS files in the specified directory and its subdirectories.
 *
 * @param {string} contentPath - The path to the directory containing the files to be minified.
 * @param {MinifyOptions} [options={}] - Options for minification, Babel, and logging.
 * @returns {Promise<void>} A promise that resolves when all files have been processed.
 * @throws {Error} If there's an issue reading or writing files.
 */
export default async function minifyAll(contentPath, options = {}) {
  const {
    excludeFolder = '',
    useBabel = false,
    useLog = true,
    jsMinifyOptions = {},
    cssMinifyOptions = {},
  } = options;

  let logger = null;
  if (useLog) {
    const logOptions = typeof useLog === 'object' ? useLog : {};
    logger = new Logger(logOptions);
    await logger.initialize();
    await logger.info('Starting minification process', { contentPath, excludeFolder, useBabel });
  }

  const rootDir = path.resolve(contentPath || '');
  const babelOptions = resolveBabelOptions(useBabel);

  const processOptions = {
    babelOptions,
    jsMinifyOptions,
    cssMinifyOptions,
  };

  try {
    await getAllFiles(rootDir, async (filePath) => {
      const relativePath = path.relative(rootDir, filePath);
      if (
        excludeFolder &&
        (relativePath.startsWith(excludeFolder) ||
          relativePath.includes(path.sep + excludeFolder + path.sep))
      ) {
        await logger?.debug('Skipping excluded file', { filePath });
        return;
      }

      await processFile(filePath, logger, processOptions);
      logger?.incrementProcessedFiles(filePath);
    });
  } catch (error) {
    await logger?.error('Error in minification process', { error: error.message });
  }

  if (logger) {
    await logger.summarize();
  }
}
