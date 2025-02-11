/**
 * uglify-js and minify-css for all files
 * Released under the terms of MIT license
 * Copyright (C) 2024 yeongmin
 * @module module
 */

import { promises as fs } from 'fs';
import crypto from 'crypto';
import Logger from './modules/logger.js';
import { getAllFiles, writeFile, shouldVersionFile } from './modules/fileHandler.js';
import HashManager from './modules/hashManager.js';
import { minifyJS, minifyCSS } from './modules/minifier.js';
import { DEFAULT_IMAGE_EXTENSIONS, IMAGE_PATTERNS } from './modules/imageUtils.js';
import {
  resolveImagePath,
  resolveModulePath,
  makeRelativePath,
  containsFolder,
  getExtension,
  resolvePath,
} from './modules/pathResolver.js';

/**
 * Processes image references in files and adds/updates version hashes for cache busting.
 * Handles both JavaScript and CSS files differently:
 * - For JS files: Generates a random hash
 * - For CSS files: Generates a content-based hash
 *
 * @async
 * @param {RegExp} pattern - Regular expression pattern to match image references
 * @param {string} content - Content of the file being processed
 * @param {string} fileExt - File extension (e.g., '.js', '.css')
 * @param {string} filePath - Absolute path to the file being processed
 * @param {Logger} logger - Logger instance for tracking changes
 * @param {HashManager} hashManager - Manages content-based hashing for images
 * @param {string[]} targetExtensions - List of image extensions to process (e.g., ['.png', '.jpg'])
 * @returns {Promise<{content: string, modified: boolean}>} Modified content and whether changes were made
 */
async function processPattern(pattern, content, fileExt, filePath, logger, hashManager, targetExtensions) {
  const promises = [];
  let newContent = content;
  let modified = false;

  newContent = content.replace(pattern, (match, imagePath, _ext, queryString) => {
    if (imagePath.startsWith('data:')) {
      return match;
    }

    const absoluteImagePath = resolveImagePath(imagePath, filePath);
    if (!absoluteImagePath || !shouldVersionFile(absoluteImagePath, targetExtensions)) {
      return match;
    }

    if (fileExt === '.js') {
      const randomBytes = crypto.randomBytes(16);
      const newHash = randomBytes.toString('hex').substring(0, 8);
      const versionedPath = `${imagePath}?v=${newHash}`;
      modified = true;

      promises.push(
        logger?.info('Updated JS image reference with hash', {
          file: filePath,
          image: imagePath,
          newHash,
        }),
      );

      return match.replace(imagePath + (queryString || ''), versionedPath);
    }

    if (fileExt === '.css') {
      const marker = `__HASH_MARKER_${promises.length}__`;
      promises.push({ marker, imagePath, absoluteImagePath });
      return match.replace(imagePath + (queryString || ''), `${imagePath}?v=${marker}`);
    }

    return match;
  });

  if (fileExt === '.css' && promises.length > 0) {
    for (let i = 0; i < promises.length; i++) {
      const { marker, imagePath, absoluteImagePath } = promises[i];
      const { hash, changed } = await hashManager.generateHash(absoluteImagePath);

      if (!hash) {
        newContent = newContent.replace(`${imagePath}?v=${marker}`, imagePath);
        await logger?.warn('Failed to generate hash, keeping original URL', {
          file: filePath,
          image: imagePath,
        });
        continue;
      }

      if (changed) {
        modified = true;
        await logger?.info('Updated CSS image version', {
          file: filePath,
          image: imagePath,
          oldHash: hashManager.getPreviousHash(absoluteImagePath),
          newHash: hash,
        });
      }

      newContent = newContent.replace(`?v=${marker}`, `?v=${hash}`);
    }
  }

  await Promise.all(promises.filter((p) => p instanceof Promise));
  return { content: newContent, modified };
}

/**
 * Updates image references in a file with version query strings.
 * @async
 * @param {string} filePath - Path to the file to process.
 * @param {Object} versioningOptions - Options for versioning.
 * @param {string[]} [versioningOptions.extensions] - List of file extensions to version.
 * @param {Logger} logger - Logger instance.
 * @param {HashManager} hashManager - Hash manager instance.
 * @returns {Promise<void>}
 */
async function updateImageReferences(filePath, versioningOptions, logger, hashManager) {
  const { extensions } = versioningOptions;
  const targetExtensions =
    extensions || DEFAULT_IMAGE_EXTENSIONS.map((ext) => (ext === 'jpe?g' ? ['.jpg', '.jpeg'] : ['.' + ext.replace('?', '')])).flat();

  const fileExt = getExtension(filePath);
  const patterns = IMAGE_PATTERNS[fileExt.substring(1)] || [];

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let modified = false;

    for (const pattern of patterns) {
      const result = await processPattern(pattern, content, fileExt, filePath, logger, hashManager, targetExtensions);
      content = result.content;
      modified = modified || result.modified;
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8');
      await logger?.info('Updated file with versioned image references', {
        file: filePath,
      });
    }
  } catch (error) {
    await logger?.error('Failed to process file', {
      file: filePath,
      error: error.message,
    });
  }
}

