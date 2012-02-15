define([
  'jquery',
  'underscore',
  'backbone',
  'models/tags',
  'utils/log',
  'yaml'
], function($, _, Backbone, Tags, Log){
  
  // Site Model
  return Backbone.Model.extend({
    tags : Tags,
    
    initialize : function(attrs){
      this.set({
        time : new Date().toString(),
        posts : [],
        pages : [],
        categories : [],
      })
    },
    
    generate : function(){
      var that = this;
      return this.fetch({ dataType: "html", cache : false }).pipe(function(){
        return that.tags.generate().done(function(){
          that.set("tags", that.tags.get("data"))
        })
      })
    },

    url : function(){
      return this.config.getDataPath('/data/_config.yml');
    },

    parse : function(response){
      this.set(jsyaml.load(response));
      return this.attributes;
    }

  });

});