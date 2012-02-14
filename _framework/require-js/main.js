require.config({
  baseUrl : "_framework/require-js/",
  urlArgs: "bust=" + (new Date()).getTime(),
  paths : {
    'underscore': 'libs/underscore-1.3.1-amd', // AMD support
    'backbone': 'libs/backbone-0.9.1-amd', // AMD support
    'store': 'libs/backbone-localstorage', // AMD support
  }  
});

require([
  'order!jquery',
  'underscore',
  'backbone',
  'app'
], function($, _, Backbone, App){
  App.init(CONFIG);
});