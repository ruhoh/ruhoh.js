define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',
], function($, _, Backbone){
  
  // Layout Model
  return Backbone.Model.extend({

    initialize : function(attrs){
      this.deferred = this.fetch({dataType : "html", cache : false });
    },
    
    url : function(){
      return this.getThemePath('/layouts/'+ this.id +'.html');
    },
    
    parse : function(response){
      this.set("content", response);
      return this.attributes;
    }
    
  });

});