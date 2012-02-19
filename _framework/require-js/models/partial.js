define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log',
  'handlebars'
], function($, _, Backbone, Log, Handlebars){
  
  // Partial Model
  return Backbone.Model.extend({

    generate : function(){
      return this.fetch({dataType : "html", cache : false });
    },
    
    url : function(){
      return this.config.getPath('/_framework/partials/', this.get('path'));
    },
    
    parse : function(data){
      Handlebars.registerPartial(this.id, data);
      return this.attributes;
    }
    
  });

});