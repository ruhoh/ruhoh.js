define([
  'jquery',
  'underscore',
  'backbone',
  'js-yaml',
], function($, _, Backbone){
  
  // Layout Model
	return Backbone.Model.extend({

    url : function(){
      return this.path +'/layouts/'+this.id +'.html';
    },
		
		initialize : function(attrs){
		  this.path = attrs.path;
		  this.deferred = this.fetch({dataType : "html", cache : false });
		},

		parse : function(response){
		  this.set("content", response);
		  return this.attributes;
		}
		
	});

});