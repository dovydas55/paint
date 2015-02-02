//npm install grunt-contrib-concat --save-dev
//npm install grunt-contrib-uglify --save-dev

module.exports = function( grunt ){
	//grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.initConfig({
	  uglify: {
    	dist: {
  	  		src:['build/js/concat.js'],
  	  		dest: 'build/js/ugly.min.js'
  	  	}
  	  },
  	  concat: {
  	  	dist: {
  	  		src:['SOLUTION/*.js'],
  	  		dest: 'build/js/concat.js'
  	  	}
  	  }
	});
}