// Construct the Payload.
// Payload is a metadata structure passed into the templating system
// in this case : mustache.
define([
  'jquery',
  'js-yaml.min',
  'post',
  'json!/~jade/data/site.json',
  'text!/~jade/data/post.html',
  'text!/~jade/data/navigation.yaml',
  'text!/~jade/data/tags.yaml',
], function($, z, Post, site, raw_post, navigation, tags){
  
  var Payload = {
    "HOME_PATH" : "/JELLO",
    "BASE_PATH" : "/JELLO",
    site : site,
    page : Post.generate(raw_post),
    content : null,
    buildUrl : function(){ 
      return function(name, render) {return render( "GUPPY" ) }
    }
  }
  
  Payload.navigation = jsyaml.load(navigation);
  Payload.tags = jsyaml.load(tags);
  
  return Payload;
});