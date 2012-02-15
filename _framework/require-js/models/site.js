define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log'
], function($, _, Backbone, Log){
  
  // Site Model
  return Backbone.Model.extend({
    
    initialize : function(attrs){

    },
    
    generate : function(){
      return this.fetch({ cache : false });
    },

    url : function(){
      return this.config.getDataPath('/data/site.json');
    }
    
  });

});