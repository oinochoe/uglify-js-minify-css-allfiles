/**
 * Path resolution module for handling various file paths
 * @module pathResolver
 */

import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolves a module path to a URL
 * @param {string} moduleName - The name of the module to resolve
 * @param {string} [baseDir] - Base directory for resolution (defaults to current directory)
 * @returns {string} The resolved module path as a URL
 */
export function resolveModulePath(moduleName, baseDir = __dirname) {
  const modulePath = require.resolve(moduleName, { paths: [baseDir] });
  return pathToFileURL(modulePath).href;
}

/**
 * Resolves an image path relative to a source file
 * @param {string} imagePath - Image path to resolve
 * @param {string} sourceFilePath - Path of the source file
 * @returns {string|null} Resolved absolute path or null for special cases
 */
export function resolveImagePath(imagePath, sourceFilePath) {
  // Remove query strings and hash fragments
  imagePath = imagePath.split(/[?#]/)[0];

  // Handle absolute paths
  if (imagePath.startsWith('/')) {
    return path.join(process.cwd(), imagePath);
  }

  // Handle data URIs
  if (imagePath.startsWith('data:')) {
    return null;
  }

  // Handle HTTP/HTTPS URLs
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return null;
  }

  // Handle relative paths
  return path.resolve(path.dirname(sourceFilePath), imagePath);
}

/**
 * Makes a path relative to a base directory
 * @param {string} fullPath - Full path to convert
 * @param {string} baseDir - Base directory
 * @returns {string} Relative path
 */
export function makeRelativePath(fullPath, baseDir) {
  return path.relative(baseDir, fullPath);
}

/**
 * Gets a path's extension
 * @param {string} filePath - Path to process
 * @returns {string} File extension (with dot)
 */
export function getExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

/**
 * Joins path segments
 * @param {...string} paths - Path segments to join
 * @returns {string} Joined path
 */
export function joinPaths(...paths) {
  return path.join(...paths);
}

/**
 * Checks if a path contains a specific folder
 * @param {string} filePath - Path to check
 * @param {string} folderName - Folder name to look for
 * @returns {boolean} Whether the path contains the folder
 */
export function containsFolder(filePath, folderName) {
  const normalizedPath = path.normalize(filePath);
  return normalizedPath.includes(path.sep + folderName + path.sep) || normalizedPath.startsWith(folderName + path.sep);
}

/**
 * Resolves a path to its absolute form
 * @param {string} pathStr - Path to resolve
 * @returns {string} Absolute path
 */
export function resolvePath(pathStr) {
  return path.resolve(pathStr);
}
