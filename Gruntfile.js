
var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {
  //console.log(grunt);
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // var appConfig = {
  //   app: require('./bower.json').appPath || ''
  // };

  grunt.initConfig({
    //globalConf: appConfig,
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
          //'webfont'
        ],
        options: {
          nospawn: true
        }
      },
      js: {
        files: ['app/{,**/}*.js'],
        tasks: [
          //'newer:jshint:all'
        ],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['/app/main.scss'],
        tasks: ['sass']
      },
      // compass: {
      //   files: ['{,**/}*.{scss,sass}'],
      //   tasks: ['compass:server', 'autoprefixer']
      // },
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
    // clean: {
    //   dist: {
    //     files: [{
    //       dot: true,
    //       src: [
    //         '.tmp',
    //         '/{,*/}*',
    //         '!/.git{,*/}*'
    //       ]
    //     }]
    //   },
    //   server: '.tmp'
    // },
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

    // wiredep: {
    //     app: {
    //         src: ['index.html'],
    //         ignorePath:  /\.\.\//,
    //         pwd: '{.}'
    //     },
    //     sass: {
    //         src: ['{,**/}*.{scss,sass}'],
    //         ignorePath: /(\.\.\/){1,2}bower_components\//
    //     },
    //     js: {
    //         src: ['{,**/}*.{js}'],
    //         ignorePath: [
    //           /(\.\.\/){1,2}bower_components\//,
    //           /(\.\.\/){1,2}node_modules\//
    //         ]
    //     }
    // },

    injector: {
      options: {
        bowerPrefix: 'bower:',
        // sort: function (a, b) {
        //     return (a === 'app.js' || a === 'angular.js') ? -1 : 0;
        // },
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


    // wiredep: {
    //
    //   app: {
    //     src: 'index.html',
    //     exclude: [
    //       'bower_components',
    //       'node_modules'
    //     ]
    //   },
    //   //css: 'app/*.css',
    //   //js: 'app/**/*.js',
    //   options: {
    //     cwd: '',
    //     devDependencies: true
    //   },
    //   // app: {
    //   //   src: ['index.html'],
    //   //   ignorePath:  /\.\./,
    //   //   exclude: []
    //   // },
    //   css: {
    //     src: ['app/{,**/}*.{css}'],
    //     //ignorePath: /(\.\.\/){1,2}bower_components\//
    //     exclude: [
    //       'bower_components',
    //       'node_modules'
    //     ]
    //   },
    //   js: {
    //     src: ['app/{,**/}*.{js}'],
    //     //ignorePath: [/\/bower_components\//,/\/node_modules\//]
    //     exclude: [
    //       'bower_components',
    //       'node_modules'
    //     ]
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
    filerev: {
      dist: {
        src: [
          '{,**/}*.js',
          '{,**/}*.css',
          '{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          'fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    // useminPrepare: {
    //   html: '/index.html',
    //   options: {
    //     dest: '',
    //     flow: {
    //       html: {
    //         steps: {
    //           js: ['concat', 'uglifyjs'],
    //           css: ['cssmin']
    //         },
    //         post: {
    //           // css: [{ // this keeps the minified file in separate lines - easier and faster to read
    //           //   name: 'cssmin',
    //           //   createConfig: function (context, block) {
    //           //     var generated = context.options.generated;
    //           //     generated.options = {
    //           //       keepBreaks: true
    //           //     };
    //           //   }
    //           // }]
    //         }
    //       }
    //     }
    //   }
    // },

    // Performs rewrites based on filerev and the useminPrepare configuration
    // usemin: {
    //   html: ['/{,**/}*.html'],
    //   css: ['/styles/{,**/}*.css'],
    //   options: {
    //     assetsDirs: [
    //       '',
    //       '/images',
    //       '/styles'
    //     ]
    //   }
    // },
    // imagemin: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '/images',
    //       src: '{,*/}*.{png,jpg,jpeg,gif}',
    //       dest: '/images'
    //     }]
    //   }
    // },
    //
    // svgmin: {
    //   options: {
    //     plugins: [
    //       {
    //         removeViewBox: false
    //       },
    //       {
    //         removeEmptyAttrs: false
    //       }
    //     ]
    //   },
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: 'app',
    //       src: '{,**/}*.svg',
    //       dest: 'app'
    //     }]
    //   }
    // },

    // htmlmin: {
    //   dist: {
    //     options: {
    //       collapseWhitespace: true,
    //       conservativeCollapse: true,
    //       collapseBooleanAttributes: true,
    //       removeCommentsFromCDATA: true,
    //       removeOptionalTags: true
    //     },
    //     files: [{
    //       expand: true,
    //       cwd: '',
    //       src: ['*.html', 'views/{,**/}*.html'],
    //       dest: ''
    //     }]
    //   }
    // },
    //
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
    // webfont: {
    //   icons: {
    //     src: 'app/**/*.svg',
    //     dest: 'app/fonts',
    //     options: {
    //
    //     }
    //   }
    // },
    //
    // // ng-annotate tries to make the code safe for minification automatically
    // // by using the Angular long form for dependency injection.
    // ngAnnotate: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       cwd: '.tmp/concat/scripts',
    //       src: '*.js',
    //       dest: '.tmp/concat/scripts'
    //     }]
    //   }
    // },
    //
    // // Replace Google CDN references
    // cdnify: {
    //   dist: {
    //     html: ['/*.html']
    //   }
    // },
    //
    // // Copies remaining files to places other tasks can use
    // copy: {
    //   dist: {
    //     files: [
    //       {
    //         expand: true,
    //         dot: true,
    //         cwd: '',
    //         dest: '',
    //         src: [
    //           '*.{ico,png,txt}',
    //           '.htaccess',
    //           '*.html',
    //           'views/{,**/}*.html',
    //           'images/{,*/}*.{webp}',
    //           'styles/fonts/{,*/}*.*'
    //         ]
    //       },
    //       {
    //         expand: true,
    //         cwd: '.tmp/images',
    //         dest: '/images',
    //         src: ['generated/*']
    //       },
    //       {
    //         expand: true,
    //         cwd: '/styles/fonts',
    //         dest: '/styles/',
    //         src: '{,**/}*.{eot,woff,ttf,svg}'
    //       },
    //       {
    //         expand: true,
    //         cwd: '/../.elasticbeanstalk',
    //         dest: '/.elasticbeanstalk/',
    //         src: '*'
    //       }
    //     ]
    //   },
    //   styles: {
    //     expand: true,
    //     cwd: '/styles',
    //     dest: '.tmp/styles/',
    //     src: '{,**/}*.css'
    //   },
    //   fonts: {
    //     expand: true,
    //     cwd: '/styles/fonts',
    //     dest: '.tmp/styles/fonts/',
    //     src: '{,**/}*.{eot,woff,ttf,svg}'
    //   }
    // },
    //
    // // Run some tasks in parallel to speed up the build process
    //concurrent: {
    //   server: [
    //    'compass:server'
    //   ],
    //   test: [
    //      'compass'
    //   ],
    //   dist: [
    //     'compass:dist',
    //     'imagemin',
    //     'svgmin'
    //   ]
    // },
    //
    // // Test settings
    // karma: {
    //   unit: {
    //     configFile: 'test/karma.conf.js',
    //     singleRun: true
    //   }
    // },
    //

  });

  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', 'Compile then start a connect web server', function (target) {

    grunt.task.run([
      'sass',
      'injector',
      'svgstore',
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
