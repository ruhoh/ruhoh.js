define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',  
], function($, _, Backbone){
  
  // Navigation Model
	return Backbone.Model.extend({

    url : function(){
      return '/~jade/data/navigation.yaml';
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