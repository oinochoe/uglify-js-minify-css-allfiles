/**
 * Minification module for JavaScript and CSS files.
 * @module minifier
 */

import { minify as uglifyJS } from 'uglify-js';
import CleanCSS from 'clean-css';
import { processWithPostCSS, checkPostCSSAvailability } from './postcssProcess.js';

// Track PostCSS availability
let postCSSAvailable = null;

/**
 * Minifies JavaScript content.
 * @param {string} content - JavaScript content to minify.
 * @param {Object} [options={}] - UglifyJS options.
 * @returns {string} Minified JavaScript code.
 */
export function minifyJS(content, options = {}) {
  const defaultOptions = {
    compress: {
      pure_funcs: ['console.log', 'console.error', 'console.warn', 'console.info'],
      module: false,
      arrows: false,
      drop_debugger: true,
    },
    ie8: false,
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const result = uglifyJS(content, mergedOptions);

  return {
    code: result.code,
    map: result.map,
  };
}

/**
 * Minifies CSS content.
 * @async
 * @param {string} content - CSS content to minify.
 * @param {Object} [options={}] - Clean-CSS options.
 * @param {Object} [postcssOptions=null] - PostCSS configuration options, if null PostCSS is skipped.
 * @param {string} [filePath=''] - Path to the file being processed.
 * @param {boolean} [useCssMap=false] - Whether to generate and use a CSS source map file.
 * @returns {Promise<{styles: string, warnings: string[], map: string}>} Minified CSS, warnings and source map.
 */
export async function minifyCSS(content, options = {}, postcssOptions = null, filePath = '', useCssMap = false) {
  const defaultOptions = {
    level: { 1: { all: false } },
    sourceMap: !!useCssMap,
    sourceMapInlineSources: !!useCssMap,
  };

  const mergedOptions = { ...defaultOptions, ...options };
  let processedCSS = content;
  let previousSourceMap = null;

  // Check if PostCSS is available and enabled
  if (postCSSAvailable === null) {
    postCSSAvailable = await checkPostCSSAvailability();
  }

  // Process with PostCSS if available and enabled
  if (postCSSAvailable && postcssOptions !== null) {
    try {
      const result = await processWithPostCSS(content, filePath, postcssOptions);
      processedCSS = result.css;

      if (result.map) {
        previousSourceMap = result.map.toString();
      }

      // Handle warnings
      if (result.messages && result.messages.length > 0) {
        console.warn(`PostCSS warnings for ${filePath}:`, result.messages.map((msg) => msg.text).join('\n'));
      }
    } catch (error) {
      console.error(`PostCSS processing failed for ${filePath}:`, error);
      // Continue with original content if PostCSS fails
    }
  }

  // Use CleanCSS for final minification
  return new Promise((resolve) => {
    new CleanCSS(mergedOptions).minify(processedCSS, previousSourceMap, (error, output) => resolve(output));
  });
}
