define([
  'jquery',
  'underscore',
  'backbone',
  'models/post',
  'models/layout',
  'models/payload',
  'models/preview',
  'js-yaml',
  'mustache',
], function($, _, Backbone, Post, Layout, Payload, Preview){
  
  var App = { 
    
    init : function(boot){
      this.preview = new Preview({
        root : (window.location.origin + window.location.pathname),
        theme : "twitter",
        master : "default",
        sub: "post"
      });
      
      if(typeof boot === "function") boot();
    }
  };
  
  return App;
});
