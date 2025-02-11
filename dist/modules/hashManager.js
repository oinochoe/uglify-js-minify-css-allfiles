/**
 * Hash manager module for tracking file changes
 * @module hashManager
 */

import { promises as fs } from 'fs';
import crypto from 'crypto';
import { joinPaths } from './pathResolver.js';

const HASH_FILE = '.image-hashes.json';

/**
 * Hash manager class for tracking file changes and maintaining version history
 * @class
 */
export default class HashManager {
  /**
   * Creates a new HashManager instance
   * @param {string} rootDir - Root directory for hash file storage
   */
  constructor(rootDir) {
    this.hashFile = joinPaths(rootDir, HASH_FILE);
    this.hashes = new Map();
    this.initialized = false;
  }

  /**
   * Initializes the hash manager by loading existing hashes from file
   * @async
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const content = await fs.readFile(this.hashFile, 'utf-8');
      const savedHashes = JSON.parse(content);
      Object.entries(savedHashes).forEach(([key, value]) => {
        this.hashes.set(key, value);
      });
    } catch (error) {
      await this.save();
    }

    this.initialized = true;
  }

  /**
   * Saves current hashes to the hash file
   * @async
   * @returns {Promise<void>}
   */
  async save() {
    const hashObject = Object.fromEntries(this.hashes);
    await fs.writeFile(this.hashFile, JSON.stringify(hashObject, null, 2));
  }

  /**
   * Gets the previous hash for a file
   * @param {string} filePath - Path to the file
   * @returns {string|null} Previous hash value or null if not found
   */
  getPreviousHash(filePath) {
    return this.hashes.get(filePath);
  }

  /**
   * Updates the hash for a file and saves to disk
   * @async
   * @param {string} filePath - Path to the file
   * @param {string} hash - New hash value
   * @returns {Promise<void>}
   */
  async updateHash(filePath, hash) {
    this.hashes.set(filePath, hash);
    await this.save();
  }

  /**
   * Generates a hash for a file and checks if it changed
   * @async
   * @param {string} filePath - Path to the file
   * @returns {Promise<{hash: string|null, changed: boolean}>} Hash information
   */
  async generateHash(filePath) {
    try {
      // Check file existence
      try {
        await fs.access(filePath);
      } catch (error) {
        console.warn(`File not found: ${filePath}`);
        return { hash: null, changed: false };
      }

      const content = await fs.readFile(filePath);
      const newHash = crypto.createHash('md5').update(content).digest('hex').substring(0, 8);

      const previousHash = this.getPreviousHash(filePath);
      const changed = previousHash !== newHash;

      if (changed) {
        await this.updateHash(filePath, newHash);
      }

      return {
        hash: newHash,
        changed: changed || !previousHash,
      };
    } catch (error) {
      console.error(`Error generating hash for ${filePath}:`, error);
      return { hash: null, changed: false };
    }
  }
}
