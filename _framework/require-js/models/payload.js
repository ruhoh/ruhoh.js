// Construct the Payload.
// Payload is a metadata structure passed into the templating system
// in this case : mustache.
define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',
  'json!/~jade/data/site.json',
  'text!/~jade/data/navigation.yaml',
  'text!/~jade/data/tags.yaml',
], function($, _, Backbone, z, site, navigation, tags){

  return Backbone.Model.extend({

    initialize : function(){
      // Set base variables
      this.set({
        "HOME_PATH" : "/JELLO",
        "BASE_PATH" : "/JELLO",
        site : site,
        content : null,
        buildUrl : function(){ 
          return function(name, render) {return render( "GUPPY" ) }
        }
      });
      
      this.set("navigation", jsyaml.load(navigation));
      this.set("tags", jsyaml.load(tags));
    }
  
  })
  
});