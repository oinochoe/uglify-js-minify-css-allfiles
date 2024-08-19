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
import babelCore from '@babel/core';

const FILE_HANDLERS = {
    '.js': async (filePath, content, logger, babelOptions) => {
        try {
            // Transform the code using Babel with preset-env
            let transformed = content;

            // Convert code to Babel when Babel option is provided
            if (babelOptions) {
                transformed = babelCore.transformSync(content, babelOptions).code;
            }

            const result = minifyJS(transformed);
            await writeFile(filePath, result, logger);
        } catch (error) {
            await logger.logError(filePath, `Babel transformation failed: ${error.message}`);
        }
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
 * @param {Object} [babelOptions=null] - Babel options for converting JavaScript files.
 * @returns {Promise<void>}
 */
async function processFile(filePath, logger, babelOptions = null) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const fileExtension = path.extname(filePath);
    const handler = FILE_HANDLERS[fileExtension];

    if (handler) {
        await handler(filePath, fileContent, logger, babelOptions);
    } else {
        logger.logInfo(`지원되지 않는 파일 형식 건너뜀: ${filePath}`);
    }
}

/**
 * Minifies all JavaScript and CSS files in the specified directory and its subdirectories.
 *
 * @async
 * @function minifyAll
 * @param {string} contentPath - The path to the directory containing the files to be minified.
 * @param {string} [excludeFolder=''] - The name of a folder to exclude from minification.
 * @param {Object} [babelOptions=null] - Babel options for converting JavaScript files.
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
 *
 * @example
 * // Add babel options for converting JavaScript files.
 * minifyAll('./test/', 'lib', {
 *     presets: [
 *         [
 *             '@babel/preset-env',
 *             {
 *                 targets: {
 *                     esmodules: false, // Target ES2015
 *                 },
 *             },
 *         ],
 *     ],
 * });
 */
export default async function minifyAll(contentPath, excludeFolder = '', babelOptions = null) {
    const logger = new Logger();
    await logger.initialize();

    const rootDir = contentPath || '';

    await getAllFiles(rootDir, async (filePath) => {
        if (excludeFolder && filePath.includes(excludeFolder)) return;
        await processFile(filePath, logger, babelOptions);
    });

    await logger.summarize();
}
