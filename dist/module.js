/**
 * uglify-js and minify-css allFiles
 * Released under the terms of MIT license
 *
 * Copyright (C) 2020 yeongmin
 */

const fs = require('fs');
const path = require('path');
const uglifyJS = require('uglify-js');
const cleanCSS = require('clean-css');
const DIRECTORY = {
    JAVASCRIPT: '.js',
    STYLESHEET: '.css',
};
const CSSOPTIONS = {
    level: { 1: { all: false } },
};
let errorFilesNumber = 0;
let errorFileObjects = [];

// getFiles..
const getAllFiles = (pathDir, callback) => {
    let files = fs.readdirSync(pathDir) || [];
    files.forEach((name) => {
        let filePath = path.join(pathDir, name);
        let fileState = fs.statSync(filePath);
        if (fileState.isFile()) {
            callback(filePath, fileState);
        } else if (fileState.isDirectory()) {
            getAllFiles(filePath, callback);
        }
    });
};

// minify All Files..
module.exports = async function minifyAll(contentsPath, exceptFolder) {
    let CONTENTSDIR = contentsPath || '';
    let EXCEPTIONFOLDER = exceptFolder || '';
    let result = '';
    getAllFiles(CONTENTSDIR, (paths) => {
        let code = fs.readFileSync(paths, 'utf-8');
        if (EXCEPTIONFOLDER !== '' && paths.includes(EXCEPTIONFOLDER)) return;
        if (paths.substr(-3) === DIRECTORY.JAVASCRIPT) {
            result = uglifyJS.minify(code, {
                compress: {
                    pure_funcs: ['console.log', 'console.error', 'console.warn', 'console.info'],
                },
            }).code;
            writeFiles(paths, result);
        } else if (paths.substr(-4) === DIRECTORY.STYLESHEET) {
            new cleanCSS(CSSOPTIONS).minify(code, function (error, output) {
                if (0 < output.warnings.length) {
                    console.error('CSS FILE ERROR!', output.warnings);
                    writeFiles(paths, null);
                    return;
                } else {
                    result = new cleanCSS(CSSOPTIONS).minify(code).styles;
                    writeFiles(paths, result);
                }
            });
        }
    });

    // writeFiles..
    function writeFiles(file, value) {
        // exception..
        if (typeof value == 'undefined' || value === '' || value === null) {
            console.error(
                '************error file ㅜㅜㅜㅜ***********\n' +
                    file +
                    '\n **********ㅗㅗㅗㅗㅗ error file********',
            );
            errorFilesNumber += 1;
            errorFileObjects.push(file);
            return;
        } else {
            console.info(file);
            fs.writeFile(file, value, 'utf-8', function (error) {
                if (error) return console.error(error);
            });
        }
    }

    if (0 < errorFileObjects.length) {
        console.info('file change ended... \nerrorFilesNumber : ' + errorFilesNumber);
        console.info('*******errorFileObjects******* : ' + errorFileObjects);
    }
};
