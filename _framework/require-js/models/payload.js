define([
  'jquery',
  'underscore',
  'backbone',
], function($, _, Backbone){
  
  // Payload Model
  // payload is the data structure available to the templates via Mustache.
  return Backbone.Model.extend({

    initialize : function(){
      this.set({
        "HOME_PATH" : "/JELLO",
        "BASE_PATH" : "/JELLO",
        buildUrl : function(){ 
          return function(name, render) {return render( "GUPPY" ) }
        }
      });
    }
  
  })
  
});