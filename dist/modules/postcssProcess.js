/**
 * PostCSS processor module for advanced CSS transformations
 * @module postcssProcessor
 */

import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import { resolveModulePath } from './pathResolver.js';

/**
 * Default PostCSS options
 * @type {Object}
 */
const DEFAULT_OPTIONS = {
  browsers: ['Chrome >= 40'],
  stage: 2,
  features: {
    'nesting-rules': true,
    'custom-properties': true,
    'color-functional-notation': true,
  },
  autoprefixer: {
    grid: true,
  },
};

/**
 * Processes CSS content using PostCSS
 * @async
 * @param {string} content - CSS content to process
 * @param {string} [filePath=''] - Source file path
 * @param {Object} [options={}] - PostCSS and preset-env options
 * @returns {Promise<{css: string, messages: Array}>} Processed CSS content
 */
export async function processWithPostCSS(content, filePath = '', options = {}) {
  try {
    // Merge options with defaults
    const presetEnvOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    // Configure plugins
    const plugins = [postcssPresetEnv(presetEnvOptions)];

    // Add any custom plugins from options
    if (options.plugins && Array.isArray(options.plugins)) {
      plugins.push(...options.plugins);
    }

    // Process the CSS
    const result = await postcss(plugins).process(content, {
      from: filePath || undefined,
      to: filePath || undefined,
    });

    return {
      css: result.css,
      messages: result.messages,
    };
  } catch (error) {
    console.error('Error processing CSS with PostCSS:', error);
    throw error;
  }
}

/**
 * Resolves PostCSS related module paths
 * @async
 * @returns {Promise<boolean>} Whether all modules are available
 */
export async function checkPostCSSAvailability() {
  try {
    await import(resolveModulePath('postcss'));
    await import(resolveModulePath('postcss-preset-env'));
    return true;
  } catch (error) {
    console.warn('PostCSS modules not available:', error.message);
    return false;
  }
}
