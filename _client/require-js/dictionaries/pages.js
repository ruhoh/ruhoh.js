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
  // A page is referenced by its unique id attribute .
  // When working with pages you only need to reference its id.
  // Valid id nodes are expanded to the full page object via the dictionary.
  return Backbone.Model.extend({

    initialize : function(attrs){

    },
    
    generate : function(){
      return this.fetch({dataType : "html", cache : false });
    },
    
    url : function(){
      return this.config.getDataPath('/_database/pages_dictionary.yml');
    },
    
    parse : function(response){
      data = jsyaml.load(response);
      // Need to append the page id to urls for client-side rendering.
      // i.e. We need to tell javascript where the file is.
      for(id in data){
        data[id]['url'] += ('?path='+ this.config.fileJoin(this.config.get('pagesDirectory'), id))
        
      }

      this.set(data);
      return this.attributes;
    }
    
  });

});