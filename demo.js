import minifyAll from './dist/module.js';

minifyAll('./test/', {
  excludeFolder: 'lib',
  useBabel: {
    targets: 'chrome 40',
  },
});
