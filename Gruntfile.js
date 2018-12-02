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
    watch: {
      files: ["public/**/*", "server/**/*", "!server/db.json", "!**/node_modules/**"],
      tasks: ["default", "express"],
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
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-express-server");

  grunt.registerTask("default", ["eslint"]);
  grunt.registerTask("serve", ["default", "express", "watch"]);
};
