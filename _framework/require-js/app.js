define([
  'jquery',
  'underscore',
  'backbone',
  'models/post',
  'models/layout',
  'models/payload',
  'models/preview',
  'layouts',
  'js-yaml',
  'mustache',
], function($, _, Backbone, Post, Layout, Payload, Preview){
  
  var App = { 
    init : function(boot){
      
      this.preview = new Preview();
      
      
      if(typeof boot === "function") boot();
    }
  };
  
  return App;
});