/**
 * Resolves Babel options based on the provided configuration.
 * @param {boolean|BabelOptions} useBabel - The Babel options object or boolean.
 * @returns {Promise<BabelOptions|null>} - A promise that resolves to the Babel options or null if disabled.
 */
async function resolveBabelOptions(useBabel) {
  if (!useBabel) return null;

  try {
    const presetEnvUrl = resolveModulePath('@babel/preset-env');
    const presetEnv = await import(presetEnvUrl);

    return {
      presets: [[presetEnv.default, typeof useBabel === 'object' ? useBabel : {}]],
    };
  } catch (error) {
    console.error('Error loading @babel/preset-env:', error);
    return null;
  }
}

/**
 * Processes a single file based on its extension.
 * @async
 * @param {string} filePath - The path of the file to process.
 * @param {Logger} logger - The logger instance.
 * @param {Object} options - Processing options.
 * @param {BabelOptions} [options.babelOptions] - Babel transformation options.
 * @param {Object} [options.jsMinifyOptions] - JavaScript minification options.
 * @param {Object} [options.cssMinifyOptions] - CSS minification options.
 * @returns {Promise<void>}
 */
async function processFile(filePath, logger, options) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const fileExtension = getExtension(filePath);

    let result;
    if (fileExtension === '.js') {
      let transformed = fileContent;
      if (options.babelOptions) {
        const babelCoreUrl = resolveModulePath('@babel/core');
        const { transformSync } = await import(babelCoreUrl);
        transformed = transformSync(fileContent, options.babelOptions).code;
      }
      result = minifyJS(transformed, options.jsMinifyOptions);
    } else if (fileExtension === '.css') {
      const output = await minifyCSS(fileContent, options.cssMinifyOptions);
      if (output.warnings.length > 0) {
        await logger?.warn('CSS minification warnings', { filePath, warnings: output.warnings });
      }
      result = output.styles;
    } else {
      await logger?.info(`Unsupported file type, skipping: ${filePath}`);
      return;
    }

    await writeFile(filePath, result, logger);
  } catch (error) {
    await logger?.error('Error processing file', { filePath, error: error.message });
  }
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
 * @property {boolean|BabelOptions} [useBabel=false] - Whether to use Babel for transformation.
 * @property {boolean|LogOptions} [useLog=true] - Whether to use logging.
 * @property {JSMinifyOptions} [jsMinifyOptions={}] - Options for JavaScript minification.
 * @property {CSSMinifyOptions} [cssMinifyOptions={}] - Options for CSS minification.
 * @property {string[]|null} [useVersioning=null] - Options for file versioning.
 */

/**
 * Main function to minify all files and handle versioning.
 * @async
 * @param {string} contentPath - The path to process files from.
 * @param {MinifyOptions} [options={}] - Configuration options.
 * @returns {Promise<void>} - A promise that resolves when all files have been processed.
 * @throws {Error} If there's an issue reading or writing files.
 */
export default async function minifyAll(contentPath, options = {}) {
  const {
    excludeFolder = '',
    useBabel = false,
    useLog = true,
    jsMinifyOptions = {},
    cssMinifyOptions = {},
    useVersioning = null,
  } = options;

  let logger = null;
  if (useLog) {
    const logOptions = typeof useLog === 'object' ? useLog : {};
    logger = new Logger(logOptions);
    await logger.initialize();
    await logger.info('Starting minification process', {
      contentPath,
      excludeFolder,
      useBabel,
      useVersioning: !!useVersioning,
    });
  }

  const rootDir = resolvePath(contentPath || '');
  const babelOptions = await resolveBabelOptions(useBabel);
  const hashManager = useVersioning ? new HashManager(rootDir) : null;

  if (hashManager) {
    await hashManager.initialize();
  }

  const processOptions = {
    babelOptions,
    jsMinifyOptions,
    cssMinifyOptions,
  };

  try {
    await getAllFiles(rootDir, async (filePath) => {
      const relativePath = makeRelativePath(filePath, rootDir);
      if (excludeFolder && containsFolder(relativePath, excludeFolder)) {
        await logger?.debug('Skipping excluded file', { filePath });
        return;
      }

      await processFile(filePath, logger, processOptions);

      // Apply versioning after successful processing if enabled
      if (useVersioning && hashManager) {
        await updateImageReferences(filePath, useVersioning, logger, hashManager);
      }

      logger?.incrementProcessedFiles(filePath);
    });
  } catch (error) {
    await logger?.error('Error in minification process', { error: error.message });
  }

  if (logger) {
    await logger.summarize();
  }
}
