import fs from 'fs/promises';
import path from 'path';

class Logger {
  static LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  static DEFAULT_LOG_LEVEL = 'info';

  constructor(options = {}) {
    const {
      logDir = 'logs',
      retentionDays = 30,
      logLevel = Logger.DEFAULT_LOG_LEVEL,
      dateFormat = 'YYYY-MM-DD',
      timeZone = 'UTC',
      logToConsole = true,
      logToFile = true,
    } = options;

    this.logDir = logDir;
    this.retentionDays = retentionDays;
    this.dateFormat = dateFormat;
    this.timeZone = timeZone;
    this.logToConsole = logToConsole;
    this.logToFile = logToFile;

    this.errorCount = 0;
    this.errorFiles = new Set();
    this.processedFiles = new Set();
    this.currentDate = this.getCurrentDate();
    this.logFilePath = this.getLogFilePath();

    this.setLogLevel(logLevel);
  }

  async initialize() {
    if (this.logToFile) {
      await this.createLogDirectory();
    }
    await this.cleanOldLogs();
  }

  async createLogDirectory() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
    } catch (error) {
      console.error(`Failed to create log directory: ${error.message}`);
    }
  }

  setLogLevel(level) {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel in Logger.LOG_LEVELS) {
      this.logLevel = Logger.LOG_LEVELS[normalizedLevel];
      console.log(`Log level set to "${normalizedLevel}"`);
    } else {
      console.warn(
        `Invalid log level "${level}". Using default level "${Logger.DEFAULT_LOG_LEVEL}".`,
      );
      this.logLevel = Logger.LOG_LEVELS[Logger.DEFAULT_LOG_LEVEL];
    }
  }

  async log(level, message, metadata = {}) {
    const logLevelValue = Logger.LOG_LEVELS[level.toLowerCase()] ?? Logger.LOG_LEVELS.info;
    if (logLevelValue <= this.logLevel) {
      const logMessage = this.formatLogMessage(level, message, metadata);

      if (this.logToConsole) {
        console[level.toLowerCase()](logMessage);
      }

      if (this.logToFile) {
        await this.appendLog(logMessage);
      }
    }
  }

  async error(message, metadata = {}) {
    this.errorCount++;
    if (metadata.filePath) {
      this.errorFiles.add(metadata.filePath);
    }
    await this.log('error', message, metadata);
  }

  async warn(message, metadata = {}) {
    await this.log('warn', message, metadata);
  }

  async info(message, metadata = {}) {
    await this.log('info', message, metadata);
  }

  async debug(message, metadata = {}) {
    await this.log('debug', message, metadata);
  }

  incrementProcessedFiles(filePath) {
    this.processedFiles.add(filePath);
  }

  async summarize() {
    const summary = this.formatSummary();
    await this.log('info', 'Processing Summary', { summary });
  }

  async appendLog(content) {
    if (this.logToFile) {
      try {
        await this.checkAndRotateLog();
        await fs.appendFile(this.logFilePath, content + '\n');
      } catch (error) {
        console.error(`Failed to write to log file: ${error.message}`);
      }
    }
  }

  async checkAndRotateLog() {
    const currentDate = this.getCurrentDate();
    if (currentDate !== this.currentDate) {
      this.currentDate = currentDate;
      this.logFilePath = this.getLogFilePath();
      await this.cleanOldLogs();
    }
  }

  getLogFilePath() {
    return path.join(this.logDir, `log-${this.currentDate}.log`);
  }

  getCurrentDate() {
    return new Date()
      .toLocaleString('en-US', {
        timeZone: this.timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split(',')[0]
      .replace(/\//g, '-');
  }

  async cleanOldLogs() {
    if (this.logToFile) {
      try {
        const files = await fs.readdir(this.logDir);
        const now = new Date();
        for (const file of files) {
          const filePath = path.join(this.logDir, file);
          const stats = await fs.stat(filePath);
          const diffDays = (now - stats.mtime) / (1000 * 60 * 60 * 24);
          if (diffDays > this.retentionDays) {
            await fs.unlink(filePath);
          }
        }
      } catch (error) {
        console.error(`Failed to clean old logs: ${error.message}`);
      }
    }
  }

  formatLogMessage(level, message, metadata) {
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: this.timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    let metadataStr = Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metadataStr}`;
  }

  formatSummary() {
    return {
      totalFilesProcessed: this.processedFiles.size,
      filesWithErrors: this.errorFiles.size,
      errorCount: this.errorCount,
      errorFiles: Array.from(this.errorFiles),
    };
  }
}

export default Logger;
