define([
  'jquery',
  'underscore',
  'backbone',
  'models/page',
  'models/layout',
  'models/payload',
  'models/preview',
  'parse',
  'router',
  'js-yaml',
  'mustache',
], function($, _, Backbone, Page, Layout, Payload, Preview, Parse, Router){
  
  var App = { 
    
    init : function(boot){
      this.setupRouter();
      if(typeof boot === "function") boot();
    },
    
    // Public: Setup Routing.
    // Preview rendering is handled by the Router.
    // Returns: Nothing
    setupRouter : function(){
      var that = this;
      
      this.Router = new Router;
      
      var config = {
        basePath : this.buildBasePath(window.location.origin + window.location.pathname),
        theme : (this.getQueryParam('theme') || 'twitter'),
        page: "/_sample_kit/post.html",
      }

      this.Router.bind("route:home", function(){
        console.log("Home Bind");
        config.page = "/_sample_kit/post.html";
        that.setupPreview(config);
      })
      
      this.Router.bind("route:page", function(page){
        console.log("Page Bind");
        config.page = "/_sample_kit/page.html";
        that.setupPreview(config);
      })
      
      // Hand off all link events to the Router.
      $("body").find('a').live("click", function(e){
        that.Router.navigate(this.href.split("/").pop(), {trigger: true})
        e.preventDefault();
        return false;
      });
      
      // Start Router.
      Backbone.history.start({pushState: true, root: "/~jade/"});
    },
    
    setupPreview : function(config){
      
      // TODO: Make this better and less hacky.
      _.extend(Backbone.Model.prototype, {
        basePath : config.basePath,
        theme : config.theme,
        
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
      
      this.preview = new Preview(config);
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

  };
  
  return App;
});
