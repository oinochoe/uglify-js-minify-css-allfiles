/**
 * Minification module for JavaScript and CSS files.
 * @module minifier
 */

import { minify as uglifyJS } from 'uglify-js';
import CleanCSS from 'clean-css';

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
  return uglifyJS(content, mergedOptions).code;
}

/**
 * Minifies CSS content.
 * @async
 * @param {string} content - CSS content to minify.
 * @param {Object} [options={}] - Clean-CSS options.
 * @returns {Promise<{styles: string, warnings: string[]}>} Minified CSS and warnings.
 */
export function minifyCSS(content, options = {}) {
  const defaultOptions = {
    level: { 1: { all: false } },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return new Promise((resolve) => {
    new CleanCSS(mergedOptions).minify(content, (error, output) => resolve(output));
  });
}
