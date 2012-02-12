define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',  
], function($, _, Backbone){
  
  // Navigation Model
	return Backbone.Model.extend({

		initialize : function(attrs){
		  this.deferred = this.fetch({dataType : "html", cache : false });
		},
    
    url : function(){
      return this.getPath('/data/navigation.yaml');
    },
    
		parse : function(response){
		  this.set("data", jsyaml.load(response));
		  return this.attributes;
		}
		
	});

});