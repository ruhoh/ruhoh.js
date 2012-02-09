// Construct the Payload.
// Payload is a metadata structure passed into the templating system
// in this case : mustache.
define([
  'jquery',
  'js-yaml.min'
], function($){

  var Payload = {
    "HOME_PATH" : "/JELLO",
    "BASE_PATH" : "/JELLO",
    site : null,
    page : null,
    content : null,
    buildUrl : function(){ 
      return function(name, render) {return render( "GUPPY" ) }
    }
  }
    
  $.getJSON("data/site.json", function(data){ 
    Payload.site = data;
  });
  $.getJSON("data/page.json", function(data){ 
    Payload.page = data;
  })
  $.get("data/navigation.yaml", function(data){ 
    Payload.navigation = jsyaml.load(data);
  })
  $.get("data/tags.yaml", function(data){ 
    Payload.tags = jsyaml.load(data);
  })
  
  return Payload;
});