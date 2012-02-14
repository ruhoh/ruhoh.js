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
      return this.config.getPath('/_sample_kit/site.json');
    }
    
  });

});