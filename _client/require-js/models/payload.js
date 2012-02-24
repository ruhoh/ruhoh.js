define([
  'jquery',
  'underscore',
  'backbone',
  'utils/log'
], function($, _, Backbone, Log){
  
  // Payload Model
  // payload is the data structure available to the templates via Mustache.
  return Backbone.Model.extend({

    initialize : function(){
      this.set({
        buildUrl : function(){ 
          return function(name, render) {return render( "GUPPY" ) }
        }
      });
    }
  
  })
  
});