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
import babelCore from '@babel/core';

/**
 * Object containing handlers for different file types.
 * @type {Object.<string, function>}
 */
const FILE_HANDLERS = {
  /**
   * Handles JavaScript file minification.
   * @async
   * @param {string} filePath - The path of the JavaScript file.
   * @param {string} content - The content of the JavaScript file.
   * @param {Logger} logger - The logger instance.
   * @param {Object} options - Options for processing.
   * @param {Object} [options.babelOptions] - Babel transformation options.
   * @param {Object} [options.jsMinifyOptions] - JavaScript minification options.
   * @returns {Promise<void>}
   */
  '.js': async (filePath, content, logger, options) => {
    try {
      let transformed = content;
      if (options.babelOptions) {
        transformed = babelCore.transformSync(content, options.babelOptions).code;
      }
      const result = minifyJS(transformed, options.jsMinifyOptions);
      await writeFile(filePath, result, logger);
    } catch (error) {
      await logger?.error('JavaScript minification failed', { filePath, error: error.message });
    }
  },

  /**
   * Handles CSS file minification.
   * @async
   * @param {string} filePath - The path of the CSS file.
   * @param {string} content - The content of the CSS file.
   * @param {Logger} logger - The logger instance.
   * @param {Object} options - Options for processing.
   * @param {Object} [options.cssMinifyOptions] - CSS minification options.
   * @returns {Promise<void>}
   */
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
 * @param {Object} options - Options for processing.
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
 * @param {boolean|Object} useBabel - The Babel options object or boolean.
 * @returns {Object|null} The resolved Babel options or null if no valid options are provided.
 */
function resolveBabelOptions(useBabel) {
  if (!useBabel) return null;
  return {
    presets: [['@babel/preset-env', typeof useBabel === 'object' ? useBabel : {}]],
  };
}

/**
 * Options for Babel configuration.
 *
 * @typedef {Object} BabelOptions
 * @property {string|string[]|Object<string, string>} [targets] - Specifies the target environments for the code.
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
 *
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
 * Options for minification configuration.
 * @typedef {Object} MinifyOptions
 * @property {string} [excludeFolder=''] - Folder to exclude from minification.
 * @property {boolean|Object} [useBabel=false] - Whether to use Babel for transformation, and the options for Babel if used.
 * @property {boolean|Object} [useLog=true] - Whether to use logging, and the options for logging if used.
 * @property {Object} [jsMinifyOptions={}] - Options for JavaScript minification.
 * @property {Object} [cssMinifyOptions={}] - Options for CSS minification.
 */

/**
 * Minifies all JavaScript and CSS files in the specified directory and its subdirectories.
 *
 * @async
 * @function minifyAll
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
      if (excludeFolder && path.relative(rootDir, filePath).startsWith(excludeFolder)) {
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
