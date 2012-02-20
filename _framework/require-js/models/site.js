define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log',
  'yaml'
], function($, _, Backbone, Log){
  
  // Site Model
  return Backbone.Model.extend({
    
    initialize : function(attrs){
      this.set({
        time : new Date().toString()
      })
    },
    
    generate : function(){
      return this.fetch({ dataType: "html", cache : false })
    },

    url : function(){
      return this.config.getDataPath('/_config.yml');
    },

    parse : function(response){
      this.set(jsyaml.load(response));
      return this.attributes;
    }

  });

});