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

    // Fetch the page/post and resolve all template dependencies.
    // TODO: This probably can be implemented a lot better.
    initialize : function(attrs){
      var dfd = $.Deferred();
      var that = this;

      $.when(this.fetch({dataType : "html", cache : false})).then(function(){

        that.sub = new Layout({id :  that.get("layout") });

        $.when(that.sub.deferred).then(function(){
          
          that.master = new Layout({id : that.sub.get("layout") });
          
          $.when(that.master.deferred).then(function(){
            dfd.resolve();
          })
          
        }).fail(function(a, status, message){
            throw(status + ": " + message + ": " + this.url);
          })

      })
      
      this.deferred = dfd;
    },
    
    url : function(){
      return this.getPath('/data/'+this.id);
    },

    // Parse the raw page/post file.
    parse : function(data){ 
      this.set(Parse.frontMatter(data));
      this.set("content", Parse.content(data));
      return this.attributes;
    }

  });

});