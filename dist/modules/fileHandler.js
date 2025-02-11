/**
 * File handling module for minification process.
 * @module fileHandler
 */

import { promises as fs } from 'fs';
import { joinPaths, getExtension } from './pathResolver.js';

/**
 * Recursively gets all files in a directory and its subdirectories.
 * @async
 * @param {string} dirPath - The path to the directory to search
 * @param {Function} callback - Callback function for each file
 * @param {string} callback.filePath - Full path to the file
 * @param {fs.Stats} callback.fileStat - File statistics
 * @returns {Promise<void>}
 */
export async function getAllFiles(dirPath, callback) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const filePath = joinPaths(dirPath, file);
    const fileStat = await fs.stat(filePath);
    if (fileStat.isFile()) {
      await callback(filePath, fileStat);
    } else if (fileStat.isDirectory()) {
      await getAllFiles(filePath, callback);
    }
  }
}

/**
 * Writes content to a file with logging
 * @async
 * @param {string} filePath - Path to write the file
 * @param {string} content - Content to write
 * @param {Logger} [logger] - Logger instance for operation logging
 * @returns {Promise<void>}
 */
export async function writeFile(filePath, content, logger) {
  if (typeof content === 'undefined' || content === '' || content === null) {
    await logger?.error('Invalid or empty content', { filePath });
    return;
  }

  await logger?.info(`Writing file: ${filePath}`);
  try {
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    await logger?.error(`Write failed: ${error.message}`, { filePath });
  }
}

/**
 * Checks if a file should be versioned based on its extension
 * @param {string} filePath - Path to the file
 * @param {string[]} extensions - List of extensions to match against
 * @returns {boolean} Whether the file should be versioned
 */
export function shouldVersionFile(filePath, extensions) {
  const ext = getExtension(filePath);
  return extensions.includes(ext);
}
