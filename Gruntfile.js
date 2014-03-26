'use strict';

var matchdep = require('matchdep');

/**
 * @param {{util, loadTasks, loadNpmTasks, initConfig, renameTask, registerTask, file:{readJSON}}} grunt
 */
module.exports = function (grunt) {
  // load all grunt tasks
  matchdep.filter('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('tasks');

  grunt.initConfig({

    //General tasks

    shell:{
      theme:{
        command:function(toWhich){
          var bootswatchDir = 'public/vendor/bootswatch/';
          var activeDir = 'active-theme';
          var cmd = '';
          if(typeof toWhich === 'string' && toWhich !== 'list'){
            cmd = 'rm -rf "' + bootswatchDir + activeDir + '"; ' +
              'ln -s "' + toWhich + '" "' + bootswatchDir + activeDir + '"';
          }else{
            cmd = 'ls "' + bootswatchDir + '"';
          }
          console.log('Running: ', cmd.blue);
          return cmd;
        },
        options:{
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      templates: {
        files: 'public/**/*.tmpl',
        tasks: ['ngtemplates:dev']
      },
      index: {
        files: 'public/index.html'
      },
      'js_app': {
        files: ['public/**/*.js', '!public/vendor/**/*.js'],
        tasks: ['browserify:dev_app']
      },
      'js_vendor': {
        files: 'public/vendor/**/*.js',
        tasks: ['browserify:dev_vendor']
      },
      css: {
        files: '{public,.tmp}/**/*.css'
      },
      'less_app': {
        files: ['public/**/*.less', '!public/vendor/**/*.less'],
        tasks: ['less:dev_app']
      },
      'less_vendor': {
        files: 'public/vendor/**/*.{less,css}',
        tasks: ['less:dev_vendor']
      },
      images: {
        files: 'public/**/*.{png,jpg,jpeg,gif,webp,svg}'
      },
      fonts: {
        files: 'public/**/*.{woff,otf,ttf,eot}'
      },
      server:{
        files: ['app.js', 'routes/**/*.js', 'lib/**/*.js', 'models/**/*.js'],
        tasks: ['express:dev'],
        options: {
          nospawn: true
        }
      }
    },

    express: {
      options: {
        script: 'app.js',
        output: '^Listening'
      },
      dev: {
        options: {
          port: 8000,
          'node_env': 'development'
        }
      }
    },


    clean: {
      tmp: '.tmp',
      prod: [
        '**/README.md',
        'tasks',
        '**.log',
        'public/*',
        'dest',
        '.tmp',
        '!public/favicon.ico',
        '!public/index.html',
        '!public/app*.js',
        '!public/app*.css',
        '!public/vendor',
        '!public/assets',
        '!public/*/assets',
        '!node_modules/**/*'
      ]
    },

    //Build-related Tasks
    jshint: {
      options: {
        node: true,
        esnext: true,
        es5: true,
        bitwise: true,
        camelcase: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        latedef: true,
        newcap: true,
        noarg: true,
        nonew: true,
        quotmark: 'single',
        regexp: true,
        trailing: true,
        undef: true,
        unused: true
      },
      dev: [
        'Gruntfile.js',
        'tasks/**/*.js'
      ],
      client: {
        src: ['public/**/*.js', '!public/vendor/**/*.js'],
        options: {
          browser: true,
          node: true,
          esnext: false,
          strict: true,
          globals: {
            angular: false,
            '$': false,
            jQuery: false,
            console: false,
            Phaser: false,
            WebFont: false
          }
        }
      },
      server: ['app.js', 'routes/**/*.js']
    },
    ngtemplates: {
      options: {
        module: {
          name: 'compiled-templates',
          define: true
        },
        base: 'public'
      },
      dev: {
        src: 'public/**/*.tmpl',
        dest: '.tmp/templates.js'
      },
      prod: {
        src: 'public/**/*.tmpl',
        dest: 'public/templates.js'
      }
    },
    less:{
      'dev_vendor': {
        files: {
          '.tmp/vendor.css': 'public/vendor.less'
        }
      },
      'dev_app': {
        files: {
          '.tmp/app.css': 'public/app.less'
        }
      },
      'prod_vendor': {
        files: {
          'public/vendor.css': 'public/vendor.less'
        }
      },
      'prod_app': {
        files: {
          'public/app.css': 'public/app.less'
        }
      }
    },
    browserify: {
      'dev_vendor': {
        src:  'public/vendor.js',
        dest: '.tmp/vendor.js',
        options: {
          shim:{
            jquery:{
              path: 'public/vendor/jquery/jquery.js',
              exports: 'jQuery'
            },
            phaser:{
              path: 'public/vendor/phaser/phaser.min.js',
              exports: 'Phaser'
            }
          }
        }
      },
      'dev_app': {
        src:  'public/app.js',
        dest: '.tmp/app.js'
      },
      'prod_vendor': {
        src:  'public/vendor.js',
        dest: 'public/vendor.js',
        options: {
          shim:{
            jquery:{
              path: 'public/vendor/jquery/jquery.js',
              exports: 'jQuery'
            },
            phaser:{
              path: 'public/vendor/phaser/phaser.min.js',
              exports: 'Phaser'
            }
          }
        }
      },
      'prod_app': {
        src:  'public/app.js',
        dest: 'public/app.js'
      }
    },
    useminPrepare: {
      html: 'public/index.html',
      options: {
        dest: 'public'
      }
    },
    usemin:{
      html: 'public/index.html',
      options:{
        base: 'public'
      }
    },
    filerev: {
      prod:{
        src: ['public/app.js','public/app.css']
      }
    }
  });

  grunt.registerTask('dev', [
    'clean:tmp',
    'ngtemplates:dev',
    'less:dev_vendor',
    'less:dev_app',
    'browserify:dev_vendor',
    'browserify:dev_app',
    'loadenv',
    'express:dev',
    'watch'
  ]);

  grunt.registerTask('prod', [
    'clean:tmp',
    'jshint',
    'ngtemplates:prod',
    'less:prod_vendor',
    'less:prod_app',
    'browserify:prod_vendor',
    'browserify:prod_app',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'filerev:prod',
    'usemin',
    'clean:prod'
  ]);

  grunt.registerTask('heroku:production', ['prod']);
  grunt.registerTask('build', ['prod']);

  grunt.registerTask('default', ['dev']);
};
