/**
 * Image utilities module for handling image paths and patterns
 * @module imageUtils
 */

// All supported image formats
export const DEFAULT_IMAGE_EXTENSIONS = ['png', 'jpe?g', 'gif', 'svg', 'webp', 'avif', 'jxl', 'heic', 'heif', 'bmp', 'tiff?'];

const IMAGE_EXT_PATTERN = DEFAULT_IMAGE_EXTENSIONS.join('|');

export const IMAGE_PATTERNS = {
  css: [
    // url() pattern that handles query parameters separately
    new RegExp(`url\\(['"]?([^'"()\\s?#]+\\.(${IMAGE_EXT_PATTERN}))([?][^'"()\\s]*)?['"]?\\)`, 'gi'),

    // image-set() pattern with separate query parameter capture
    new RegExp(
      `image-set\\(\\s*(?:['"]([^'"?#]+\\.(${IMAGE_EXT_PATTERN}))([?][^'"()\\s]*)?['"]\\s*(?:type\\(['"]image/[^'"]+['"]\\))?\\s*,?\\s*)+\\)`,
      'gi',
    ),

    // Additional pattern for complex background(CSS) declarations
    new RegExp(`(?:^|\\s|,)url\\(['"]?([^'"()\\s?#]+\\.(${IMAGE_EXT_PATTERN}))([?][^'"()\\s]*)?['"]?\\)`, 'gi'),
  ],
  js: [
    // String literal pattern that handles query parameters separately
    new RegExp(`=\\s*['"]([^'"()\\s?#]+\\.(${IMAGE_EXT_PATTERN}))([?][^'"()\\s]*)?['"]`, 'gi'),

    // WeakMap/transformed pattern for private static fields
    new RegExp(`[{]_:['"]([^'"()\\s?#]+\\.(${IMAGE_EXT_PATTERN}))([?][^'"()\\s]*)?['"][}]`, 'gi'),

    // Import/require pattern
    new RegExp(`(?:import|require)\\s*\\(?['"]([^'"?#]+\\.(${IMAGE_EXT_PATTERN}))([?][^'"()\\s]*)?['"]\\)?`, 'gi'),
  ],
};

/**
 * Parse URL and query parameters
 * @param {string} url - URL to parse
 * @returns {{path: string, params: URLSearchParams}} Parsed URL parts
 */
export function parseURL(url) {
  const [path, query] = url.split('?');
  return {
    path,
    params: new URLSearchParams(query || ''),
  };
}

/**
 * Updates image reference with version query string
 * @param {string} match - Full matched string
 * @param {string} imagePath - Image path without query parameters
 * @param {string} existingQuery - Existing query string (if any)
 * @param {string} version - Version string to append
 * @returns {string} Updated reference with version
 */
export function updateImageReference(match, imagePath, existingQuery, version) {
  // Skip data URIs
  if (imagePath.startsWith('data:')) {
    return match;
  }

  // Add version parameter, replacing any existing version
  const versionedPath = `${imagePath}?v=${version}`;

  // Replace while preserving the original structure
  return match.replace(imagePath + (existingQuery || ''), versionedPath);
}
