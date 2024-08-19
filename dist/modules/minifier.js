/**
 * Minification module for JavaScript and CSS files.
 * @module minifier
 */

import { minify as uglifyJS } from 'uglify-js';
import CleanCSS from 'clean-css';

/**
 * Options for CSS minification.
 * @constant {Object}
 */
const CSS_OPTIONS = {
    level: { 1: { all: false } },
};

/**
 * Minifies JavaScript content.
 *
 * @param {string} content - The JavaScript content to minify.
 * @returns {string} The minified JavaScript content.
 */
export function minifyJS(content) {
    return uglifyJS(content, {
        compress: {
            pure_funcs: ['console.log', 'console.error', 'console.warn', 'console.info'],
        },
    }).code;
}

/**
 * Minifies CSS content.
 *
 * @async
 * @param {string} content - The CSS content to minify.
 * @returns {Promise<Object>} A promise that resolves to the minification result.
 */
export function minifyCSS(content) {
    return new Promise((resolve) => {
        new CleanCSS(CSS_OPTIONS).minify(content, (error, output) => resolve(output));
    });
}
