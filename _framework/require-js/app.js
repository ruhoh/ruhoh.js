define([
  'jquery',
  'underscore',
  'backbone',
  'payload',
  'layouts',
  'js-yaml',
  'mustache',
], function($, _, Backbone, Payload, Layouts){

  var App = { 
    init : function(boot){
      if(typeof boot === "function") boot();
    },
    
    build : function (){
      App.payload.content = App.payload.page.content;
      App.payload.content = $.mustache(App.layouts.post, App.payload);
      $("body").html($.mustache(App.layouts.master, App.payload));
    }
  };
  
  App.payload = Payload;
  App.layouts = Layouts;
  
  return App;
});
