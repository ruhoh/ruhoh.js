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
    
    router : new Router,
    
    // Public: Start the application relative to the site_source.
    // The web-server is responsible for passing site_source in the Header.
    // Once the site_source folder is known we can load _config.yml and start the app.
    //
    // Returns: Nothing
    start : function(){
      var that = this;
      
      $.get('/').pipe(function(a,b,jqxhr){
        //that.config = new Config({'site_source' : '/' + jqxhr.getResponseHeader('x-ruhoh-site-source-folder') });
        that.config = new Config({'site_source' : '/' });
        return that.config.generate();
      }).done(function(){
        
        that.preview = that.router.preview = new Preview(null, that.config);
        that.router.start();
        
      }).fail(function(jqxhr){
        Log.loadError(this, jqxhr)
      });
    }
    
  }
  
  return App;
});
