#!/usr/bin/env node
var commandLineArgs = require('command-line-args');
var workingDir = process.cwd();
var packageJson = require(workingDir + '/package.json');
var bowerJson = require(workingDir + '/bower.json');
var bower = require('bower');

var options = commandLineArgs([
  { name: 'dist', defaultValue: 'dist' },
  { name: 'git-repo', defaultValue: process.env.GIT_REMOTE_URL },
  { name: 'branch', defaultValue: packageJson.name + '-bower-component' }
]);

require('child_process')
  .spawn(__dirname + '/release.sh', [packageJson.version, workingDir, options.dist, options['git-repo'], options.branch], {stdio: 'inherit'})
  .on('close', function () {
    bower.commands.lookup(bowerJson.name).on('end', function(result) {
      if(!result) {
        bower.commands.register(bowerJson.name, options['git-repo']);
      }
    });
  });
