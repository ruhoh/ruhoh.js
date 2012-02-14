define([
  'jquery',
  'underscore',
  'backbone',
  'models/layout',
  'parse',
  'js-yaml',
], function($, _, Backbone, Layout, Parse){

  // Page Model 
  // Represents a post or page.
  return Backbone.Model.extend({

    initialize : function(attrs){
      this.sub = new Layout;
      this.master = new Layout;
    },
    
    // Public: Fetch a page/post and resolve all template dependencies.
    // TODO: This probably can be implemented a lot better.
    // Returns: jQuery Deferred object. This ensures all despendencies
    //   are resolved before the generate promise is kept.
    generate : function(){
      console.log("generating page");
      var $dfd = $.Deferred();
      var that = this;

      $.when(this.fetch({dataType : "html", cache : false})).then(function(){

        that.sub.set("id", that.get("layout"));

        $.when(that.sub.generate()).then(function(){
          
          that.master.set("id", that.sub.get("layout"))
          
          $.when(that.master.generate()).then(function(){
            $dfd.resolve();
          })
          
        }).fail(function(a, status, message){
            throw(status + ": " + message + ": " + this.url);
          })

      })
      
      return $dfd;
    },
    
    url : function(){
      return this.getPath(this.id);
    },

    // Parse the raw page/post file.
    parse : function(data){ 
      this.set(Parse.frontMatter(data));
      this.set("content", Parse.content(data));
      return this.attributes;
    }

  });

});