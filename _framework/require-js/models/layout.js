define([
  'jquery',
  'underscore',
  'backbone',
  'parse',
  'js-yaml',
], function($, _, Backbone, Parse){
  
  // Layout Model
  return Backbone.Model.extend({

    initialize : function(attrs){
      this.deferred = this.fetch({dataType : "html", cache : false });
    },
    
    url : function(){
      return this.getThemePath('/layouts/'+ this.id +'.html');
    },
    
    parse : function(data){
      this.set(Parse.frontMatter(data));
      this.set("content", Parse.content(data));
      return this.attributes;
    }
    
  });

});