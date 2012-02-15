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
    
    init : function(appConfig, boot){
      this.appConfig = appConfig;
      this.preview = new Preview(null, this.appConfig);
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
        that.preview.page.set("id", "index.html")
      })
      
      this.Router.bind("route:page", function(page){
        that.preview.page.set("id", page);
      })
      
      // Hand off all link events to the Router.
      $("body").find('a').live("click", function(e){
        that.Router.navigate($(this).attr("href"), {trigger: true});
        e.preventDefault();
        return false;
      });
      
      // Start Router.
      Backbone.history.start({
        pushState: true, 
        root: (this.appConfig.basePath ? this.appConfig.basePath : window.location.pathname)
      });
    }

  };
  
  return App;
});
