declare module 'uglify-js-minify-css-allfiles' {
  export interface BabelOptions {
    targets?: string | string[] | { [key: string]: string };
    modules?: 'amd' | 'umd' | 'systemjs' | 'commonjs' | 'cjs' | 'auto' | false;
    debug?: boolean;
    include?: string[];
    exclude?: string[];
    useBuiltIns?: 'usage' | 'entry' | false;
    corejs?: 2 | 3 | { version: 2 | 3; proposals: boolean };
    forceAllTransforms?: boolean;
    configPath?: string;
    ignoreBrowserslistConfig?: boolean;
    shippedProposals?: boolean;
  }

  export interface LogOptions {
    logDir?: string;
    retentionDays?: number;
    logLevel?: string;
    dateFormat?: string;
    timeZone?: string;
    logToConsole?: boolean;
    logToFile?: boolean;
  }

  export interface MinifyOptions {
    excludeFolder?: string;
    useBabel?: boolean | BabelOptions;
    useLog?: boolean | LogOptions;
  }

  /**
   * Minifies all JavaScript and CSS files in the specified directory and its subdirectories.
   *
   * @param contentPath - The path to the directory containing the files to be minified.
   * @param options - Options for minification and logging.
   * @returns A promise that resolves when all files have been processed.
   * @throws {Error} If there's an issue reading or writing files.
   */
  export default function minifyAll(contentPath: string, options?: MinifyOptions): Promise<void>;
}
