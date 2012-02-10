// Construct the Payload.
// Payload is a metadata structure passed into the templating system
// in this case : mustache.
define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',
  'post',
  'json!/~jade/data/site.json',
  'text!/~jade/data/navigation.yaml',
  'text!/~jade/data/tags.yaml',
], function($, _, Backbone, z, Post, site, navigation, tags){
  
  var page = new Post();

  var Payload = {
    "HOME_PATH" : "/JELLO",
    "BASE_PATH" : "/JELLO",
    site : site,
    page : page.data,
    content : null,
    buildUrl : function(){ 
      return function(name, render) {return render( "GUPPY" ) }
    }
  }
  
  Payload.navigation = jsyaml.load(navigation);
  Payload.tags = jsyaml.load(tags);
  
  return Payload;
});