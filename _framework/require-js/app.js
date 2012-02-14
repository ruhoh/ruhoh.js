define([
  'jquery',
  'underscore',
  'backbone',
  'models/page',
  'models/layout',
  'models/payload',
  'models/preview',
  'models/config',
  'parse',
  'router',
  'js-yaml',
  'mustache',
], function($, _, Backbone, Page, Layout, Payload, Preview, Config, Parse, Router){
  
  var App = { 
    
    init : function(boot){
      this.preview = new Preview;
      this.Router = new Router;
      this.initRouting();

      if(typeof boot === "function") boot();
    },
    
    // Public: Setup Routing.
    // Preview rendering is handled by the Router.
    // Returns: Nothing
    initRouting : function(){
      var that = this;
      
      this.Router.bind("route:home", function(){
        console.log("Home Bind");
        that.preview.page.set("id", "/_framework/sample_kit/index.html")
      })
      
      this.Router.bind("route:page", function(page){
        console.log("Page Bind");
        that.preview.page.set("id", "/_framework/sample_kit/"+ page);
      })
      
      // Hand off all link events to the Router.
      $("body").find('a').live("click", function(e){
        that.Router.navigate(this.href.split("/").pop(), {trigger: true})
        e.preventDefault();
        return false;
      });
      
      // Start Router.
      Backbone.history.start({pushState: true, root: "/~jade/"});
    }

  };
  
  return App;
});
