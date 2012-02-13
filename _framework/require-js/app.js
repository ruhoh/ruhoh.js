define([
  'jquery',
  'underscore',
  'backbone',
  'models/post',
  'models/layout',
  'models/payload',
  'models/preview',
  'js-yaml',
  'mustache',
], function($, _, Backbone, Post, Layout, Payload, Preview){
  
  var App = { 
    
    init : function(boot){

      // TODO: Make this better and less hacky.
      var basePath = this.buildBasePath(window.location.origin + window.location.pathname);
      _.extend(Backbone.Model.prototype, {
        basePath : basePath,
        theme : "twitter",
        
        // Internal: Get a normalized, absolute path for the App Session.
        // Normalizes submitted paths into a well-formed url.
        // 
        // path - (Optional) String representing a relative path to an asset.
        //
        // Returns: String - Normalized absolute URL path to asset.
        getPath : function(path){
          if(path)
            return this.basePath
              .concat( _.compact(path.split('/')) )
              .join('/');
          else
            return this.basePath.join('/');
        },

        // Internal : Builds the absolute URL path to assets relative to enabled theme.
        //
        // path - (Optional) String of a path to an asset.
        // Returns: String - Normalized absolute URL paath to theme assets.
        getThemePath : function(path){
          return this.getPath("/themes/" + this.theme + '/' + (path || ""));
        }
        
      })
      
      this.preview = new Preview({
        master : "default",
        sub: "post",
        page: "post.html",
      });
      
      if(typeof boot === "function") boot();
    },
    

    // Internal: Normalizes a root domain into a well-formed URL.
    // 
    // root - (Required) String the root url of the webpage the app loads within.
    // Returns: String - Normalized absolute URL root.
    buildBasePath : function(root){
      var nodes = root.split('/');
      if(["", "index.html"].indexOf(_.last(nodes)) !== -1 ) nodes.pop();
      return nodes;
    }
        
  };
  
  return App;
});
