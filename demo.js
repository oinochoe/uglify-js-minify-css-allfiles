import minifyAll from './dist/module.js';

minifyAll('./test/', {
  excludeFolder: 'lib',
  usePostCSS: {
    browsers: ['Chrome >= 40'],
    stage: 2,
    features: {
      'nesting-rules': true,
      'custom-properties': true,
      'color-functional-notation': true,
    },
    autoprefixer: {
      grid: true,
    },
  },
  useBabel: {
    targets: 'chrome 40',
    useAppendTransform: false,
    plugins: [],
  },
  useVersioning: {
    extensions: ['.png', '.jpg', '.webp', '.avif', '.svg'],
  },
  useJsMap: true,
  useCssMap: true,
});
