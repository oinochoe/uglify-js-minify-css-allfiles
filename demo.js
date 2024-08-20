import minifyAll from './dist/module.js';

minifyAll('./test/', 'lib', { useBabel: true });

// minifyAll('./test/', 'lib', {
//     presets: [
//         [
//             '@babel/preset-env',
//             {
//                 targets: {
//                     esmodules: false, // Target ES2015
//                 },
//             },
//         ],
//     ],
// });
// console.log(process.argv.slice(2)[0], process.argv.slice(2)[1]);
// minifyAll(process.argv.slice(2)[0], process.argv.slice(2)[1]);
