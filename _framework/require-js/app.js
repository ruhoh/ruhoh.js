define([
  'jquery',
  'underscore',
  'backbone',
  'router',
  'utils/parse',
  'utils/log',
  'yaml',
  
  'dictionaries/pages',
  'dictionaries/posts',
    
  'models/config',
  'models/layout',
  'models/page',
  'models/payload',
  'models/preview',
  'models/site',
  'models/partial',

  'collections/partials',

  'handlebars',
  'helpers',
  'markdown'
], function($, _, Backbone, Router, Parse, Log, yaml, 
  PagesDictionary, PostsDictionary, 
  Config, Layout, Page, Payload, Preview, Site, Partial,
  Partials,
  Handlebars, helpers, Markdown){

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
        that.preview.page.clear({silent : true})
        that.preview.page.set("url", 'index.md')
      })
      
      this.Router.bind("route:page", function(page){
        that.preview.page.clear({silent : true})
        that.preview.page.set("url", page);
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
