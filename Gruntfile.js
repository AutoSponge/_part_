module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                options: {
                    esnext: true,
                    reporter: require('jshint-stylish')
                },
                files: {
                    src: ['src/**/*.js']
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/src/<%= pkg.name %>.js',
                dest: 'build/src/<%= pkg.name %>.min.js'
            }
        },
        nodeunit: {
            all: ['test/*_test.js']
        },
        traceur: {
            options: {
                sourceMaps: true
            },
            custom: {
                files:{
                    'build/': ['src/**/*.js']
                }
            }
        },
        docco: {
            debug: {
                src: ['src/**/*.js'],
                options: {
                    output: 'build/docs/'
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['jshint', 'traceur', 'uglify', 'nodeunit', 'docco']);

};