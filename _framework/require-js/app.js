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
  'models/tags',
  'models/partial',

  'collections/partials',

  'handlebars',
  'helpers'
  
], function($, _, Backbone, Router, Parse, Log, yaml, 
  PagesDictionary, PostsDictionary, 
  Config, Layout, Page, Payload, Preview, Site, Tags, Partial,
  Partials,
  Handlebars, helpers){

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
        that.preview.page.set("id", "index.html")
      })
      
      this.Router.bind("route:page", function(page){
        that.preview.page.clear({silent : true})
        that.preview.page.set("id", page);
      })
      
      // Hand off all link events to the Router.
      $("body").find('a').live("click", function(e){

        var url = ( $(this).attr('rel') === "post" )
          ? ( '_posts/' + $(this).attr("href") )
          : $(this).attr("href");
          
        that.Router.navigate(url, {trigger: true});
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
