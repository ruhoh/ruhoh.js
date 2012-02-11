define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',  
], function($, _, Backbone){
  
  // Tags Model
  // Perhaps this should be a collection but we don't
  // really need individual tag objects, just the sample data to iterate over.
	return Backbone.Model.extend({

    url : function(){
      return '/~jade/data/tags.yaml';
    },
		
		initialize : function(){
		  this.deferred = this.fetch({dataType : "html", cache : false });
		},

		parse : function(response){
		  this.set("data", jsyaml.load(response));
		  return this.attributes;
		}
		
	});

});