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
  'models/partial',

  'collections/partials',

  'handlebars',
  'helpers',
  'markdown'
], function($, _, Backbone, Router, Parse, Log, yaml, 
  PagesDictionary, PostsDictionary, 
  Config, Layout, Page, Payload, Preview, Partial,
  Partials,
  Handlebars, helpers, Markdown){

  var App = { 
    
    // Public: Start the application relative to the site_source.
    // The web-server is responsible for passing site_source in the Header.
    // Once the site_source folder is known we can load _config.yml and start the app.
    //
    // Returns: Nothing
    start : function(){
      var that = this;
      
      $.get('/').pipe(function(a,b,jqxhr){
        that.config = new Config({'site_source' : '/' + jqxhr.getResponseHeader('x-ruhoh-site-source-folder') });
        return that.config.generate();
      }).done(function(){
        that.preview = new Preview(null, that.config);
        that.Router = new Router;
        that.initRouting();
      }).fail(function(jqxhr){
        Log.loadError(this, jqxhr)
      });
    },
    
    // Public: Setup Routing.
    // Preview rendering is handled by the Router.
    // Returns: Nothing
    initRouting : function(){
      var that = this;
      
      this.Router.bind("route:home", function(){
        that.preview.page.clear({silent : true})
        that.preview.page.set('id', 'index.md')
      })
      
      this.Router.bind("route:page", function(page){
        var id = page.split('?id=')[1] || page;
        
        that.preview.page.clear({silent : true})
        that.preview.page.set("id", id);
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
        root: (this.config.get('basePath') || '/')
      });
    }

  };
  
  return App;
});
