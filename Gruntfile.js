module.exports = function(grunt) {
	var package = grunt.file.readJSON('package.json'), // Project configuration.
		src_files = ["src/util.js", "src/core.js", "src/array.js", "src/map.js", "src/liven.js",
					"src/memoize.js", "src/binding.js", "src/state_machine/cjs_fsm.js",
					"src/state_machine/cjs_events.js", "src/template/cjs_parser.js",
					"src/template/cjs_template.js", "src/template/jsep.js"],
		enclosed_src_files = (["src/header.js"]).concat(src_files, "src/footer.js");

	grunt.initConfig({
		pkg: package,
		jshint: {
			source: {
				src: src_files
			},
			post_concat: {
				src: "build/cjs.js"
			}
		},
		uglify: {
			development: {
				options: {
					banner: '/*<%= pkg.name %> - v<%= pkg.version %>*/\n',
					report: 'gzip',
					sourceMapIn: "build/cjs.js.map",
					sourceMap: "build/cjs.min.js.map",
					sourceMappingURL: "cjs.min.js.map",
					sourceMapPrefix: 1
				},
				src: "build/cjs.js", // Use concatenated files
				dest: "build/cjs.min.js"
			},
			production: {
				options: {
					banner: '/*<%= pkg.name %> - v<%= pkg.version %>*/\n',
					sourceMap: "build/cjs.min.js.map",
					sourceMappingURL: "cjs.min.js.map",
					sourceMapRoot: '..',
					sourceMapPrefix: 1
				},
				src: "build/cjs.js", // Use concatenated files
				dest: "build/cjs.min.js"
			}
		},
		concat_sourcemap: {
			options: {
				banner: '/*<%= pkg.name %> - v<%= pkg.version %>*/\n',
				process: {
					data: {
						version: package.version // the updated version will be added to the concatenated file
					}
				},
				sourceRoot: '..'
			},
			js: {
				src: enclosed_src_files,
				dest: "build/cjs.js"
			}
		},
		concat: {
			options: {
				banner: '/*<%= pkg.name %> - v<%= pkg.version %>*/\n',
				process: {
					data: {
						version: package.version // the updated version will be added to the concatenated file
					}
				}
			},
			js: {
				src: enclosed_src_files,
				dest: "build/cjs.js"
			}
		},
		qunit: {
			files: ['test/unit_tests.html']
		},
		clean: {
			build: ["build/"]
		},
		watch: {
			test: {
				files: src_files.concat(['test/unit_tests.js', 'test/unit_tests/*.js']),
				tasks: ['jshint:source', 'concat_sourcemap', 'jshint:post_concat', 'qunit']
			},
			quickdev: {
				files: src_files,
				tasks: ['concat_sourcemap']
			},
			full: {
				files: src_files.concat(['test/unit_tests.js', 'test/unit_tests/*.js']),
				tasks: ['jshint:source', 'concat_sourcemap', 'jshint:post_concat', 'qunit', 'uglify']
			}
		},
		compress: {
			production: {
				options: {
					archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
				},
				files: [{
					expand: true,
					cwd: 'build/',
					src: '*',
					dest: '<%= pkg.name %>-<%= pkg.version %>'
				}]
			}
		}
	});

	grunt.registerTask('usetheforce_on', 'force the force option on if needed', 
		function() {
			if (!grunt.option('force')) {
				grunt.config.set('usetheforce_set', true);
				grunt.option( 'force', true );
			}
		});
	grunt.registerTask('usetheforce_restore', 'turn force option off if we have previously set it', 
			function() {
			if (grunt.config.get('usetheforce_set')) {
				grunt.option( 'force', false );
			}
		});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-concat-sourcemap');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compress');

	// Default task(s).
	grunt.registerTask('default', ['jshint:source', 'concat_sourcemap', 'jshint:post_concat', 'qunit', 'uglify:development']);
	grunt.registerTask('dev', ['usetheforce_on', 'jshint:source', 'concat_sourcemap', 'jshint:post_concat', 'qunit', 'uglify:development', 'watch:full', 'usetheforce_restore']);
	grunt.registerTask('quickdev', ['usetheforce_on', 'concat_sourcemap', 'watch:quickdev', 'usetheforce_restore']);
	grunt.registerTask('package', ['clean', 'jshint:source', 'concat', 'jshint:post_concat', 'qunit', 'uglify:production', 'compress']);
};
