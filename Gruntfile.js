
var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {
  //console.log(grunt);
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    watch: {
      files: ['app/{,**/}*.js'],
      tasks: [], //'injector'
      livereload: {
        files: [
          'index.html',
          'app/{,**/,**/**/}*.html',
          '.tmp/styles/{,**/}*.css',
          'app/{,**/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      css: {
        files: 'app/{,**/}*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
      svg: {
        files: ['app/{,**/}*.svg'], // which files to watch
        tasks: [
          'svgstore',
        ],
        options: {
          nospawn: true
        }
      },
      js: {
        files: ['app/{,**/}*.js'],
        tasks: [
          //'ngAnnotate'
        ],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['/app/main.scss'],
        tasks: ['sass']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
    },
    connect: {
      options: {
        port: '9000',
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              modRewrite([
                '!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.gif|\\.ttf|\\.woff|\\.eof|apple-app-site-association$ /index.html'
                //'^[^\\.]*$ /index.html [L]'
              ]),
              connect().use('/apple-app-site-association', function(req, res, next) {
                res.setHeader('Content-Type', 'application/json');
                next();
              }),
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/styles',
                connect.static('./styles')
              ),
              connect.static('./')
            ];
          }
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '/scripts/{,**/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,**/}*.js']
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,**/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,**/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    injector: {
      options: {
        bowerPrefix: 'bower:',
      },
      bower_dependencies: {
        options: {
          ignorePath: '/bower_components/jquery'
        },
        files: {
          'index.html': ['bower.json']
        }
      },
      local_dependencies: {
        files: {
          'index.html': [
            'app/app.js',
            '{,**/}*.js',
            '{,**/}*.css',
            '!Gruntfile.js',
            '!node_modules/{,**/}*.{css,js}',
            '!bower_components/{,**/}*.{css,js}',
            '!custom_components/{,**/}*.{css,js}'
          ],
        }
      }
    },

    // browserify: {
    //   colors: {
    //     files: {
    //       'custom_components/colors/dist/colors.js': ['custom_components/colors/src/**/*.js', 'custom_components/colors/src/**/*.coffee']
    //     },
    //   }
    // },

    sass: {
      dist: {
        options: {
          style: 'expanded',
          lineNumbers: true,
          loadPath: require('node-neat').includePaths,
          sourceMap: null
        },
        files: {
          'app/main.css': 'app/main.scss'
        }
      }
    },

    // Renames files for browser caching purposes
    // filerev: {
    //   dist: {
    //     src: [
    //       '{,**/}*.js',
    //       '{,**/}*.css',
    //       '{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
    //       'fonts/*'
    //     ]
    //   }
    // },
    svgstore: {
      options: {
        //prefix : 'shape-', // This will prefix each <g> ID
        svg: {
          version: '1.1',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          'xmlns:dc': "http://purl.org/dc/elements/1.1/",
          'xmlns:cc': "http://creativecommons.org/ns#",
          'xmlns:rdf': "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
          'xmlns:sodipodi': "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd",
          'xmlns:inkscape': "http://www.inkscape.org/namespaces/inkscape"
        }
      },
      default: {
        files: {
          // output dest: [ path array ]
          'app/svg.html': ['app/*.svg','app/**/*.svg']
        }
      }
    },

    // // Test settings
    // karma: {
    //   unit: {
    //     configFile: 'test/karma.conf.js',
    //     singleRun: true
    //   }
    // },

    // ngAnnotate: {
    //     options: {
    //         singleQuotes: true,
    //     },
    //     all: {
    //       files: [{
    //               expand: true,
    //               cwd: 'app/',
    //               src: ['**/*.js'],
    //               dest: 'build/',
    //               ext: '.js'
    //               //ext: '.annotated.js', // Dest filepaths will have this extension.
    //               //extDot: 'last',       // Extensions in filenames begin after the last dot
    //       }]
    //     }
    // },

  });

  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-exec');
  //grunt.loadNpmTasks('grunt-browserify');
  //grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.registerTask('default', 'Compile then start a connect web server', function (target) {

    grunt.task.run([
      'sass',
      //'filerev',
      'injector',
      'svgstore',
      //'ngAnnotate',
      //'browserify',
      'connect:livereload',
      'watch'
    ]);

    // 'clean:server',
    // 'wiredep',
    // 'concurrent:server',
    // 'autoprefixer:server',

  });
};
