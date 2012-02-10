define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',
  'text!/~jade/data/post.html'
], function($, _, Backbone, z, file_contents){

	return Backbone.Model.extend({
		
		//get : function(attribute) {
		//	var value = Backbone.Model.prototype.get.call(this, attribute);
		//	return _.isUndefined(value) ? "" : value;
		//},
		
		// Matcher for YAML Front Matter
		FMregex : /^---\n(.|\n)*---\n/,
		
		initialize : function(){
		  var front_matter = this.FMregex.exec(file_contents);
      if(!front_matter) console.log("INVALID FRONT MATTER");
      front_matter = front_matter[0].replace(/---\n/g, "");

      this.data = jsyaml.load(front_matter);
      this.data.content = file_contents.replace(this.FMregex, "");
		}
	
	});

});