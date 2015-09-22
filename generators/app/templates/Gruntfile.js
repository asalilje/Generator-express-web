var request = require('request');

module.exports = function(grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-copy');

    var reloadPort = 35729,
        files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        develop: {
            server: {
                file: 'main.js'
            }
        },
        less: {
            dist: {
                files: {
                    'public/styles/style.css': 'content/styles/main.less'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', '*.js', 'routes/*.js', 'public/scripts/*.js'],
            options: {
                force: true
            }
        },
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer-core')({
                        browsers: ['last 2 version']
                    })
                ]
            },
            dist: {
                src: 'public/styles/style.css'
            }
        },
        copy: {
            images: {
                expand: true,
                cwd: '/content/images/',
                src: '**',
                dest: 'public/images/',
            },
        },
        webpack: {
            buildDev: {<% if (includeReact) { %>
            entry: "./content/scripts/main.jsx",<% } else { %>
            entry: "./content/scripts/main.js",<% } %>
            output: {
                path: "public/scripts",
                filename: "main.pack.js",
            },
            externals: {<% if (includeReact) { %>
                "react": "React",<% } %>
                "jquery": "$"
            },
            devtool: "source-map",
            stats: {
                // Configure the console output
                colors: true,
                modules: true,
                reasons: true
            },<% if (includeReact) { %>
            resolve: {
                extensions: ['', '.js', '.jsx']
            },
            module: {
                loaders: [
                    { test: /\.(jsx|js)$/, loader: 'babel-loader' }
                ]
            },<% } %>
            // stats: false disables the stats output

            storeStatsTo: "xyz", // writes the status to a variable named xyz

            progress: false, // Don't show progress
            // Defaults to true

            failOnError: false, // don't report error to grunt if webpack find errors
            // Use this if webpack errors are tolerable and grunt should continue

            watch: false, // use webpacks watcher
            // You need to keep the grunt process alive

            keepalive: false, // don't finish the grunt task
        // Use this in combination with the watch option
        }
    },
    watch: {
        options: {
            nospawn: true,
            livereload: reloadPort
        },
        server: {
            files: [
                'main.js',
                'app.js',
                'routes/*.js'
            ],
            tasks: ['jshint', 'develop', 'delayed-livereload']
        },
        js: {
            files: ['content/scripts/*.js*'],
            tasks: ['webpack', 'jshint'],
            options: {
                livereload: reloadPort
            }
        },
        less: {
            files: [
                'content/styles/*.less'
            ],
            tasks: ['less', 'postcss'],
                options: {
                livereload: reloadPort
            }
        },
        views: {
            files: ['views/*.jade'],
            options: {
                livereload: reloadPort
            }
        }
    }
});

grunt.config.requires('watch.server.files');
files = grunt.config('watch.server.files');
files = grunt.file.expand(files);

grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function() {
    var done = this.async();
    setTimeout(function() {
        request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function(err, res) {
            var reloaded = !err && res.statusCode === 200;
            if (reloaded) {
                grunt.log.ok('Delayed live reload successful.');
            } else {
                grunt.log.error('Unable to make a delayed live reload.');
            }
            done(reloaded);
        });
    }, 500);
});

grunt.registerTask('default', [
    'less',
    'postcss',
    'copy',
    'webpack',
    'jshint',
    'develop',
    'watch'
]);
};
