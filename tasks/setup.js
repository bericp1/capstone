module.exports = function (grunt) {
  'use strict';
  var prompt  = require('prompt'),
    replace   = require('replace'),
    exec = require('child_process').exec,
    path = require('path'),

    buildpackURL = 'https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git';
  grunt.registerTask(
    'setup',
    'Sets up the app by renaming it and creating a heroku app.',
    function(){
			prompt.message = '';
			prompt.delimeter = '';
			prompt.start();
			var done = this.async();
			prompt.get({
				properties:{
					name:{
						message: 'What should the name of the app be? '
					},
          heroku:{
            message: 'Do you want to create a heroku app (yes/[no])? ',
            validator: /y[es]*|n[o]?/i,
            warning: 'Must respond yes/no',
            'default': 'no'
          }
				}
			}, function(err, result){

        if(err){
          console.log(err);
          done(false);
          throw err;
        }else{

          replace({
            regex: /not\-a\-sock\-drawer/gi,
            replacement: result.name,
            paths: [path.join(__dirname, '..')],
            exclude: 'node_modules/*,.tmp/*,',
            recursive: true,
            silent: false,
            fileColor: 'white'
          });

          if(result.heroku.split('')[0].toLowerCase() === 'y'){
            prompt.get({
              properties:{
                herokuAppName: {
                  message: 'Heroku app name [' + result.name + ']? ',
                  'default': result.name
                }
              }
            },function(err1, result1){
              if(err1){
                console.log(err1);
                done(false);
                throw err1;
              }else{
                var appName = result1.herokuAppName;
                exec(
                  'heroku create ' + appName + ' --buildpack ' + buildpackURL +
                    ' && heroku labs:enable user-env-compile -a ' + appName +
                    ' && heroku config:set NODE_ENV=production' +
                    ' && heroku addons:add mongolab',
                  {
                    cwd: path.join(__dirname, '..')
                  },
                  function(err2, stdout, stderr){
                    if(err2){
                      console.log(err2, stderr.toString('utf8'));
                      done(false);
                      throw err2;
                    }else{
                      console.log(stdout.toString('utf8'));
                      done();
                    }
                  }
                );
              }
            });
          }else{
            done();
          }
        }
      });
    }
  );
};
