define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log'
], function($, _, Backbone, Log){
  
  // Config Model
  return Backbone.Model.extend({

    initialize : function(attrs){
      this.set({
        'time' : new Date().toString(),
        'basePath' : (attrs.basePath || '/'),
        'postsDirectory' : '_posts',
        'pagesDirectory' : '_pages',
      })
      this.buildBasePath();
      this.bind("change:basePath", this.buildBasePath, this);
    },

    generate : function(){
      return this.fetch({ dataType: "html", cache : false })
    },

    url : function(){
      return '/' + this.fileJoin(this.get('site_source'), '/_config.yml');
    },

    parse : function(response){
      this.set(jsyaml.load(response));
      this.validateConfig();
      return this.attributes;
    },
    
    // Ensure we have the required configuration settings.
    validateConfig : function(){
      if( !_.isString(this.get('theme')) )
        Log.configError('theme is not set. <br> ex: theme : my-theme')
    },
    
    // Internal: Get a normalized, absolute path for the App Session.
    // Normalizes submitted paths into a well-formed url.
    // Similar to File.join(a, b, c) in ruby.
    // 
    // arguments - (Optional) Takes a variable number of arguments
    //  representing a path to a particular asset.
    //
    // Returns: String - Normalized absolute URL path to asset.
    getPath : function(){
      if(arguments.length === 0)
        return this.get('basePath').join('/');

      return this.get('basePath').concat( 
        _.compact( 
          Array.prototype.slice.call(arguments).join("/").split('/')
         )
      ).join('/');
    },
    
    // Like ruby B)
    fileJoin : function(){
      if(arguments.length === 0) return '';
      return _.compact( 
          Array.prototype.slice.call(arguments).join('/').split('/')
        ).join('/');
    },
    
    // Internal : Builds the absolute URL path to assets relative to enabled theme.
    //
    // path - (Optional) String of a path to an asset.
    // Returns: String - Normalized absolute URL paath to theme assets.
    getThemePath : function(path){
      return this.getPath(this.get('site_source'), '_themes', this.get("theme"),  path);
    },
    
    getDataPath : function(path){
      return this.getPath(this.get('site_source'), path);
    },
    
    // Internal: Normalizes a root domain into a well-formed URL.
    // 
    // root - (Required) String the root url of the webpage the app loads within.
    // Returns: String - Normalized absolute URL root.
    buildBasePath : function(){
      var nodes = this.get("basePath").split('/');
      if(["", "index.html", 'index.md'].indexOf(_.last(nodes)) !== -1 ) nodes.pop();
      this.set("basePath", nodes);
    },
    
    // Thanks: Amr ElGarhy - http://stackoverflow.com/a/3388227/101940
    getQueryParam : function (variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return null;
    }
    
    
  });

});