define([
  'jquery',
  'underscore',
  'backbone',
  'utils/parse',
  'utils/log',
  'yaml',  
], function($, _, Backbone, Parse, Log){
  
  // Pages Dictionary is a hash representation of all pages in the app.
  // This is used as the primary pages database for the application.
  // A page is referenced by its unique url attribute.
  // When working with pages you only need to reference its url identifier.
  // Valid id nodes are expanded to the full page object via the dictionary.
  return Backbone.Model.extend({

    initialize : function(attrs){

    },
    
    generate : function(){
      return this.fetch({dataType : "html", cache : false });
    },
    
    url : function(){
      return this.config.getDataPath('/data/pages.yml');
    },
    
    parse : function(response){
      this.set( jsyaml.load(response) );
      return this.attributes;
    }
    
  });

});