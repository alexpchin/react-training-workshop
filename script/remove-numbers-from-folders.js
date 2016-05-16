/*
 * Written to rename X-foo-bar to foo-bar
 */

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function runCommand(folder) {
  var sectionName = folder.split('/')[0];
  var folderName = folder.split('/')[1];
  var regex = /\d{1,2}-([\w|-]*)/;

  var match = folderName.match(regex);

  if (match) {
    var newName = match[1];
    console.log('called', newName);
    fs.renameSync(folder, sectionName + '/' + newName);

  }
}

var targetDirectories = ['middle', 'end'];

targetDirectories.forEach(function(directory) {
  var subDirs = getDirectories(path.join('.', directory));
  subDirs.forEach(function(subDir) {
    runCommand(path.join('.', directory, subDir));
  });
});
