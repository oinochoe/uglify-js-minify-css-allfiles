declare module 'uglify-js-minify-css-allfiles' {
  /**
   * Babel configuration options.
   * These options are passed directly to @babel/preset-env.
   */
  export interface BabelOptions {
    /**
     * Describes the environments you support/target for your project.
     * Can be a string (e.g., "last 2 versions", "safari >= 7"), an array of strings, or an object of minimum environment versions to support.
     */
    targets?: string | string[] | { [key: string]: string };

    /**
     * Enables transformation of ES6 module syntax to another module type.
     * Use false to preserve ES modules.
     */
    modules?: 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false;

    /** Enable debug output to see what Babel is doing. */
    debug?: boolean;

    /** Array of plugins to always include. */
    include?: string[];

    /** Array of plugins to always exclude/remove. */
    exclude?: string[];

    /**
     * Configures how Babel handles polyfills.
     * 'usage' adds specific imports for polyfills when they are used in each file.
     * 'entry' imports the full polyfill based on your target environments.
     */
    useBuiltIns?: 'usage' | 'entry' | false;

    /**
     * Specifies the core-js version used when useBuiltIns is set to 'usage' or 'entry'.
     */
    corejs?: 2 | 3 | { version: 2 | 3; proposals: boolean };

    /**
     * Forces Babel to apply all transformations, even if the target environment(s) support them natively.
     */
    forceAllTransforms?: boolean;

    /**
     * Path to a .browserslistrc file to use instead of targets.
     */
    configPath?: string;

    /**
     * Toggles whether or not browserslist config sources are used, which includes searching for any browserslist files or referencing the browserslist key inside package.json.
     */
    ignoreBrowserslistConfig?: boolean;

    /**
     * Toggles enabling support for builtin/feature proposals that have shipped in browsers.
     */
    shippedProposals?: boolean;

    /**
     * Enables the append-to-appendChild transform plugin.
     * When true, Element.append() calls are transformed to Element.appendChild() calls for compatibility with older browsers like Chrome 35.
     */
    useAppendTransform?: boolean;

    /**
     * Additional Babel plugins to include in the transformation process.
     */
    plugins?: Array<string | any[] | Function>;
  }

  /**
   * Configuration options for PostCSS processing.
   */
  export interface PostCSSOptions {
    /**
     * Target browsers for the CSS compatibility.
     * Can be an array of browser strings or a browserslist configuration object.
     */
    browsers?: string[] | { [key: string]: any };

    /**
     * CSS features stage level.
     * @default 2
     */
    stage?: 0 | 1 | 2 | 3 | 4 | 5;

    /**
     * Specific CSS features to enable/disable.
     */
    features?: {
      [key: string]: boolean;
    };

    /**
     * Autoprefixer options.
     */
    autoprefixer?: {
      [key: string]: any;
    };

    /**
     * Additional PostCSS plugins to use.
     */
    plugins?: Array<any>;
  }

  /**
   * Logging configuration options.
   */
  export interface LogOptions {
    /**
     * Specifies the directory where log files will be stored.
     * @default 'logs'
     */
    logDir?: string;

    /**
     * Number of days to keep log files before they are deleted.
     * @default 30
     */
    retentionDays?: number;

    /**
     * Sets the minimum level of messages that will be logged.
     * @default 'info'
     */
    logLevel?: 'error' | 'warn' | 'info' | 'debug';

    /**
     * Format for dates in log file names and entries.
     * @default 'YYYY-MM-DD'
     */
    dateFormat?: string;

    /**
     * Time zone used for timestamps in log entries.
     * @default 'UTC'
     */
    timeZone?: string;

    /**
     * Whether to output logs to the console in addition to (or instead of) writing to files.
     * @default true
     */
    logToConsole?: boolean;

    /**
     * Whether to write logs to files.
     * @default true
     */
    logToFile?: boolean;
  }

  /**
   * Configuration options for JavaScript minification (UglifyJS options).
   */
  export interface JSMinifyOptions {
    compress?: {
      dead_code?: boolean;
      drop_debugger?: boolean;
      conditionals?: boolean;
      evaluate?: boolean;
      booleans?: boolean;
      loops?: boolean;
      unused?: boolean;
      hoist_funs?: boolean;
      keep_fargs?: boolean;
      hoist_vars?: boolean;
      if_return?: boolean;
      join_vars?: boolean;
      cascade?: boolean;
      side_effects?: boolean;
      warnings?: boolean;
      [key: string]: any;
    };
    mangle?: boolean | object;
    output?: object;
    [key: string]: any;
  }

  /**
   * Configuration options for CSS minification (Clean-CSS options).
   */
  export interface CSSMinifyOptions {
    level?: 0 | 1 | 2 | { [key: string]: any };
    compatibility?: string | string[];
    format?: string | object;
    [key: string]: any;
  }

  /**
   * Configuration options for the minifyAll function.
   */
  export interface MinifyOptions {
    /**
     * Name of a folder to exclude from the minification process.
     * Useful for skipping already minified files or third-party libraries.
     * @default ''
     */
    excludeFolder?: string;

    /**
     * Enables Babel transformation of JavaScript files.
     * If true, uses default Babel settings.
     * If an object is provided, it should conform to the BabelOptions interface.
     * @default false
     */
    useBabel?: boolean | BabelOptions;

    /**
     * Enables PostCSS processing of CSS files.
     * If true, uses default PostCSS settings.
     * If an object is provided, it should conform to the PostCSSOptions interface.
     * @default false
     */
    usePostCSS?: boolean | PostCSSOptions;

    /**
     * Configures logging behavior.
     * If true, uses default logging settings.
     * If an object is provided, it should conform to the LogOptions interface.
     * @default true
     */
    useLog?: boolean | LogOptions;

    /**
     * Options for JavaScript minification (passed to UglifyJS).
     * @default {}
     */
    jsMinifyOptions?: JSMinifyOptions;

    /**
     * Options for CSS minification (passed to CleanCSS).
     * @default {}
     */
    cssMinifyOptions?: CSSMinifyOptions;

    /**
     * Enables source map generation for JavaScript files during minification.
     * Source maps help with debugging by mapping minified code back to original source code.
     * @default false
     */
    useJsMap?: boolean;

    /**
     * Enables source map generation for CSS files during minification.
     * Source maps help with debugging by mapping minified CSS back to original source code.
     * @default false
     */
    useCssMap?: boolean;
  }

  /**
   * Minifies all JavaScript and CSS files in the specified directory and its subdirectories.
   *
   * @param contentPath - The path to the directory containing the files to be minified.
   *                      This is the root directory from which the function will start searching for files.
   * @param options - Configuration options for the minification process.
   *                  These options control Babel usage, logging, and allow excluding certain folders.
   * @returns A promise that resolves when all files have been processed.
   * @throws {Error} If there's an issue reading or writing files, or if the minification process fails.
   *
   * @example
   * ```typescript
   * import minifyAll from 'uglify-js-minify-css-allfiles';
   *
   * await minifyAll('./src', {
   *   excludeFolder: 'node_modules',
   *   useBabel: {
   *     targets: '> 0.25%, not dead',
   *     useBuiltIns: 'usage',
   *     corejs: 3
   *   },
   *   usePostCSS: {
   *     browsers: ['Chrome >= 40'],
   *     stage: 2,
   *     features: {
   *       'nesting-rules': true,
   *       'custom-properties': true,
   *       'color-functional-notation': true,
   *     },
   *     autoprefixer: {
   *       grid: true,
   *     },
   *   },
   *   useLog: {
   *     logLevel: 'warn',
   *     retentionDays: 7
   *   },
   *   useJsMap: true,
   *   useCssMap: true
   * });
   * ```
   */
  export default function minifyAll(contentPath: string, options?: MinifyOptions): Promise<void>;
}
