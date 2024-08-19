/**
 * Logger module for handling log operations.
 * @module logger
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Get current formatted time string
 * @returns {string} Formatted time string
 */
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

/**
 * Logger class for handling log operations.
 * @class
 */
class Logger {
    /**
     * Create a Logger instance.
     * @param {string} [logDir='logs'] - The directory to store log files.
     */
    constructor(logDir = 'logs') {
        this.logDir = logDir;
        this.errorCount = 0;
        this.errorFiles = [];
    }

    /**
     * Initialize the logger by creating the log directory.
     * @async
     * @returns {Promise<void>}
     */
    async initialize() {
        try {
            await fs.mkdir(this.logDir, { recursive: true });
        } catch (error) {
            console.error(`Failed to create log directory: ${error.message}`);
        }
    }

    /**
     * Log an error message and write it to the error log file.
     * @async
     * @param {string} filePath - The path of the file where the error occurred.
     * @param {string} reason - The reason for the error.
     * @returns {Promise<void>}
     */
    async logError(filePath, reason) {
        const logMessage = `
=============== File Error ===============
Time: ${getCurrentTime()}
File: ${filePath}
Reason: ${reason}
==========================================
`;

        console.error(logMessage);
        this.errorCount++;
        this.errorFiles.push(filePath);

        try {
            await fs.appendFile(path.join(this.logDir, 'error.log'), logMessage);
        } catch (error) {
            console.error(`Failed to write to error log: ${error.message}`);
        }
    }

    /**
     * Log an informational message to the console.
     * @param {string} message - The message to log.
     */
    logInfo(message) {
        console.info(`[${getCurrentTime()}] ${message}`);
    }

    /**
     * Generate and log a summary of the processing results.
     * @async
     * @returns {Promise<void>}
     */
    async summarize() {
        const summary = `
=============== Processing Summary ===============
Time: ${getCurrentTime()}
Total files processed: ${this.errorCount + this.errorFiles.length}
Files with errors: ${this.errorCount}
Error files:
${this.errorFiles.map((file, index) => `  ${index + 1}. ${file}`).join('\n')}
==================================================
`;

        console.info(summary);

        try {
            await fs.appendFile(path.join(this.logDir, 'summary.log'), summary);
        } catch (error) {
            console.error(`Failed to write to summary log: ${error.message}`);
        }
    }
}

export default Logger;
