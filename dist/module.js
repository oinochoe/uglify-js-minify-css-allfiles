/**
 * uglify-js and minify-css for all files
 * Released under the terms of MIT license
 *
 * Copyright (C) 2024 yeongmin
 */

import { promises as fs } from 'fs';
import path from 'path';
import Logger from './modules/logger.js';
import { getAllFiles, writeFile } from './modules/fileHandler.js';
import { minifyJS, minifyCSS } from './modules/minifier.js';

const FILE_HANDLERS = {
    '.js': async (filePath, content, logger) => {
        const result = minifyJS(content);
        await writeFile(filePath, result, logger);
    },
    '.css': async (filePath, content, logger) => {
        const output = await minifyCSS(content);
        if (output.warnings.length > 0) {
            await logger.logError(filePath, `CSS warnings: ${output.warnings.join(', ')}`);
            await writeFile(filePath, null, logger);
        } else {
            await writeFile(filePath, output.styles, logger);
        }
    },
};

/**
 * Processes a single file based on its extension.
 * @async
 * @param {string} filePath - The path of the file to process.
 * @param {Logger} logger - The logger instance.
 * @returns {Promise<void>}
 */
async function processFile(filePath, logger) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const fileExtension = path.extname(filePath);
    const handler = FILE_HANDLERS[fileExtension];

    if (handler) {
        await handler(filePath, fileContent, logger);
    } else {
        logger.logInfo(`Skipping unsupported file type: ${filePath}`);
    }
}

/**
 * Minifies all JavaScript and CSS files in the specified directory and its subdirectories.
 *
 * @async
 * @function minifyAll
 * @param {string} contentPath - The path to the directory containing the files to be minified.
 * @param {string} [excludeFolder=''] - The name of a folder to exclude from minification.
 * @returns {Promise<void>} A promise that resolves when all files have been processed.
 * @throws {Error} If there's an issue reading or writing files.
 *
 * @example
 * // Minify all files in './test/' directory, excluding 'lib' folder
 * import minifyAll from './main.js';
 * await minifyAll('./test/', 'lib');
 *
 * @example
 * // Minify all files in a directory specified as a command line argument
 * import minifyAll from './main.js';
 * await minifyAll(process.argv[2], process.argv[3]);
 */
export default async function minifyAll(contentPath, excludeFolder = '') {
    const logger = new Logger();
    await logger.initialize();

    const rootDir = contentPath || '';

    await getAllFiles(rootDir, async (filePath) => {
        if (excludeFolder && filePath.includes(excludeFolder)) return;
        await processFile(filePath, logger);
    });

    await logger.summarize();
}
