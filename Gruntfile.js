module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    eslint: {
      all: [
        "public/*.js",
        "public/js/*.js",
        "server/*.js",
        "Gruntfile.js",
      ]
    },
    sass: {
      dist: {
        options: {
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'resource/sass',
          src: ['youchat.scss'],
          dest: 'public/css',
          ext: '.css'
        }]      
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/css',
          src: ['*.css', '!*.min.css'],
          dest: 'public/css',
          ext: '.min.css'
        }]
      }
    },
    watch: {
      files: ["public/**/*", "server/**/*", "!server/db.json", "!**/node_modules/**", "resource/sass/*.scss"],
      tasks: ["default", "express", "sass", "cssmin"],
      options: {
        spawn: false
      }
    },
    express: {
      web: {
        options: {
          script: "server/index.js",
          port: 3000
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-express-server");

  grunt.registerTask("default", ["eslint", "sass", "cssmin"]);
  grunt.registerTask("serve", ["default", "express", "watch"]);
};
