define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
  
  // Site Model
  return Backbone.Model.extend({
    
    initialize : function(attrs){

    },
    
    generate : function(){
      return this.fetch({ cache : false });
    },

    url : function(){
      return this.config.getPath('/_framework/sample_kit/data/site.json');
    }
    
  });

});