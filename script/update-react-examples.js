/*
 * Runs the below command in each example app (useful for upgrading the version of React used)
 */

var COMMAND = 'npm install --save react@15.0.0-rc.1 react-dom@15.0.0-rc.1';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function runCommand(directory) {
  console.log('Running command', directory);
  exec('cd ' + directory + ' && ' + COMMAND, function (error, stdout, stderr) {
    console.log('Finished running in', directory);
  });
}

var targetDirectories = ['beginning', 'middle'];

targetDirectories.forEach(function(directory) {
  // special case: beginning directory is not nested
  if (directory === 'beginning') {
    runCommand('beginning');
  } else {
    var subDirs = getDirectories(path.join('.', directory));
    subDirs.forEach(function(subDir) {
      runCommand(path.join('.', directory, subDir));
    });
  }
});

