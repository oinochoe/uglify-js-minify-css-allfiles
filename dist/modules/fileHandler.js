/**
 * File handling module for minification process.
 * @module fileHandler
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Recursively gets all files in a directory and its subdirectories.
 *
 * @async
 * @param {string} dirPath - The path to the directory to search.
 * @param {Function} callback - The callback function to execute for each file.
 * @returns {Promise<void>}
 */
export async function getAllFiles(dirPath, callback) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStat = await fs.stat(filePath);
    if (fileStat.isFile()) {
      await callback(filePath, fileStat);
    } else if (fileStat.isDirectory()) {
      await getAllFiles(filePath, callback);
    }
  }
}

/**
 * Writes content to a file.
 *
 * @async
 * @param {string} filePath - The path of the file to write.
 * @param {string} content - The content to write to the file.
 * @param {Object} logger - The logger object for logging operations.
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
