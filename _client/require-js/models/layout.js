define([
  'jquery',
  'underscore',
  'backbone',
  'utils/parse',
  'utils/log',
  'yaml',
], function($, _, Backbone, Parse, Log){
  
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
      this.set(Parse.frontMatter(data, this.url()));
      this.set("content", Parse.content(data));
      return this.attributes;
    }
    
  });

});