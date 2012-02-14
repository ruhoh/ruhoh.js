define([
  'jquery',
  'underscore',
  'backbone',
  'models/layout',
  'models/config',
  'parse',
  'js-yaml',
], function($, _, Backbone, Layout, Config, Parse){

  // Page Model 
  // Represents a post or page.
  return Backbone.Model.extend({

    initialize : function(attrs){

    },
    
    // Public: Fetch a page/post and resolve all template dependencies.
    // Template promises are *piped* up to the parent page promise.
    // TODO: This probably can be implemented a lot better.
    // Returns: jQuery Deferred object. This ensures all despendencies
    //   are resolved before the generate promise is kept.
    generate : function(){
      console.log("generating page");
      var that = this;

      return this.fetch({dataType : "html", cache : false}).pipe(function(){
        if(!that.get("layout")) throw("Page/Post requires a valid layout setting. (e.g. layout: post) ");
        
        that.sub.set("id", that.get("layout"));
        return that.sub.generate().pipe(function(){
          if(that.sub.get("layout")){
            that.master.set("id", that.sub.get("layout"))
            return that.master.generate();
          }
        })
      }).fail(function(a, status, message){
        throw(status + ": " + message + ": " + this.url);
      })
    },
    
    url : function(){
      return this.config.getPath(this.id);
    },

    // Parse the raw page/post file.
    parse : function(data){ 
      this.set(Parse.frontMatter(data));
      this.set("content", Parse.content(data));
      return this.attributes;
    }

  });

});