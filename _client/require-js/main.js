require.config({
  baseUrl : "/_client/require-js/",
  urlArgs: "bust=" + (new Date()).getTime(),
  paths : {
    'jquery' : 'libs/jquery-1.7.1',
    'underscore': 'libs/underscore-1.3.1-amd', // AMD support
    'backbone': 'libs/backbone-0.9.1-amd', // AMD support
    'store': 'libs/backbone-localstorage', // AMD support
    'yaml' : 'libs/js-yaml',
    'handlebars' : 'libs/handlebars',
    'markdown' : 'libs/markdown/Markdown.Converter'
  }  
});

require(['app'], function(App){
  App.init(CONFIG);
});