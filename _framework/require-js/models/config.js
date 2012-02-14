define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',
], function($, _, Backbone){
  
  // Layout Model
  return Backbone.Model.extend({

    initialize : function(attrs){
      this.set({
        basePath : this.buildBasePath(window.location.origin + window.location.pathname),
        theme : (this.getQueryParam('theme') || 'twitter')
      });
    },
    
    // Internal: Get a normalized, absolute path for the App Session.
    // Normalizes submitted paths into a well-formed url.
    // 
    // path - (Optional) String representing a relative path to an asset.
    //
    // Returns: String - Normalized absolute URL path to asset.
    getPath : function(path){
      if(path)
        return this.get('basePath')
          .concat( _.compact(path.split('/')) )
          .join('/');
      else
        return this.get('basePath').join('/');
    },

    // Internal : Builds the absolute URL path to assets relative to enabled theme.
    //
    // path - (Optional) String of a path to an asset.
    // Returns: String - Normalized absolute URL paath to theme assets.
    getThemePath : function(path){
      return this.getPath("/themes/" + this.get("theme") + '/' + (path || ""));
    },
    
    // Internal: Normalizes a root domain into a well-formed URL.
    // 
    // root - (Required) String the root url of the webpage the app loads within.
    // Returns: String - Normalized absolute URL root.
    buildBasePath : function(root){
      var nodes = root.split('/');
      if(["", "index.html"].indexOf(_.last(nodes)) !== -1 ) nodes.pop();
      return nodes;
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