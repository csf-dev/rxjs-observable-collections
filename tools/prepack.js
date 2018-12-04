const fileMatcher = require('glob');
const fs = require('fs');

runBabel()
    .then(getFilenames('src/*.js', { ignore: '**/*.spec.js' }))
    .then(copySourceFiles);

function runBabel() {
    const { execFile } = require('child_process');
    return new Promise(function (res, rej) {
        execFile('npx', ['babel', 'src', '-d', 'dist', '--delete-dir-on-start', '--ignore', '**/*.spec.js'], function() {
            res();
        });
    });
}

function getFilenames(pattern, opts) {
    return function() {
      return new Promise(function(res, rej) {
          fileMatcher.glob(pattern, opts, function(err, filenames) {
              res(filenames);
          });
      });
    }
}

function copySourceFiles(filenames) {
    const filenameMatcher = /[^/]+\/(.+)\.js/;
    const copyPromises = filenames.map(filename => {
      const dest = filename.replace(filenameMatcher, 'dist/$1.js.flow');
      return new Promise(function(res, rej) { fs.copyFile(filename, dest, () => res()); });
    });
    return Promise.all(copyPromises);
}