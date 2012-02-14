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

    },
    
    generate : function(){
      return this.fetch({dataType : "html", cache : false });
    },
    
    url : function(){
      return this.config.getThemePath('/layouts/'+ this.id +'.html');
    },
    
    parse : function(data){
      this.set(Parse.frontMatter(data));
      this.set("content", Parse.content(data));
      return this.attributes;
    }
    
  });

});