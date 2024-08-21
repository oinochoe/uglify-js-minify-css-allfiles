/**
 * Minification module for JavaScript and CSS files.
 * @module minifier
 */

import { minify as uglifyJS } from 'uglify-js';
import CleanCSS from 'clean-css';

/**
 * Minifies JavaScript content.
 *
 * @param {string} content - The JavaScript content to minify.
 * @param {Object} options - Options for JavaScript minification.
 * @returns {string} The minified JavaScript content.
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
 *
 * @async
 * @param {string} content - The CSS content to minify.
 * @param {Object} options - Options for CSS minification.
 * @returns {Promise<Object>} A promise that resolves to the minification result.
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
