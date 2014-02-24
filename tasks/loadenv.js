module.exports = function (grunt) {
  'use strict';
  var fs = require('fs');
  grunt.registerTask(
    'loadenv',
    'Loads environment vars from .env into process.env',
    function(){
      if(fs.existsSync('.env')){
        fs.readFileSync('.env').toString('utf8').split('\n').forEach(function(v){
          var parts = v.split('=');
          process.env[parts[0]] = parts[1];
        });
      }
    }
  );
};
