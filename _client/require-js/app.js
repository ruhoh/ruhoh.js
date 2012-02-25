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
    
    // Public: Start the application using /config.json
    // Note we explicitely load as 'html' so we can manually process the JSON.
    // This is because jquery fails silently if JSON format is invalid.
    //
    // Returns: Nothing
    start : function(){
      var that = this;
      $.ajax({
        type: 'GET',
        url: "/config.json",
        dataType: "html",
        cache : false
      }).done(function(config) {
          try { config = JSON.parse(config) }
          catch (e) {
            Log.parseError(
              '/config.json', 
              'Ensure config.json contains valid JSON.'
              + '<br>Validate your config at: <a href="http://jsonlint.com/">http://jsonlint.com/</a>'
            );
          }
          
          // Good to go
          that.init(config)
        })
    },
    
    init : function(appConfig){
      this.appConfig = appConfig;
      this.preview = new Preview(null, this.appConfig);
      this.Router = new Router;
      this.initRouting();
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
        root: (this.appConfig.basePath || '/')
      });
    }

  };
  
  return App;
});
