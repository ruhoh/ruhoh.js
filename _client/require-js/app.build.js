({
    dir: "../require-js-build",
    paths : {
      'underscore': 'libs/underscore-1.3.1-amd', // AMD support
      'backbone': 'libs/backbone-0.9.1-amd', // AMD support
      'store': 'libs/backbone-localstorage', // AMD support
      'yaml' : 'libs/js-yaml',
      'handlebars' : 'libs/handlebars'
    },
	  optimize: "none",
    modules: [
        {
            name: "app"
        }
    ]
})